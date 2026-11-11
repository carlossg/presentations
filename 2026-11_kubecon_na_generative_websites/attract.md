<!-- .slide: class="hook" data-autoslide="8000" -->

<div class="gemini-brand" role="img" aria-label="Google Gemini"><img src="attract-media/gemini.svg" width="36" height="36" alt=""><span aria-hidden="true">Gemini</span></div>

<div class="scene split-scene">
  <div class="hook-copy">
    <p class="eyebrow">One brand. A different experience.</p>
    <h1>Why show<br>every visitor<br>the <em>same</em><br>website?</h1>
    <p class="scene-caption">Let their intent shape the page.</p>
  </div>
  <div class="comparison-visual" aria-label="The authored homepage and a generated camping page">
    <figure class="site-card original-card">
      <figcaption><span class="window-dots" aria-hidden="true"></span>One homepage</figcaption>
      <img src="attract-media/homepage.jpg" width="1280" height="720" alt="Arco's authored homepage: Precision Brewing, Beautiful Design.">
    </figure>
    <figure class="site-card generated-card">
      <figcaption><span class="window-dots" aria-hidden="true"></span>A page for your next adventure <span class="generated-label">AI generated</span></figcaption>
      <img src="attract-media/generated.jpg" width="1280" height="720" alt="The real generated page: Espresso Anywhere, Camping and Portable Coffee.">
    </figure>
  </div>
</div>

Note:
Attract loop: five independently understandable slides, 60 seconds total (8 / 14 / 12 / 12 / 14). All displayed media is local; no generation request is made by this deck. Press F for full screen. Pause loop stops automatic advancement; arrow keys still allow manual navigation. Source for all screenshots and the clip: arco/build-demo/recordings/google-20261108-custom-url-verified/arco-google-cloud-demo.mp4, recorded November 8, 2026. Homepage frame: 0.8 seconds; generated frame: 56 seconds. Arco is a fictional coffee brand demonstrating real site mechanics. Gemini mark: Google's official asset at https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg, stored locally for offline playback.

---

<!-- .slide: class="query" data-autoslide="14000" -->

<div class="gemini-brand" role="img" aria-label="Google Gemini"><img src="attract-media/gemini.svg" width="36" height="36" alt=""><span aria-hidden="true">Gemini</span></div>

<div class="scene query-scene">
  <div class="query-copy">
    <p class="eyebrow">A question becomes an experience</p>
    <h2>Ask a<br>question.<br><em>Get a page.</em></h2>
    <p class="query-prompt"><span aria-hidden="true">&ldquo;</span>Coffee for camping?<span aria-hidden="true">&rdquo;</span></p>
    <p class="scene-caption">Products. Comparisons.<br>A page built around your goal.</p>
  </div>
  <figure class="demo-window">
    <figcaption><span class="window-dots" aria-hidden="true"></span>Arco / AI page generation <span class="recording-label">Recorded demo / 1.5x playback</span></figcaption>
    <video data-autoplay muted playsinline preload="auto" poster="attract-media/query-poster.jpg" width="1280" height="720" aria-label="Recorded Arco demo: a camping coffee query generates and streams a page with product recommendations and a comparison table. Playback is 1.5 times the recorded speed.">
      <source src="attract-media/query-demo.mp4" type="video/mp4">
      Your browser does not support this video. The live demo shows a question becoming a complete page.
    </video>
  </figure>
</div>

Note:
The prompt is a short summary of the actual recording's query: "I'm looking for a coffee machine to use when camping in the middle of the forest". Clip: 46.439-65.912 seconds of the November 8 verified recording, condensed to about 13 seconds at 1.5x playback, with no audio. The visible playback label is intentional: this is not a real-time generation-speed benchmark. Query generation runs afresh; do not claim a deterministic query-result cache or instant generation. The video restarts when Reveal revisits this slide and holds its last frame until the next slide.

---

<!-- .slide: class="journey" data-autoslide="12000" -->

<div class="gemini-brand" role="img" aria-label="Google Gemini"><img src="attract-media/gemini.svg" width="36" height="36" alt=""><span aria-hidden="true">Gemini</span></div>

<div class="scene journey-scene">
  <p class="eyebrow">No perfect prompt required</p>
  <h2>Your browsing<br>becomes <em>the brief.</em></h2>
  <div class="journey-flow" aria-label="Browsing travel products and guides supplies context for a personalized For You page">
    <figure class="journey-card">
      <img src="attract-media/travel.jpg" width="1280" height="720" alt="The Espresso Anywhere page with a portable espresso maker beside a lake.">
      <figcaption><span class="step-number">01</span><strong>Explore a product</strong><span>Espresso, anywhere.</span></figcaption>
    </figure>
    <span class="flow-arrow" aria-hidden="true">&rarr;</span>
    <figure class="journey-card">
      <img src="attract-media/guide.jpg" width="1280" height="720" alt="The Complete Guide to Travel Espresso, showing coffee equipment overlooking the mountains.">
      <figcaption><span class="step-number">02</span><strong>Follow your interests</strong><span>A guide for the journey.</span></figcaption>
    </figure>
    <span class="flow-arrow" aria-hidden="true">&rarr;</span>
    <figure class="journey-card for-you-card">
      <img src="attract-media/for-you.jpg" width="1280" height="720" alt="A real For You page generated from travel browsing: Great Coffee, Wherever Your Journey Takes You.">
      <figcaption><span class="step-number">03</span><strong>Discover &ldquo;For You&rdquo;</strong><span>A page shaped by that context.</span></figcaption>
    </figure>
  </div>
</div>

