# Video plan: The Agent Broke It, the Agent Fixed It

Status: implemented as an editable HyperFrames review project in `video/`.
The review cut uses local synthetic narration and a reduced 960 x 540 canvas;
1080p remains the intended final-delivery resolution. See `video/README.md` for
the render, preview, source files, and review qualifications.

## Goal and scope

Adapt `index.md` into a 10-minute-plus technical video explaining self-healing
code rollouts with agentic AI, incorporating the supplied HyperFrames demo.
The central message is: limit the blast radius with progressive delivery, use
agents to analyze failures, and propose fixes without blocking the rollback
decision.

Confirmed requirements: this presentation, HyperFrames, a runtime of at least
10 minutes, and inclusion of the demo from
`/Users/sanchezg/dev/carlossg/argo-rollouts/rollouts-demo/hyperframes-demo`.
The following editorial and delivery choices remain proposed defaults:

| Decision | Proposal | Reason |
| --- | --- | --- |
| Format | Narrated technical walkthrough with diagrams, configuration, and an embedded demo | Teach the mechanism and show concrete scenarios rather than reproduce every slide |
| Length | 10 minutes 30 seconds (630 seconds) | Meets the requested 10-minute minimum with room for the complete 77-second demo |
| Audience | Developers familiar with deployments; no Argo expertise assumed | Appropriate entry point for a developer conference |
| Destination | Conference playback and YouTube/embed | Fits the presentation context |
| Canvas | 1920 x 1080, 16:9, 30 fps | Keeps diagrams and small code excerpts legible |
| Language | English | Matches the presentation |
| Audio | Clear narration, retaining the demo's existing narration; optional quiet instrumental bed outside the demo | Avoid duplicate narration and competing voices |
| Review | Script, storyboard stills, then animated preview | Resolve technical and visual issues before rendering |

No personal HyperFrames preferences or recipes were returned by the earlier
read-only preference probes. No presenter recording has been supplied. A rendered
demo and its editable HyperFrames source are available at the supplied path;
their use is specified below.

## Creative direction

Five possible tellings were considered:

| Concept | Treatment |
| --- | --- |
| Follow one failed rollout | A canary encounters a regression; the viewer follows detection, rollback, and a proposed fix |
| Race against the blast radius | Expanding traffic blocks create urgency until rollback contains the failure |
| A developer's control room | A dashboard links GitOps, rollout status, evidence, and the resulting pull request |
| Two clocks | A fast safety lane rolls back while a slower repair lane investigates asynchronously |
| A pull request writes home | A proposed fix narrates its journey backward through the incident evidence |

Recommendation: **follow the rollout safety loop**, using **two clocks** to make
the asynchronous repair architecture clear. The longer format first teaches the
mechanism, shows the supplied demo's independent scenarios, then explains the
separate remediation path. Prefer moving traffic, evidence cards, and branching
diagrams over generic AI imagery or a sequence of static slides.

Use a light, high-contrast canvas, Botswana-sky-blue accents drawn from the
existing illustration, and stable spatial positions for stable and canary
versions. Pair green/red states with text and icons, never color alone. Keep
Carlos Sanchez and DevFest Gaborone identification on the opening and close.
Avoid inventing an event date, official event branding, or endorsement.

## Proposed chapter storyboard

The following contiguous chapters total 630 seconds, including the complete
77-second demo. Final internal cuts must follow the recorded narration; preserve
the minimum 600-second delivery requirement without padding or slowing footage.
Each chapter may contain several shorter scene sub-compositions.

