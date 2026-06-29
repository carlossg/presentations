# Nano Banana Prompt — Arco Architecture Diagram

Use the following text as input to Nano Banana to generate a visual architecture diagram.

---

## Prompt

Create an architecture diagram for Arco, an AI-powered coffee e-commerce site. The system has four layers arranged as horizontal swim lanes from top to bottom:

**Layer 1 — Browser (Client)**
- Pages load from AEM CDN
- A signal collector captures page visits, scroll depth, quiz answers, and interactions
- Signals are stored in sessionStorage as session context (query history, browsing history, inferred profile)
- A persona cookie personalises the hero banner and product cards
- A "For You" background prefetch system listens for context changes; after 3+ page visits, it silently pre-generates a personalised page via SSE to the backend, storing the result in sessionStorage. When the user clicks "For You" in the nav, the page renders instantly from the cached prefetch instead of making a live request
- When a user types a natural language query, the browser streams the session context to the backend via Server-Sent Events (SSE)

**Layer 2 — Cloud Run Backend (arco-recommender)**
Five-stage pipeline:
1. Intent classification — Gemini 2.5 Pro classifies the query using browsing context
2. Hybrid RAG — keyword search against DA content in parallel with semantic vector search across Firestore (product, brew guide, FAQ embeddings)
3. Reasoning engine — Gemini selects page blocks and plans layout
4. Page generation — Gemini streams HTML back to the browser as SSE chunks
5. Async analytics — three AI models (Gemini 2.5 Pro, Gemini 2.5 Flash, Llama 3.3 70B) evaluate page quality in parallel across four dimensions, store results in Firestore, and notify the browser

**Layer 3 — Google Cloud Platform**
- Firestore: vector embeddings (3 collections) + analytics results
- Vertex AI: Gemini 2.5 Pro/Flash inference + text-embedding-005 for semantic search
- Secret Manager: DA authentication token

**Layer 4 — Adobe Experience Manager (AEM)**
- Document Authoring (da.live): CMS for authors
- Edge Delivery CDN (aem.page / aem.live): serves all pages
- GitHub: code sync

**Key arrows to show:**
1. Authors publish in DA → AEM CDN → Browser
2. User browses → signals → sessionStorage → persona cookie → personalised blocks
3. Browsing signals → "For You" prefetch triggers → background SSE to Cloud Run → result cached in sessionStorage → instant render on nav click
4. User query → SSE to Cloud Run → Gemini pipeline → SSE HTML stream → browser renders
5. Cloud Run → Firestore (vector search + store analytics) → Vertex AI (embeddings + inference)
6. Analytics results → SSE event → browser displays score

Use a clean, professional style with rounded boxes, clear labels, and directional arrows. Group related components inside each swim lane. Use colour coding: blue for client, green for backend, orange for GCP services, purple for AEM/CMS.