Note:
Screenshots are real frames from 13, 24, and 36 seconds of the verified November 8 recording. The first two are cropped to the authored content region for legibility. Browsing signals build session context; selecting For You generates a personalized page. This is not a claim that the system trains a model on each visitor or that every query is prefetched and instant.

---

<!-- .slide: class="architecture" data-autoslide="12000" -->

<div class="gemini-brand" role="img" aria-label="Google Gemini"><img src="attract-media/gemini.svg" width="36" height="36" alt=""><span aria-hidden="true">Gemini</span></div>

<div class="scene architecture-scene">
  <p class="eyebrow">Under the hood</p>
  <h2>Real content. AI assembly.<br><em>Edge delivery.</em></h2>
  <div class="architecture-flow" aria-label="A question and browsing context drive grounded retrieval, then AI-generated content streams as AEM blocks">
    <div class="architecture-node">
      <span class="node-index">01 / Understand</span>
      <h3>Your intent</h3>
      <p>Question + browsing context</p>
      <span class="technology">Browser</span>
    </div>
    <span class="flow-arrow" aria-hidden="true">&rarr;</span>
    <div class="architecture-node">
      <span class="node-index">02 / Ground</span>
      <h3>Real content</h3>
      <p>Catalog + guides + retrieval</p>
      <span class="technology">Cloud Run + Firestore</span>
    </div>
    <span class="flow-arrow" aria-hidden="true">&rarr;</span>
    <div class="architecture-node assembled-node">
      <span class="node-index">03 / Assemble</span>
      <h3>A tailored page</h3>
      <p>Streamed, reusable AEM blocks</p>
      <span class="technology">Vertex Gemini + AEM frontend</span>
    </div>
  </div>
  <div class="publishing-branch">
    <span class="branch-connector" aria-hidden="true"></span>
    <span class="optional-label">Optional</span>
    <strong>Save + publish</strong>
    <span>Document Authoring <span aria-hidden="true">&rarr;</span> AEM Edge Delivery</span>
  </div>
</div>

Note:
The current fork defaults to Google Cloud, not the retained Cloudflare alternative. Cloud Run hosts the generation service, Firestore supports content storage and native vector retrieval, and Vertex Gemini generates the page content. The browser renders streamed blocks in the AEM frontend. Saving and publishing through Document Authoring is a separate optional action, not a prerequisite for each generated query page. The loop performs neither inference nor publishing. Architecture references: arco/README.md and arco/services/recommender/README.md. No performance numbers, infrastructure-scale promises, or stale block/content counts are implied.

---

<!-- .slide: class="google-cloud" data-autoslide="14000" data-background-color="#1c2b35" -->

<div class="gemini-brand" role="img" aria-label="Google Gemini"><img src="attract-media/gemini.svg" width="36" height="36" alt=""><span aria-hidden="true">Gemini</span></div>

<div class="scene cloud-scene">
  <p class="eyebrow">Serverless demo architecture</p>
  <h2>Built on <em>Google Cloud.</em></h2>
  <div class="cloud-layout" aria-label="The AEM Edge Delivery browser sends requests to a Google Cloud Run generation API and receives streamed blocks. Cloud Run uses Vertex AI for Gemini and embeddings, Firestore for content, vectors and sessions, and supporting managed services.">
    <div class="cloud-client">
      <span class="cloud-label">Experience</span>
      <h3>AEM<br>Edge Delivery</h3>
      <p>Browser + streamed blocks</p>
    </div>
    <div class="cloud-exchange">
      <span>HTTPS</span>
      <span class="cloud-request-arrow" aria-hidden="true">&rarr;</span>
      <span class="cloud-response-arrow" aria-hidden="true">&larr;</span>
      <span>NDJSON</span>
    </div>
    <div class="cloud-platform">
      <p class="cloud-label">Google Cloud / Managed services</p>
      <div class="cloud-runtime">
        <div class="cloud-service cloud-run">
          <h3>Cloud Run</h3>
          <p>Generation API<br>Streaming orchestration</p>
          <span class="cloud-runtime-tag">Scales to zero</span>
        </div>
        <span class="cloud-service-arrow" aria-hidden="true">&harr;</span>
        <div class="cloud-backends">
          <div class="cloud-service">
            <h3>Vertex AI</h3>
            <p>Gemini + embeddings</p>
          </div>
          <div class="cloud-service">
            <h3>Firestore</h3>
            <p>Content + vectors<br>Sessions + feedback</p>
          </div>
        </div>
      </div>
      <div class="cloud-support">
        <div><strong>Cloud Tasks + Scheduler</strong><span>Async evaluations + recovery</span></div>
        <div><strong>Cloud Storage</strong><span>Oversized run payloads</span></div>
        <div><strong>Secret Manager</strong><span>Adobe + admin credentials</span></div>
      </div>
    </div>
  </div>
</div>

Note:
The AEM Edge Delivery frontend is outside the Google Cloud service boundary. The browser calls the Cloud Run generation API over HTTPS and renders its NDJSON stream. Cloud Run coordinates Vertex Gemini generation and embeddings with Firestore Native documents and vector retrieval. Firestore also stores sessions, feedback, evaluations and configuration. Cloud Tasks runs background evaluations; an authenticated Cloud Scheduler job provides recovery. Private Cloud Storage holds payloads that exceed Firestore document limits, not the primary published website. Secret Manager holds Adobe and admin credentials; Vertex uses service-account authentication. This low-traffic demo configures Cloud Run for zero minimum and one maximum instance. "Scales to zero" describes that runtime setting, not a zero-cost promise for storage, scheduling, builds or inference. Optional publishing through Document Authoring and AEM Edge Delivery is shown on the preceding slide. Source: arco/services/recommender/README.md. The main presentation remains at index.html; this separate attract.html loop performs no inference or publishing.