| Time | Chapter | Visual plan | Narration and teaching objective |
| --- | --- | --- | --- |
| 0:00-0:35 | The agent broke it | Open on an illustrative canary regression, then reveal the title, Carlos Sanchez, and DevFest Gaborone. | Establish the question: can we contain a bad release, understand the failure, and propose a repair? Explain that "self-healing" does not mean infallible or unrestricted AI. |
| 0:35-1:30 | Why progressive delivery | Animate stable and canary traffic, evaluation, and a healthy promotion versus an abort. | Define progressive delivery, blast radius, and production feedback. Explain why delivering a change to everyone at once creates unnecessary risk. |
| 1:30-2:20 | Choose the release strategy | Compare rolling updates, blue-green, canaries, and feature flags using one consistent application diagram. | Separate replacement strategy, traffic control, and feature exposure. Explain why this walkthrough uses a canary; avoid implying all techniques are interchangeable. |
| 2:20-3:10 | GitOps and the rollout controller | Reconstruct the Git-to-deployment flow, then focus on Argo Rollouts and its analysis gate. | Git holds desired configuration; the controller manages progression. Explain the normal promote/abort path before introducing AI. |
| 3:10-4:10 | Wire the analysis | Reveal small YAML excerpts for plugin registration, stable/canary labels, the AnalysisTemplate, agentUrl, and the success condition. | Walk through the request/result contract. Explain `interval: 10s` and `result > 0.50` as example settings, not recommended production defaults. Keep installation detail subordinate to the mechanism. |
| 4:10-5:15 | Evidence, not a magic verdict | Animate parallel metrics and logs/pod evidence into analysis, then return the numeric result to Argo. Introduce the supplied demo's additional events specialist separately. | Explain complementary evidence, disagreement, and why logs may reveal a regression that aggregate metrics miss. Distinguish the presentation's architecture from demo-specific orchestration and model choices. |
| 5:15-6:00 | What to watch in the demo | Introduce a three-act checklist and a visible "Illustrative HyperFrames demo - designed UI panels" label. | Preview healthy promotion, a log-detected bad build, and Quarkus null-pointer/memory-leak examples. State that these are independent scenarios, not one continuous release history. |
| 6:00-7:17 | Supplied demo, complete | Play `argo-rollouts-ai-canary-demo.mp4` from source 0:00 through 1:17, at original speed and aspect ratio, with its existing narration. | No new voiceover or music over the clip. Keep the illustrative-demo label visible, including over its closing claims. |
| 7:17-8:10 | Read the demo critically | Return to the three-act checklist with diagrams and selected stills from the supplied render. | Recap what the panels depict: promote a healthy release, abort on log evidence, and detect exception/memory symptoms. Explain that the render illustrates these outcomes; it is not evidence of a measured cluster run. |
| 8:10-9:10 | Rollback now, remediate asynchronously | Split the screen into safety and repair lanes using `async-agent-workflow.png` as reference. Show source context leading to a proposed pull request or a descriptive issue. | Teach the presentation's remediation extension. Explicitly state that the supplied demo does not show PR creation, merging, or a repaired rollout. Return proposed changes through review and revalidation as recommended guardrails. |
| 9:10-10:00 | Lessons and limits | Three focused cards: performance, context/tooling, and complexity/portability; finish with review boundaries. | Cover parallel versus asynchronous work, model/context/tool choices, and orchestration cost. Avoid unsupported latency or accuracy numbers. Explain why a plausible fix still needs review and testing. |
| 10:00-10:30 | Takeaways and resources | Resolve the loop to "Limit exposure. Analyze evidence. Propose repairs." End on readable resource links and speaker details. | Restate the division of responsibility: progressive delivery supplies guardrails; agents help investigate and propose repairs. Point viewers to the plugin, demo, and agent repositories. |

This is a chapter-level narration outline, not a finished ten-minute script.
Budget approximately 1,050-1,200 newly written words plus the demo's existing
narration, allowing for code-reading pauses and diagram holds. Time the actual
recordings and verify the final runtime; word count alone is not acceptance.

## Supplied demo integration

Source project:
`/Users/sanchezg/dev/carlossg/argo-rollouts/rollouts-demo/hyperframes-demo`

Inspected inputs:

- `README.md`: describes designed HTML/GSAP mock panels, with no cluster needed.
- `narration/lines.txt`: six narration sections covering an introduction,
  orchestration, healthy promotion, a bad build detected through logs, Quarkus
  exception/memory scenarios, and the close.
