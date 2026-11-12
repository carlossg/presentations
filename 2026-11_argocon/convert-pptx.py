#!/usr/bin/env python3
"""Rebuild this Reveal.js deck locally from the adjacent, unmodified PPTX."""

import html
import math
import posixpath
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

HERE = Path(__file__).resolve().parent
SOURCE = HERE / "The Agent Broke It, The Agent Fixed It.pptx"
NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
EMU = 9525
COLORS = {}


def find(node, path):
    return node.find(path, NS) if node is not None else None


def all_nodes(node, path):
    return node.findall(path, NS) if node is not None else []


def esc(value):
    return html.escape(str(value), quote=True)


def px(value):
    return float(value) / EMU


def number(value):
    return f"{value:.4f}".rstrip("0").rstrip(".") or "0"


def color(parent, default="#000000"):
    if parent is None:
        return default
    for child in parent:
        kind = child.tag.rsplit("}", 1)[-1]
        if kind in ("srgbClr", "sysClr", "schemeClr"):
            raw = child.get("val", "000000")
            raw = COLORS.get(raw, raw) if kind == "schemeClr" else raw
            raw = child.get("lastClr", raw) if kind == "sysClr" else raw
            rgb = [int(raw[i:i + 2], 16) for i in (0, 2, 4)]
            for modifier in child:
                operation = modifier.tag.rsplit("}", 1)[-1]
                amount = float(modifier.get("val", "100000")) / 100000
                if operation in ("tint", "lumOff"):
                    rgb = [round(c + (255 - c) * amount) for c in rgb]
                elif operation in ("shade", "lumMod"):
                    rgb = [round(c * amount) for c in rgb]
            alpha = find(child, "a:alpha")
            if alpha is not None:
                return f"rgba({','.join(map(str, rgb))},{float(alpha.get('val')) / 100000})"
            return "#" + "".join(f"{c:02x}" for c in rgb)
    return default


def fill(properties):
    solid = find(properties, "a:solidFill")
    if solid is not None:
        return color(solid)
    gradient = find(properties, "a:gradFill")
    if gradient is not None:
        stops = [
            f"{color(stop)} {float(stop.get('pos')) / 1000}%"
            for stop in all_nodes(gradient, "a:gsLst/a:gs")
        ]
        linear = find(gradient, "a:lin")
        angle = float(linear.get("ang", "0")) / 60000 if linear is not None else 0
        return f"linear-gradient({angle + 90}deg,{','.join(stops)})"
    return "transparent"


def relationships(archive, part):
    path = posixpath.join(posixpath.dirname(part), "_rels", posixpath.basename(part) + ".rels")
    if path not in archive.namelist():
        return {}
    return {
        rel.get("Id"): (
            rel.get("Target") if rel.get("TargetMode") == "External"
            else posixpath.normpath(posixpath.join(posixpath.dirname(part), rel.get("Target")))
        )
        for rel in ET.fromstring(archive.read(path))
    }


def paragraphs(body):
    return [
        "".join(node.text or "" for node in paragraph.iter() if node.tag == f"{{{NS['a']}}}t")
        for paragraph in all_nodes(body, "a:p")
    ]


def link_text(text):
    domains = (
        "github.com", "linkedin.com", "speakerdeck.com", "blog.cloudflare.com",
        "reuters.com", "dora.dev", "www.sonarsource.com", "coderabbit.ai",
        "venturebeat.com", "quarkus.io", "agent-sandbox.sigs.k8s.io",
        "www.sec.gov",
    )
    pattern = r"(?:https?://|(?:" + "|".join(re.escape(domain) for domain in domains) + r")/?)[^\s]*"
    parts = []
    start = 0
    for match in re.finditer(pattern, text):
        parts.append(esc(text[start:match.start()]))
        value = match.group()
        url = value if value.startswith("http") else "https://" + value
        parts.append(f'<a href="{esc(url)}" target="_blank" rel="noopener noreferrer">{esc(value)}</a>')
        start = match.end()
    parts.append(esc(text[start:]))
    return "".join(parts)


