// Run from the repository root: node 2026-11_argocon/test-presentation.cjs
// Add --screenshots to capture every slide into this deck's .conversion-check/.
const assert = require( 'node:assert/strict' );
const crypto = require( 'node:crypto' );
const fs = require( 'node:fs' );
const http = require( 'node:http' );
const path = require( 'node:path' );
const { execFileSync } = require( 'node:child_process' );
const puppeteer = require( 'puppeteer' );

const root = path.resolve( __dirname, '..' );
const source = path.join( __dirname, 'The Agent Broke It, The Agent Fixed It.pptx' );
const expected = JSON.parse( execFileSync( 'python3', [ '-c', `
import hashlib, json, posixpath, sys, zipfile
from xml.etree import ElementTree as E
ns = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
def rels(z, part):
    p = posixpath.dirname(part) + '/_rels/' + posixpath.basename(part) + '.rels'
    return {r.get('Id'): posixpath.normpath(posixpath.join(posixpath.dirname(part), r.get('Target')))
            for r in E.fromstring(z.read(p)) if r.get('TargetMode') != 'External'}
with zipfile.ZipFile(sys.argv[1]) as z:
    rel = rels(z, 'ppt/presentation.xml')
    presentation = E.fromstring(z.read('ppt/presentation.xml'))
    slides = []
    for slide in presentation.findall('p:sldIdLst/p:sldId', ns):
        part = rel[slide.get('{'+ns['r']+'}id')]
        tree = E.fromstring(z.read(part))
        shapes = []
        for shape in tree.findall('p:cSld/p:spTree/*', ns):
            if shape.tag.rsplit('}', 1)[-1] not in ('sp', 'pic', 'cxnSp'):
                continue
            metadata = shape.find('.//p:cNvPr', ns)
            texts = [''.join(t.text or '' for t in p.findall('.//a:t', ns))
                     for p in shape.findall('p:txBody/a:p', ns)]
            shapes.append({'id': metadata.get('id'), 'paragraphs': texts if any(texts) else []})
        notes_part = next(v for v in rels(z, part).values() if '/notesSlides/' in v)
        notes = E.fromstring(z.read(notes_part))
        note_paragraphs = []
        for shape in notes.findall('.//p:sp', ns):
            ph = shape.find('p:nvSpPr/p:nvPr/p:ph', ns)
            if ph is None or ph.get('type') == 'body':
                note_paragraphs.extend(''.join(t.text or '' for t in p.findall('.//a:t', ns))
                                       for p in shape.findall('p:txBody/a:p', ns))
        slides.append({'part': part, 'shapes': shapes, 'notes': [p for p in note_paragraphs if p.strip()]})
    assets = {posixpath.basename(p): hashlib.sha256(z.read(p)).hexdigest()
              for p in z.namelist() if p.startswith('ppt/media/') and not p.endswith('/')}
print(json.dumps({'slides': slides, 'assets': assets}))
`, source ], { encoding: 'utf8' } ) );

const mime = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'
};
const server = http.createServer( ( request, response ) => {
  const pathname = decodeURIComponent( new URL( request.url, 'http://localhost' ).pathname );
  if( pathname === '/favicon.ico' ) {
    response.writeHead( 204 ).end();
    return;
  }
  const filename = path.resolve( root, '.' + pathname );
  if( !filename.startsWith( root + path.sep ) || !fs.existsSync( filename ) || !fs.statSync( filename ).isFile() ) {
    response.writeHead( 404 ).end();
    return;
  }
  response.setHeader( 'Content-Type', mime[ path.extname( filename ) ] || 'application/octet-stream' );
  fs.createReadStream( filename ).pipe( response );
} );