- `argo-rollouts-ai-canary-demo.mp4`: media-probed duration **77.000 seconds**;
  H.264 video, **1920 x 1080**, **30 fps**, and an AAC audio stream also lasting
  **77.000 seconds**.
- `hyperframes.json`: confirms an editable HyperFrames project is present.

Use the rendered MP4 as the frozen input rather than rebuilding or changing the
external project. During production, copy it into the new project's local
assets, record source provenance and a checksum, and use framework-owned video
playback with its original audio. Do not depend on an absolute external path in
the delivered composition. Preserve the original project and render unchanged.

The demo README says its narration was generated with macOS Samantha at rate
175. A compatible, clearly synthetic voice is a reasonable option for the new
chapters, subject to voice availability and appropriate usage; no speaker
impersonation is needed. Retain existing audio for the embedded segment, match
perceived loudness at its boundaries, and avoid doubled audio tracks.

Important editorial qualifications:

- The narration's "Real logs. Real debate. Real decisions" closing line is not
  independently substantiated by the supplied render or README. Keep the
  illustrative-demo overlay visible and explicitly qualify the clip in the
  introduction and debrief; do not repeat that line as a verified claim.
- "No human in the loop" describes the demo's depicted promotion, not permission
  to auto-merge remediation pull requests or a universal operating policy.
- The green promotion and later blue-stable failure scenario should be presented
  as separate examples. Do not imply uninterrupted state continuity.
- The demo names three evidence specialists and Gemini. Attribute these to the
  supplied demo, not to every deployment of the metric plugin.
- Exact per-act source timestamps have not been mapped. Do not guess them.
  Whole-clip playback needs no internal cuts; any later extracted stills or
  chapter markers require frame inspection first.

## Source and asset treatment

| Source | Planned use |
| --- | --- |
| `index.md` | Technical narrative, configuration vocabulary, lessons, speaker details, and resource URLs |
| `canary-traffic.png` | Reference for reconstructing a clean, animated stable/canary traffic diagram |
| `aiops-rollout.png` | Reference for the deploy/analyze/promote/rollback topology |
| `async-agent-workflow.png` | Reference for parallel evidence collection and separate asynchronous remediation |
| `aiops-agent.jpeg` | Visual reference and optional cropped establishing image; redraw technical labels from source YAML |
| `gitops-delivery.png` | Optional context image; simplify rather than show the entire dense diagram |
| Supplied `hyperframes-demo/argo-rollouts-ai-canary-demo.mp4` | Complete 77-second embedded demo at 6:00-7:17, preserving its narration and adding an illustrative-demo disclosure |
| Supplied `hyperframes-demo/narration/lines.txt` and `README.md` | Source for demo introduction, captions, debrief, and provenance qualifications |
| Shared Adobe wordmark | Optional speaker-affiliation treatment, preserving its original proportions and appropriate usage |

Do not scale dense infographics down and expect their text to remain readable.
Rebuild explanatory nodes as editable HTML/SVG and reveal one relationship at a
time. The existing AI infographic contains an inconsistent success-condition
label; use `result > 0.50` from the actual YAML if that detail appears.

Keep CrowdStrike optional and outside the timed baseline: historical claims
would require source verification, and the illustrative opening already
establishes deployment risk. The longer format restores a focused
deployment-strategy comparison and selected configuration excerpts. Still omit
the ingress-controller list, exhaustive installation instructions, and memes.
Use the supplied demo, not a newly invented or implied live recording.

## Technical accuracy and guardrails

- Argo Rollouts, not the language model alone, executes rollout progression based
  on configured analysis results.
- Treat `result > 0.50` as the presentation's example configuration, not a
  universal production recommendation or a measured success-rate percentage.
- Any traffic percentages, metric curves, incident outputs, or pull-request
  contents added for storytelling must be labeled illustrative. The supplied
  demo is also illustrative; do not fabricate benchmark results or describe its
  designed panels as a live-cluster screen recording.
- Show rollback and remediation as separate paths. Do not imply that generating
  a fix blocks rollback, that every incident can be repaired, or that a generated
  pull request is automatically merged.