def text_body(body, rels):
    settings = find(body, "a:bodyPr")
    settings = settings.attrib if settings is not None else {}
    align = {"t": "flex-start", "ctr": "center", "b": "flex-end"}.get(settings.get("anchor"), "flex-start")
    padding = " ".join(
        number(px(settings.get(key, default))) + "px"
        for key, default in (("tIns", 45720), ("rIns", 91440), ("bIns", 45720), ("lIns", 91440))
    )
    contents = []
    for paragraph in all_nodes(body, "a:p"):
        properties = find(paragraph, "a:pPr")
        attrs = properties.attrib if properties is not None else {}
        default = find(properties, "a:defRPr")
        runs = all_nodes(paragraph, "a:r")
        first = find(runs[0], "a:rPr") if runs else find(paragraph, "a:endParaRPr")
        base = {}
        if default is not None:
            base.update(default.attrib)
        if first is not None:
            base.update(first.attrib)
        font_size = float(base.get("sz", "1400")) / 75
        paragraph_font = find(first, "a:latin")
        paragraph_font = paragraph_font.get("typeface") if paragraph_font is not None else "Arial"
        paragraph_fallback = "monospace" if paragraph_font == "Roboto Mono" else "Arial, sans-serif"
        line_spacing = find(properties, "a:lnSpc/a:spcPct")
        fixed_spacing = find(properties, "a:lnSpc/a:spcPts")
        line_height = number(float(line_spacing.get("val")) / 100000) if line_spacing is not None else "1.15"
        if fixed_spacing is not None:
            line_height = number(float(fixed_spacing.get("val")) / 75) + "px"
        styles = [
            f"font-family:'{paragraph_font}',{paragraph_fallback}",
            f"font-size:{number(font_size)}px",
            f"line-height:{line_height}",
            f"text-align:{dict(l='left', ctr='center', r='right', just='justify').get(attrs.get('algn'), 'left')}",
        ]
        for css, xml in (("margin-top", "spcBef"), ("margin-bottom", "spcAft")):
            spacing = find(properties, f"a:{xml}/a:spcPts")
            styles.append(f"{css}:{number(float(spacing.get('val')) / 75) if spacing is not None else '0'}px")
        spans = []
        for run in paragraph:
            kind = run.tag.rsplit("}", 1)[-1]
            if kind == "br":
                spans.append("<br>")
                continue
            if kind not in ("r", "fld"):
                continue
            run_properties = find(run, "a:rPr")
            run_attrs = dict(base)
            if run_properties is not None:
                run_attrs.update(run_properties.attrib)
            latin = find(run_properties, "a:latin")
            if latin is None:
                latin = find(first, "a:latin")
            font = latin.get("typeface") if latin is not None else "Arial"
            fallback = "monospace" if font == "Roboto Mono" else "Arial, sans-serif"
            run_style = [
                f"font-family:'{font}',{fallback}",
                f"font-size:{number(float(run_attrs.get('sz', '1400')) / 75)}px",
                f"font-weight:{'700' if run_attrs.get('b') == '1' else '400'}",
                f"font-style:{'italic' if run_attrs.get('i') == '1' else 'normal'}",
                f"color:{color(find(run_properties, 'a:solidFill'), color(find(first, 'a:solidFill')))}",
            ]
            if run_attrs.get("u", "none") != "none":
                run_style.append("text-decoration:underline")
            if "spc" in run_attrs:
                run_style.append(f"letter-spacing:{number(float(run_attrs['spc']) / 75)}px")
            text = "".join(node.text or "" for node in all_nodes(run, "a:t"))
            hyperlink = find(run_properties, "a:hlinkClick")
            if hyperlink is not None:
                target = rels.get(hyperlink.get(f"{{{NS['r']}}}id"), "")
                rendered = f'<a href="{esc(target)}" target="_blank" rel="noopener noreferrer">{esc(text)}</a>'
            else:
                rendered = link_text(text)
            spans.append(f'<span style="{esc(";".join(run_style))}">{rendered}</span>')
        contents.append(f'<p style="{esc(";".join(styles))}">{"".join(spans) or "<br>"}</p>')
    return f'<div class="pptx-text" style="justify-content:{align};padding:{padding}"><div>{"".join(contents)}</div></div>'


