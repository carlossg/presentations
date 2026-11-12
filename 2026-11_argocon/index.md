<!-- Extracted verbatim from the adjacent PPTX by convert-pptx.py.
     index.html preserves the original positioned layout; this is its readable text/notes companion.
     Rebuild: python3 2026-11_argocon/convert-pptx.py (from the repository root).
     Present: open index.html; arrows/Space navigate, Esc for overview, S for speaker notes.
     Serve from the repository root for presenter mode: npm start -- --port 8000.
     Source wording/data inconsistencies are intentionally not corrected.
     Browser text metrics, fallback fonts and shadow/arrow rendering may differ slightly.
     Three misplaced backgrounds on slide 13 are aligned to reveal its third callout.
     The live demo/recording referenced in notes is not embedded in the source PPTX. -->

<!-- Slide 1 -->

The Agent Broke It,

the Agent Fixed It

Self-healing progressive delivery on Kubernetes

Carlos Sanchez

Principal Scientist, Adobe

github.com/carlossg    linkedin.com/in/carlossg

Kevin Dubois

Sr. Principal Developer Advocate, IBM

github.com/kdubois    linkedin.com/in/kevindubois

Note:
Twenty-five minutes, and about half of it is a live demo. Carlos opens, Kevin runs the demo on the cluster. Set the frame here: this is not a talk about AI writing code. It is about what happens after AI-written code reaches production, and why the same agent that shipped the bug can be the one that finds it and fixes it. Everything shown runs on open source: Argo CD, Argo Rollouts, Quarkus, LangChain4j.

---

<!-- Slide 2 -->

We all have a “friend” who trusts AI code,

perhaps a little too much

42%

of code is AI-assisted

Sonar 2026: 42% of committed

code is AI-generated or assisted

1.7x

more issues per AI PR

CodeRabbit, 470 PRs: 10.83

issues vs 6.45 for humans

43%

of AI changes need debugging

Lightrun 2026: in production,

after passing QA

Sonar, 8 Jan 2026

https://www.sonarsource.com/blog/state-of-code-developer-survey-report-the-current-reality-of-ai-coding

CodeRabbit, 17 Dec 2025

https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report

Lightrun, 14 Apr 2026

https://venturebeat.com/technology/43-of-ai-generated-code-changes-need-debugging-in-production-survey-finds

Note:
This is the friend. The one who merges the agent's PR because the tests are green and the diff looks reasonable. The numbers are not an argument against AI-written code; they are an argument that review and unit tests are no longer the bottleneck. Sonar measures 42% of committed code as AI-generated or assisted. CodeRabbit looked at 470 open-source PRs and found AI-authored ones carry about 1.7x more issues. Lightrun's 2026 survey found 43% of AI changes needed manual debugging in production after passing QA.

---

<!-- Slide 3 -->

Three pushes to everyone at once

Cloudflare

18 November 2025

One generated feature file,

pushed to every data centre

3h02m

of customer impact

First errors 11:28, core traffic

normal at 14:30

CrowdStrike

19 July 2024

One rapid-channel sensor update,

pushed to every host

8.5M

Windows devices

$5.4B in direct losses

across the Fortune 500

Knight Capital

1 August 2012

New code on 7 of 8 servers,

one left on the old code

$460M

lost in 45 minutes

SEC fined Knight $12M for the release

Cloudflare, 18 Nov 2025

https://blog.cloudflare.com/18-november-2025-outage

CrowdStrike, 24 Jul 2024

https://www.reuters.com/technology/fortune-500-firms-see-54-bln-crowdstrike-losses-says-insurer-parametrix-2024-07-24/

SEC, 16 Oct 2013

https://www.sec.gov/newsroom/press-releases/2013-222

Note:
Option A for the outage slide: three cards, evidence first. Cloudflare's own postmortem: a database access control change at 11:05 generated a bad Bot Management feature file that reached customer environments at 11:28; core traffic was mostly normal by 14:30, everything at 17:06. CrowdStrike: one rapid-channel update to 8.5 million Windows devices, $5.4B of direct losses across the Fortune 500 according to Parametrix, reported by Reuters. Knight Capital: new code deployed to seven of eight servers in 2012, $440M lost in 45 minutes, $12M SEC penalty. All three shipped to the whole fleet in one step.