- Describe review and revalidation as recommended operating guardrails, not as
  demonstrated features of the implementation.
- Confirm external asset rights before reuse. Do not clone the speaker's voice.
  Use a supplied recording or an appropriately licensed narration voice.

## HyperFrames execution plan

The route is now `hyperframes` -> `general-video`: a long-form technical
walkthrough combining original explanatory scenes with an existing video.
This supersedes the original short-form `faceless-explainer` proposal; the
ten-minute-plus scope is outside that specialized route's length range.

The implementation follows this execution sequence. Package execution now uses
Bun, as requested, with the public registry rather than the user's npm registry:

1. Check current allowance with `bunx hyperframes usage --json`; if unavailable or
   unknown, report that without guessing. Install/update the selected workflow
   with `bunx hyperframes skills update general-video`.
2. Initialize a dedicated `2026-10_devfest_gaborone/video/` project using the
   workflow's current setup instructions. Write `BRIEF.md` immediately after
   initialization, recording `workflow: general-video`, the 630-second target,
   the 600-second minimum, and the supplied demo requirement, while distinguishing
   requested facts from proposed defaults. Do not initialize over the
   presentation directory or modify the external demo project.
3. Load `hyperframes-core` before authoring HTML, plus `hyperframes-creative`,
   `hyperframes-animation`, `media-use`, and `hyperframes-cli` as needed.
   Search `hyperframes-registry` before hand-building named diagrams, charts,
   code panels, or other available visual treatments.
4. Expand the chapter outline into a timed script and a consistent `frame.md`;
   create storyboard stills for all twelve chapters, especially the
   plugin/controller boundary, demo disclosure, and two-lane remediation view.
   Review technical meaning before generating final audio.
5. Resolve assets and narration into local files with provenance, including the
   frozen demo MP4. Load `hyperframes-core` for clip timing and source ranges,
   and `hyperframes-audio` if boundary gain or fades need adjustment. Build a
   deterministic, seekable composition with one scene sub-composition per beat,
   framework-owned media timing, a caption track, and separate audio tracks.
   Generate captions from the final audio, not estimated storyboard timings.
   Include the demo's spoken audio in the caption coverage, offset to its actual
   placement, without adding a second spoken track.
6. Run HyperFrames lint/check and inspect scene-boundary snapshots. Verify
   seeking, diagram legibility, captions, and audio synchronization. Review the
   full preview in Studio before the delivery render. Scrub immediately before,
   within, and after the demo; confirm its disclosure and audio survive seeking.
7. Recheck allowance before rendering. Export the MP4, verify its actual duration,
   resolution, frame rate, picture, and sound, and retain the editable project
   and captions. Verify the demo appears in full exactly once at normal speed.
   Publish or upload only if separately requested.

## Acceptance criteria

- The first ten seconds establish a failed rollout and the video's central
  question.
- A viewer can distinguish stable traffic, canary traffic, the analysis result,
  the rollout decision, and asynchronous remediation.
- Promotion is shown as a possible healthy outcome; failure leads to rollback
  and either a proposed pull request or an issue.
- No scene implies guaranteed autonomous repair or unreviewed production fixes.
- The complete 77-second supplied demo is included once, with audible original
  narration and a persistent illustrative-demo disclosure. Its scenarios are
  distinguished from a live recording and from the separate remediation design.
- Narration and captions agree; text stays readable at normal playback size,
  without captions obscuring diagram labels.
- The final render is at least 600 seconds, targeting 630 seconds at 1080p/30 fps,
  with no runtime padding, clipped audio, missing assets, blank transitions, or
  accidental internal information.
- Delivery includes the MP4, editable HyperFrames project, captions, and source
  links; the project's demo copy has recorded provenance. Existing presentation
  files other than this plan and the external demo project remain unchanged.

## Resource links for delivery text

- https://github.com/argoproj-labs/rollouts-plugin-metric-ai
- https://github.com/kdubois/argo-rollouts-quarkus-demo
- https://github.com/carlossg/kubernetes-agents-antigravity
- https://csanchez.org