async function main() {
  for( const [ filename, hash ] of Object.entries( expected.assets ) ) {
    const bytes = fs.readFileSync( path.join( __dirname, 'assets', filename ) );
    assert.equal( crypto.createHash( 'sha256' ).update( bytes ).digest( 'hex' ), hash, filename );
  }
  await new Promise( resolve => server.listen( 0, '127.0.0.1', resolve ) );
  let browser;
  try {
    browser = await puppeteer.launch( { headless: true } );
    const page = await browser.newPage();
    await page.setViewport( { width: 1280, height: 720 } );
    const errors = [];
    page.on( 'pageerror', error => errors.push( error.message ) );
    page.on( 'requestfailed', request => errors.push( request.url() ) );
    page.on( 'response', response => {
      if( response.status() >= 400 ) errors.push( `${response.status()} ${response.url()}` );
    } );
    const url = `http://127.0.0.1:${server.address().port}/2026-11_argocon/index.html`;
    await page.goto( url );
    await page.waitForFunction( () => window.Reveal && Reveal.isReady() );
    const actual = await page.evaluate( () => ( {
      slides: [ ...document.querySelectorAll( '.slides > section' ) ].map( slide => ( {
        part: slide.dataset.sourceSlide,
        shapes: [ ...slide.querySelectorAll( '[data-source-id]' ) ].map( shape => ( {
          id: shape.dataset.sourceId,
          paragraphs: [ ...shape.querySelectorAll( '.pptx-text p' ) ].map( p => p.textContent )
        } ) ),
        notes: [ ...slide.querySelectorAll( 'aside.notes p' ) ].map( p => p.textContent )
      } ) ),
      brokenImages: [ ...document.images ].filter( image => !image.complete || image.naturalWidth === 0 ).map( image => image.src ),
      version: Reveal.VERSION
    } ) );
    assert.deepEqual( actual.slides, expected.slides, 'Exact source order, shape text and speaker notes' );
    assert.deepEqual( actual.brokenImages, [], 'All original images load' );
    const screenshots = process.argv.includes( '--screenshots' );
    if( screenshots ) fs.mkdirSync( path.join( __dirname, '.conversion-check' ), { recursive: true } );
    for( let index = 0; index < expected.slides.length; index++ ) {
      if( index > 0 ) await page.keyboard.press( 'ArrowRight' );
      await page.waitForFunction( i => Reveal.getIndices().h === i, {}, index );
      await new Promise( resolve => setTimeout( resolve, 150 ) );
      if( screenshots ) await page.screenshot( { path: path.join( __dirname, '.conversion-check', `slide-${index + 1}.png` ) } );
      const bounds = await page.evaluate( () => {
        const slide = Reveal.getCurrentSlide().querySelector( '.pptx-slide' ).getBoundingClientRect();
        return { width: Math.round( slide.width ), height: Math.round( slide.height ) };
      } );
      assert.deepEqual( bounds, { width: 1280, height: 720 }, 'Unclipped 16:9 canvas' );
      if( index === 12 ) {
        const visibleCallout = await page.evaluate( () => [ '541', '542' ].every( id => {
          const text = Reveal.getCurrentSlide().querySelector( `[data-source-id="${id}"] .pptx-text p` );
          const box = text.getBoundingClientRect();
          const top = document.elementFromPoint( box.left + box.width / 2, box.top + box.height / 2 );
          return top.closest( '[data-source-id]' ).dataset.sourceId === id;
        } ) );
        assert.equal( visibleCallout, true, 'Third code callout is not hidden by misregistered source backgrounds' );
        const logo = await page.screenshot( { clip: { x: 1064, y: 14, width: 168, height: 69 } } );
        const paintedLogo = await page.evaluate( async base64 => {
          const image = new Image();
          image.src = 'data:image/png;base64,' + base64;
          await image.decode();
          const canvas = document.createElement( 'canvas' );
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext( '2d' );
          context.drawImage( image, 0, 0 );
          return context.getImageData( 0, 0, image.width, image.height ).data.some( ( channel, index ) => index % 4 !== 3 && channel < 180 );
        }, Buffer.from( logo ).toString( 'base64' ) );
        assert.equal( paintedLogo, true, 'Logo actually paints after keyboard navigation through the 3D slide stack' );
      }
    }
    await page.keyboard.press( 'ArrowLeft' );
    await page.waitForFunction( () => Reveal.getIndices().h === 15 );
    await page.keyboard.press( 'Escape' );
    assert.equal( await page.evaluate( () => Reveal.isOverview() ), true );
    await page.keyboard.press( 'Escape' );
    await page.reload();
    await page.waitForFunction( () => Reveal.isReady() && Reveal.getIndices().h === 15 );
    const popupPromise = new Promise( resolve => page.once( 'popup', resolve ) );
    await page.keyboard.press( 's' );
    const notes = await Promise.race( [
      popupPromise,
      new Promise( ( _, reject ) => setTimeout( () => reject( new Error( 'Speaker view did not open' ) ), 10000 ) )
    ] );
    await notes.waitForFunction( () => document.body.textContent.includes( 'Land the ask, then stop talking.' ) );
    await notes.close();
    await page.setViewport( { width: 390, height: 844 } );
    await page.waitForFunction( () => Reveal.getScale() < 1 );
    const small = await page.evaluate( () => {
      const box = Reveal.getCurrentSlide().querySelector( '.pptx-slide' ).getBoundingClientRect();
      return box.left >= -1 && box.top >= -1 && box.right <= innerWidth + 1 && box.bottom <= innerHeight + 1;
    } );
    assert.equal( small, true, 'Canvas fits a narrow mobile viewport' );
    assert.deepEqual( errors, [], 'No script, resource or HTTP failures' );
    console.log( `PASS: ${actual.slides.length} slides, ${actual.slides.reduce( ( count, slide ) => count + slide.shapes.length, 0 )} drawings, all text and notes, ${Object.keys( expected.assets ).length} byte-identical assets; Reveal ${actual.version}; keyboard/back/overview/hash reload, speaker view and mobile scaling.` );
  }
  finally {
    if( browser ) await browser.close();
    await new Promise( resolve => server.close( resolve ) );
  }
}

main().catch( error => {
  console.error( error );
  process.exitCode = 1;
} );