---

<!-- Slide 4 -->

Anatomy of a bad deploy

11:05

Change deployed

Database access control

change

11:28

Impact starts

Bad feature file reaches

every network

13:05

Rollback begins

Feature file reverted

to earlier version

14:30

Core traffic normal

Most services back

17:06

All clear

Every Cloudflare

system normal

3h02m of customer impact

1h37m to rollback

Source: https://blog.cloudflare.com/18-november-2025-outage

Note:
Option B for the outage slide: one incident as a timeline. Walk the five timestamps slowly. The change landed at 11:05 and looked fine. Impact started at 11:28, when the bad file propagated to customer environments. They rolled back from 13:05 and core traffic was normal at 14:30. All clear at 17:06. Three hours and two minutes of customer impact, and that is a good outcome for an outage this size. CrowdStrike and Knight are the same shape at bigger scale.

---

<!-- Slide 5 -->

CI was green, but production is 20% slower

What CI sees

zsh — quarkus-demo

$ mvn verify

[INFO] Tests run: 214, Failures: 0

[INFO] Errors: 0, Skipped: 4

[INFO] BUILD SUCCESSFUL in 42s

What production sees

p95 latency (ms)

stable, v3

50ms

canary, v4

60ms

0

20

40

60

80

+20%

99% success, zero error logs, no alert

Note:
This is the demo's fourth image, the one with the slow-burn latency drift. The build is green: 214 tests, no failures, 42 seconds. The service returns 200s and logs nothing alarming. It adds five milliseconds of delay per second of uptime, capped at 250ms, so early in the rollout it looks identical to stable. Forty seconds later p95 is five times the baseline. A unit test cannot see that, and neither can a log parser. Only a comparison against the stable version under real traffic can.

---

<!-- Slide 6 -->

Rollback vs recovery

1

Detect

An alert fires and someone opens the dashboard

minutes

to notice

2

Roll back

Argo Rollouts aborts to the last stable ReplicaSet

seconds

to stop the bleeding

3

Diagnose

Logs, metrics, the diff, a local repro

hours

to understand

4

Fix and ship

Patch, test, review, release

days

to actually fix it

DORA 2025: 21.3% of teams recover in under an hour, 43.4% take more than a day

https://dora.dev/research/2025/dora-report/

Note:
The slide is about where the time actually goes. Detection and rollback are solved problems: Argo Rollouts aborts in seconds. Everything after that is still human work, and DORA's 2025 report shows the distribution: 21.3% of teams recover in under an hour, 35.3% take between an hour and a day, and 43.4% take more than a day. Rollback closes the incident. The fix is the part nobody automated, and it is the part this talk is about.

---

<!-- Slide 7 -->

Why an agent should fix it

If it can write the code,

it should be able to write the fix

Logs from the canary

p95 against stable

The diff

The repo

The test suite

The agent

A patch

you review it before it merges

Note:
The argument in one line, and it is a claim about capability, not about identity. It does not have to be the model that wrote the bug, and it does not have to be the same model twice. Any coding agent given the right evidence can do this. At rollout time it gets what the build never had: the canary's logs, p95 against stable, the diff, the repository, and the test suite. Nothing here needs fine-tuning or a new model. What was missing was never capability, it was context and a trigger, and progressive delivery supplies both.

---

<!-- Slide 8 -->

Rollback ASAP, fix after

DECIDE

synchronous, seconds

FIX

asynchronous, minutes

Plugin

3 data agents

Analysis

Decision

A2A call

Sandbox

Agent + tests

PR or issue

in parallel

send for analysis

promote or abort?

handoff

run

report back

on rollback

Note:
Two lanes, and the split is deliberate. The top lane is synchronous: the metric plugin calls the analysis agent, three data agents fetch diagnostics, metrics and rollout status in parallel, a combiner merges them, and one model call returns promote or rollback. The rollout waits seconds, not minutes. The bottom lane is asynchronous: when the decision is rollback, the agent sends an A2A message to the remediation service and returns immediately. The fix runs in the background and ends as a pull request or an issue.