def drawing(shape, rels, slide_number):
    kind = shape.tag.rsplit("}", 1)[-1]
    if kind not in ("sp", "pic", "cxnSp"):
        return ""
    properties = find(shape, "p:spPr")
    transform = find(properties, "a:xfrm")
    if transform is None:
        raise ValueError(f"Missing explicit transform on slide {slide_number}")
    offset, extent = find(transform, "a:off"), find(transform, "a:ext")
    x, y = px(offset.get("x")), px(offset.get("y"))
    width, height = px(extent.get("cx")), px(extent.get("cy"))
    metadata = find(shape, f"p:{dict(sp='nvSpPr', pic='nvPicPr', cxnSp='nvCxnSpPr')[kind]}/p:cNvPr")
    source_id = metadata.get("id")
    # These three source backgrounds were left above their moved callout text.
    if slide_number == 13 and source_id in ("539", "540", "543"):
        y += 49.4
    style = f"left:{number(x)}px;top:{number(y)}px;width:{number(width)}px;height:{number(height)}px"
    geometry = find(properties, "a:prstGeom")
    preset = geometry.get("prst") if geometry is not None else "custom"
    if kind == "pic":
        image_id = find(shape, "p:blipFill/a:blip").get(f"{{{NS['r']}}}embed")
        asset = "assets/" + posixpath.basename(rels[image_id])
        crop = find(shape, "p:blipFill/a:srcRect")
        crop = crop.attrib if crop is not None else {}
        left, top, right, bottom = (float(crop.get(key, 0)) / 100000 for key in ("l", "t", "r", "b"))
        image_style = (
            f"left:{number(-left / (1 - left - right) * 100)}%;"
            f"top:{number(-top / (1 - top - bottom) * 100)}%;"
            f"width:{number(100 / (1 - left - right))}%;"
            f"height:{number(100 / (1 - top - bottom))}%"
        )
        alt = metadata.get("descr", "")
        if not alt and slide_number in (14, 15):
            alt = {
                14: "Demo visual: stable versus canary latency under progressive traffic.",
                15: "Demo recap: failed canary analysis, automatic abort, sandbox remediation and a human-reviewed pull request.",
            }[slide_number]
        return f'<div class="pptx-image" data-source-id="{source_id}" style="{style}"><img src="{asset}" alt="{esc(alt)}" style="{image_style}"></div>'
    line = find(properties, "a:ln")
    line_color = color(find(line, "a:solidFill"), "none")
    line_width = px(line.get("w", "12700")) if line is not None else 0
    if preset in ("straightConnector1", "custom"):
        view_width, view_height = max(width, 1), max(height, 1)
        if preset == "straightConnector1":
            path = f"M0 0 L{number(width)} {number(height)}"
        else:
            custom_path = find(properties, "a:custGeom/a:pathLst/a:path")
            view_width, view_height = float(custom_path.get("w")), float(custom_path.get("h"))
            commands = []
            for command in custom_path:
                point = find(command, "a:pt")
                if point is not None:
                    op = "M" if command.tag.endswith("moveTo") else "L"
                    commands.append(f"{op}{point.get('x')} {point.get('y')}")
            path = " ".join(commands)
            line_width *= view_width / max(width, 1)
        marker_id = f"arrow-{slide_number}-{source_id}"
        arrow = find(line, "a:tailEnd")
        has_arrow = arrow is not None and arrow.get("type", "none") != "none"
        marker = f' marker-end="url(#{marker_id})"' if has_arrow else ""
        definitions = f'<defs><marker id="{marker_id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="{line_color}"/></marker></defs>' if has_arrow else ""
        return f'<svg class="pptx-vector" data-source-id="{source_id}" aria-hidden="true" style="{style}" viewBox="0 0 {number(view_width)} {number(view_height)}" preserveAspectRatio="none">{definitions}<path d="{path}" fill="none" stroke="{line_color}" stroke-width="{number(line_width)}"{marker}/></svg>'
    style += f";background:{fill(properties)}"
    if line_color != "none":
        dash = find(line, "a:prstDash")
        border_style = "dashed" if dash is not None and dash.get("val") != "solid" else "solid"
        style += f";border:{number(line_width)}px {border_style} {line_color}"
    if preset == "ellipse":
        style += ";border-radius:50%"
    elif preset in ("roundRect", "round2SameRect"):
        guide = find(geometry, "a:avLst/a:gd")
        adjustment = float(guide.get("fmla").split()[-1]) / 100000 if guide is not None else 0.16667
        radius = min(width, height) * adjustment
        style += f";border-radius:{number(radius)}px" + (" " + number(radius) + "px 0 0" if preset == "round2SameRect" else "")
    elif preset != "rect":
        raise ValueError(f"Unsupported shape: {preset}")
    shadow = find(properties, "a:effectLst/a:outerShdw")
    if shadow is not None:
        angle = math.radians(float(shadow.get("dir", "0")) / 60000)
        distance = px(shadow.get("dist", "0"))
        style += f";box-shadow:{number(math.cos(angle) * distance)}px {number(math.sin(angle) * distance)}px {number(px(shadow.get('blurRad', '0')))}px {color(shadow)}"
    body = find(shape, "p:txBody")
    text = text_body(body, rels) if body is not None and any(paragraphs(body)) else ""
    return f'<div class="pptx-shape" data-source-id="{source_id}" style="{esc(style)}">{text}</div>'