---

<!-- Slide 9 -->

Rollouts calls the agent as a plugin

analysistemplate-ai-agent.yaml

1

1

failureLimit: 0

One failed measurement aborts

2

2

Two measurements

Logs early and metrics later

3

3

Plugin provider

No fork and no new CRD

- name: ai-analysis

  failureLimit: 0

  count: 2

  interval: 30s

  initialDelay: 5s

  provider:

    plugin:

      argoproj-labs/metric-ai:

        agentUrl: http://kubernetes-agent:8080

        stableLabel: role=stable

        canaryLabel: role=canary

Note:
This is the whole integration: an AnalysisTemplate that names a metric provider plugin. Argo Rollouts already knows how to run the analysis, retry it, and abort the rollout when it fails. We add a provider, not a fork. failureLimit zero means a single failed measurement aborts. Two measurements, thirty seconds apart, cover both early log-visible bugs and slower metric drift. The agent URL is the only required setting.

---

<!-- Slide 10 -->

Double & triple check uncertainty

First analysis

Graded by a decision model

below the confidence threshold

50

Routed to a second opinion

still below the confidence threshold

50

Pause, escalate to a human

Note:
The abstract promised configurable human approval gates, and this is the path behind that promise. The first analysis returns a verdict with a confidence. A decision model grades that verdict against the evidence it actually cited. If the grade lands below the quality threshold, the analysis is routed to a second-opinion model, which re-runs it over the same diagnostics and usually raises the score, but if it still lands below the threshold the rollout pauses and a human gets to promote or abort. Both the pause and the threshold are opt-in fields in the AnalysisTemplate, so a team that wants none of this keeps the plain behaviour.

---

<!-- Slide 11 -->

Remediation in Agent Sandbox

Sandbox

Code assistant

reads the evidence, writes a patch

and runs the tests

no cluster credentials and an egress allowlist

Remediation

needed

A pull request

green opens a PR

red opens an issue

Already on Kubernetes

Agent Sandbox

Kubernetes SIG Apps, one pod per agent

Agent Substrate

CNCF sandbox, many agents per node

Agent Sandbox: agent-sandbox.sigs.k8s.io

Agent Substrate: github.com/agent-substrate/substrate

Note:
One picture, because the point is simple: the code the agent writes runs somewhere disposable. It has no cluster credentials, so a prompt-injected agent has nothing to ask the API server for, and it can only reach an egress allowlist, so it has nowhere to call. The pull request is the only thing that leaves. Agent Sandbox is the Kubernetes SIG Apps project that made this shape standard, one pod per agent; Agent Substrate takes the other bet, many agents packed onto a few nodes because most of them are idle. Pick whichever matches how many agents you run. The box is the same.

---

<!-- Slide 12 -->

The implementation

Java !?!?

Quarkus

LangChain4j

Note:
Why Java, in one breath: the services this agent fixes are Java, so the fixer speaks the same language as the thing it repairs. No new runtime to operate, no second toolchain in CI, and the team that reviews the pull request can read the code that wrote it. Quarkus is the runtime, chosen because it starts fast and takes little memory in the cluster next to the rollout controller. LangChain4j is the agent library: @SequenceAgent and @ParallelAgent are interfaces with typed parameters, not prompt strings in a script, and the same annotations give you the A2A server and client, CDI injection, config, health checks and OpenTelemetry. Both are open source.

---

<!-- Slide 13 -->

Agentic workflows as typed interfaces

AnalysisOrchestratorAgent.java

1

1

@SequenceAgent

The annotation declares the order

2

2

Three sub-agents

Two fetch data and one decides

3

3

The result is a record

fields the gate can score

@SequenceAgent(

    description = "Complete Kubernetes rollout analysis workflow",

    outputKey = "analysisResult",

    subAgents = {

        AnalysisDataAgent.class,

        DataCombinerAgent.class,

        AnalysisAgent.class

    }

)

ResultWithAgenticScope<AnalysisResult> execute(

    String message,

    String namespace,

    String stableSelector,

    String canarySelector

);

Note:
Fifteen lines, and none of it is prose. @SequenceAgent declares the order: the data agent, the combiner, the analysis agent. The data agent fans out to diagnostics, metrics and rollout status in parallel, and only the last agent calls a model. The return type is an AnalysisResult record, promote, confidence, root cause, suspect classes, so the model's answer arrives as fields the gate can score, not a paragraph someone has to parse. The agentic scope wrapper also carries the intermediate evidence, which is what the grader scores the conclusion against. The interface is a bean, so the whole workflow is mockable in tests.

---

<!-- Slide 14 -->

Demo time !!

Note:
Switch to the cluster here. Two lines on the picture, and only one of them moves: the canary holds stable until the rollout reaches sixty percent, then p95 climbs to five times the stable value while the success rate stays at ninety-nine and the logs stay clean. That is the whole point of the demo, so point at the flat part first and say it looks fine. Everything after that is the machine noticing what the logs did not. If the cluster misbehaves, fall back to the recorded clip.

---

<!-- Slide 15 -->

What you just saw (hopefully)

Note:
The demo in one line, read right to left along the bottom. The first analysis passes at ten percent and nothing looks wrong. At sixty percent p95 climbs to five times the stable value, the second analysis fails, and the controller aborts without anyone typing a command. Then the agent writes the fix in the sandbox, runs the tests, and opens a pull request that waits for a human. That last box is deliberate: nothing merges itself.

---

<!-- Slide 16 -->

THANK YOU

Keep the rollout

Add the loop

All open source!

Kevin Dubois

github.com/kdubois    linkedin.com/in/kevindubois

Carlos Sanchez

github.com/carlossg    linkedin.com/in/carlossg

github.com/kdubois/kubernetes-aiops-agent

The analysis agent and the LangChain4j workflow

github.com/kdubois/remediation-agent

Sandbox, coding agent, pull request or issue

argoproj-labs/rollouts-plugin-metric-ai

The Argo Rollouts metric provider that calls it

Session feedback

Scan and rate the talk

Slides: speakerdeck.com/kdubois/the-agent-broke-it-the-agent-fixed-it-dot-pptx

Note:
Land the ask, then stop talking. Keep progressive delivery, add the step after it: something that reads the evidence and opens a fix. Everything on this slide is public, and the plugin is in argoproj-labs, so anyone can wire it into their own Rollouts install. Point at the QR once, ask for the feedback, and leave it up for questions.

---

<!-- Slide 17 -->

Sources

Cloudflare postmortem, 18 Nov 2025

blog.cloudflare.com/18-november-2025-outage

CrowdStrike losses: Parametrix via Reuters

reuters.com/technology/fortune-500-firms-see-54-bln-crowdstrike-losses-says-insurer-parametrix

SEC order against Knight Capital

www.sec.gov/newsroom/press-releases/2013-222

DORA 2025 report

dora.dev/research/2025/dora-report/

Sonar, State of Code 2026 (Jan 2026)

www.sonarsource.com/blog/state-of-code-developer-survey-report-the-current-reality-of-ai-coding

CodeRabbit, AI vs human code

coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report

Lightrun survey, via VentureBeat

venturebeat.com/technology/43-of-ai-generated-code-changes-need-debugging-in-production-survey-finds

Quarkus benchmarks vs Spring Boot

quarkus.io/blog/new-benchmarks

Agent Sandbox, Kubernetes SIG Apps

agent-sandbox.sigs.k8s.io

Agent Substrate, CNCF sandbox

github.com/agent-substrate/substrate

Note:
Appendix, not presented. Every number on the slides traces to one of these. The DORA figure is the 2025 report: 21.3% under an hour, 35.3% between an hour and a day, 43.4% more than a day. The Cloudflare times come from their own postmortem timeline. The CrowdStrike loss estimate is Parametrix's, reported by Reuters, not CrowdStrike's.