def main():
    assets = HERE / "assets"
    assets.mkdir(exist_ok=True)
    with zipfile.ZipFile(SOURCE) as archive:
        theme = ET.fromstring(archive.read("ppt/theme/theme1.xml"))
        for entry in all_nodes(theme, "a:themeElements/a:clrScheme/*"):
            COLORS[entry.tag.rsplit("}", 1)[-1]] = next(iter(entry)).get("val")
        presentation = ET.fromstring(archive.read("ppt/presentation.xml"))
        size = find(presentation, "p:sldSz")
        width, height = px(size.get("cx")), px(size.get("cy"))
        presentation_rels = relationships(archive, "ppt/presentation.xml")
        order = [presentation_rels[node.get(f"{{{NS['r']}}}id")] for node in all_nodes(presentation, "p:sldIdLst/p:sldId")]
        sections, transcript = [], []
        for index, part in enumerate(order, 1):
            slide = ET.fromstring(archive.read(part))
            rels = relationships(archive, part)
            tree = find(slide, "p:cSld/p:spTree")
            texts = [
                line for shape in tree for line in paragraphs(find(shape, "p:txBody"))
                if line.strip()
            ]
            title = texts[0] if texts else f"Slide {index}"
            notes_part = next((target for target in rels.values() if "/notesSlides/" in target), None)
            notes = []
            if notes_part:
                note_tree = ET.fromstring(archive.read(notes_part))
                for shape in all_nodes(note_tree, ".//p:sp"):
                    placeholder = find(shape, "p:nvSpPr/p:nvPr/p:ph")
                    if placeholder is None or placeholder.get("type") == "body":
                        notes.extend(paragraphs(find(shape, "p:txBody")))
            notes_html = "".join(f"<p>{esc(note)}</p>" for note in notes if note.strip())
            elements = "\n".join(drawing(shape, rels, index) for shape in tree)
            sections.append(
                f'      <section aria-label="{esc(title)}" data-source-slide="{esc(part)}">\n'
                f'        <div class="pptx-slide" role="group" aria-label="Slide {index}: {esc(title)}">\n{elements}\n        </div>\n'
                f'        <aside class="notes">{notes_html}</aside>\n      </section>'
            )
            transcript.append(f"<!-- Slide {index} -->\n\n" + "\n\n".join(texts) + "\n\nNote:\n" + "\n\n".join(notes))
        for asset in archive.namelist():
            if asset.startswith("ppt/media/") and not asset.endswith("/"):
                (assets / posixpath.basename(asset)).write_bytes(archive.read(asset))
    title = "The Agent Broke It, the Agent Fixed It: Self-Healing Progressive Delivery on Kubernetes"
    document = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{title}">
  <meta name="author" content="Carlos Sanchez and Kevin Dubois">
  <title>{title}</title>
  <link rel="stylesheet" href="../dist/reveal.css">
  <link rel="stylesheet" href="../dist/theme/white.css" id="theme">
  <link rel="stylesheet" href="../css/csanchez.css">
  <link rel="stylesheet" href="./presentation.css">
</head>
<body>
  <!-- Generated locally by convert-pptx.py. All slide text remains selectable HTML.
       Arrow keys/Space navigate; Esc opens overview; S opens speaker notes. -->
  <div class="reveal">
    <div class="slides">
{chr(10).join(sections)}
    </div>
  </div>
  <script src="../dist/reveal.js"></script>
  <script src="../plugin/notes/notes.js"></script>
  <script>
    Reveal.initialize({{
      controls: true,
      progress: true,
      history: true,
      hash: true,
      slideNumber: 'c/t',
      center: false,
      width: {number(width)},
      height: {number(height)},
      margin: 0,
      transition: 'none',
      backgroundTransition: 'none',
      plugins: [ RevealNotes ]
    }});
  </script>
</body>
</html>
"""
    (HERE / "index.html").write_text(document, encoding="utf-8")
    (HERE / "index.md").write_text(
        "<!-- Extracted verbatim from the adjacent PPTX by convert-pptx.py.\n"
        "     index.html preserves the original positioned layout; this is its readable text/notes companion.\n"
        "     Rebuild: python3 2026-11_argocon/convert-pptx.py (from the repository root).\n"
        "     Present: open index.html; arrows/Space navigate, Esc for overview, S for speaker notes.\n"
        "     Serve from the repository root for presenter mode: npm start -- --port 8000.\n"
        "     Source wording/data inconsistencies are intentionally not corrected.\n"
        "     Browser text metrics, fallback fonts and shadow/arrow rendering may differ slightly.\n"
        "     Three misplaced backgrounds on slide 13 are aligned to reveal its third callout.\n"
        "     The live demo/recording referenced in notes is not embedded in the source PPTX. -->\n\n"
        + "\n\n---\n\n".join(transcript) + "\n",
        encoding="utf-8",
    )
    print(f"Converted {len(order)} slides with notes and {len(list(assets.iterdir()))} original assets.")


if __name__ == "__main__":
    main()
