<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
.reveal pre{
    font-size: 0.4em;
    line-height: 1.2;
}
.reveal .slides pre code{
    max-height: none;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>

## The Agent Broke It, the Agent Fixed It

### Self-Healing Code Rollouts with Agentic AI

<a href="http://adobe.com"><img width="300" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"></a>

Carlos Sanchez /
[csanchez.org](http://csanchez.org) /
[@csanchez.org](https://bsky.app/profile/csanchez.org)

---

Principal Scientist

[Adobe Experience Manager](https://www.adobe.com/marketing/experience-manager)

Long time OSS contributor at Kubernetes, Jenkins, Apache Maven,...

<img width="300" data-src="../assets/gde.png" alt="GDE logo">

---

<img width="900" data-src="crowdstrike.png" alt="CrowdStrike identifies the issue behind the worldwide outage and advises a workaround">

----

### What could have mitigated the impact?

<img width="900" data-src="crowdstrike-remediation.png" alt="CrowdStrike remediation: template instances should have staged deployment, validation, and acceptance checks">

---

# Progressive Delivery

----

> [Progressive Delivery](https://redmonk.com/jgovernor/2018/08/06/towards-progressive-delivery/) is a term that includes deployment strategies that try to avoid the pitfalls of all-or-nothing deployment strategies

----

> New versions being deployed do not replace existing versions but run in parallel for an amount of time receiving live production traffic, and are evaluated in terms of correctness and performance before the rollout is considered successful.

----

* Avoiding downtime
* Limit the blast radius
* Shorter time from idea to production

----

Rolling out changes to all users at once is risky

Canary rollouts and feature flags are safer

AI Agents can automate the loop fixing the failures


---




# Progressive Delivery Techniques

----

## Rolling Updates

<img data-src="../assets/module_06_rollingupdates.gif" height="500px">

----

## Blue-Green Deployment

<a href="https://medium.com/continuous-deployment/continuous-deployment-strategies-32e2f7badd2">
  <img data-src="../assets/blue_green_deployments_jp.png" height="480px">
</a>

----

## Canary Deployment

<a href="https://medium.com/continuous-deployment/continuous-deployment-strategies-32e2f7badd2">
  <img data-src="../assets/canary_deployments_jp.png" height="480px">
</a>

----

## Dark Launching

<a href="https://martinfowler.com/bliki/DarkLaunching.html">
  <img data-src="../assets/dark-launching_jp.png">
</a>

----

## Feature Flags

<a href="https://martinfowler.com/articles/feature-toggles.html">
  <img data-src="../assets/feature-toggles_jp.png">
</a>


----

## Monitoring is the new testing

Know when users are experiencing issues **in production**

React to the issues **automatically**

----

> If you haven't automatically destroyed something by mistake, you are not automating enough


---




# Progressive Delivery in Kubernetes

----

### Kubernetes Service Architecture

<img height="400px" data-src="../assets/k8s-loadbalancer.png">

----

### Kubernetes Ingress Architecture

<img height="400px" data-src="../assets/k8s-ingress.png">


----

### Kubernetes Ingress

Ingress controllers:

* AWS
* GCE
* nginx
* Ambassador
* Istio Ingress
* Traefik
* HAProxy
* ...

---

# GitOps

Git is the single source of truth

Treat everything as code

Operations through Git workflows

----

<img width="1100" data-src="gitops-delivery.png" alt="GitOps application delivery: pull requests, source and config Git repositories, image registry, Kubernetes, and the deploy-monitor-detect-drift loop">

----

### By default:

A big bang / all or nothing release

---

# Argo Rollouts

----

<img width="1000" data-src="argo-rollouts.png" alt="Argo Rollouts and Flagger enable progressive delivery on Kubernetes">

----

### Increase percentage of new (canary) version

<img width="1100" data-src="canary-traffic.png" alt="Argo Rollouts analyzes canary metrics and either rolls back or promotes the canary by increasing its weight">

----

### Continuous analysis with Prometheus

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
spec:
  args:
  - name: service-name
  metrics:
  - name: success-rate
    interval: 10s
    successCondition: len(result) == 0 || result[0] >= 0.95
    failureLimit: 2
    provider:
      prometheus:
        address: http://prometheus.istio-system.svc.cluster.local:9090
        query: |
          sum(irate(istio_requests_total{
            reporter="source",
            destination_service=~"{{args.service-name}}",
            response_code!~"5.*"}[30s])
          )
```

---

# AI-Powered Rollout Analysis

----

<img height="600" data-src="ai-brain.png" alt="Instead of writing custom PromQL, use AI to analyze failures">

----

<img width="1100" data-src="aiops-rollout.png" alt="Source code is deployed to a canary, analyzed by AI, and either promoted to production or rolled back">

----

<img width="1100" data-src="aiops-agent.jpeg" alt="Argo Rollouts canary analysis with an AI metric plugin: configuration, agent requests, numeric results, promotion, and rollback">

<!-- 

A detailed technical architectural infographic diagram titled "Argo Rollouts Canary Analysis with AI Plugin" (written at the top center), themed around Botswana culture, architecture, and landscapes, illustrated in a clean, hand-drawn vector anime and comic style. All text and labels must be strictly in English.

Layout and Composition:
- Split into a narrow left panel and a broad right workflow panel, framed by rustic carved wooden poles and decorative borders featuring traditional Batswana geometric patterns (leteisi and basket weaving motifs in shades of Botswana sky blue, white, black, and earth ochre). Wildflowers dot the top frame.

Left Panel ("Configuration"):
- Styled like the earth and thatch wall of a traditional Batswana rondavel hut with natural clay textures and subtle painted tribal wall motifs (lolwapa).
- Contains clean technical configuration cards:
  - Top Card: 
    "Configuration"
    "AnalysisTemplate (canary-analysis-ai-agent)"
    "Metrics:"
    "  - success-rate"
    "    plugin: argoproj-labs/metric-ai"
    "Success Condition: successCondition > 0.50"
  - Middle Card:
    "Rollout:"
    "  Strategy: Canary"
    "  analysis:"
    "    templates [canary-analysis-ai-agent]"
    "  metadata:"
    "    canary: role=canary"
    "    stable: role=stable"
  - Bottom Card:
    "RolloutManager: Manager"
    "  plugins:"
    "    metric: argoproj-labs/metric-ai"

Right Workflow Panel ("Execution Process"):
- Header: "Execution Process" under an open savanna sky with a crescent moon and acacia trees.
- Central Hub: Traditional Batswana village courtyard (kgotla) and cattle kraal (lesaka).
- Argo Rollouts Controller: Modern server rack integrated into a sturdy kraal fence made of intertwined wooden poles, branded with a glowing Kubernetes wheel emblem inside a braided rope ring, labeled "K8s Namespace", "Argo Rollouts Controller", and "Configures Plugin".
- Analysis Execution: Thatched, open-sided meeting pavilion (kgotla) labeled "Analysis Execution (Created for 'canary-analysis-ai-agent')", containing a flowchart: "Interval: 10s" -> "Metric Plugin" -> "Result: numeric" -> diamond decision box "Condition Check: result > 0.50?".
- AI Service Destination: On the far right, across a wooden bridge over an Okavango Delta water channel, a modern glass skyscraper with African modernist wood-slat sunshades labeled "AI Agent Service" with a glowing green chip logo. Labeled arrows: "Metric Request (labels, prompt)" and "Metric Result (numeric value)".

Outcome Paths at Bottom:
- YES Branch (Green arrow, bottom left): Leads to a lush savanna settlement with figures in traditional blue-and-white leteisi garments under baobab trees. Displays blue cube clusters labeled "CANARY (new version)" and gray clusters labeled "STABLE (old version)", captioned: "Increase canary weight towards full rollout".
- NO Branch (Red arrow, bottom right): Leads to a dry, overcast patch of drought veld with thorn trees and storm clouds. Labeled "CANARY (New Version Rollback)" with blue and gray cube clusters, captioned: "Halt rollout, abort and rollback".

Art Style & Aesthetic:
Clean vector line work, comic cel-shading, detailed technical schematic lines, soft earth ochres, savanna greens, and striking Botswana sky blue. Clean, crisp English typography integrated seamlessly into the artwork.

 -->

----

### Register the AI metric plugin

```yaml
apiVersion: argoproj.io/v1alpha1
kind: RolloutManager
metadata:
  name: argo-rollouts
spec:
  plugins:
    metric:
    - name: argoproj-labs/metric-ai
      location: >-
        https://github.com/argoproj-labs/rollouts-plugin-metric-ai/releases/download/v0.0.1/rollouts-plugin-metric-ai-linux-amd64
```

----

### Configure canary analysis

```yaml
canary:
  analysis:
    startingStep: 1
    templates:
    - templateName: canary-analysis-ai-agent
  canaryMetadata:
    labels:
      role: canary
  stableMetadata:
    labels:
      role: stable
```

----

### Let the AI agent evaluate the rollout

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: canary-analysis-ai-agent
spec:
  metrics:
  - interval: 10s
    name: success-rate
    provider:
      plugin:
        argoproj-labs/metric-ai:
          agentUrl: http://kubernetes-agent:8080
          stableLabel: role=stable
          canaryLabel: role=canary
          extraPrompt: ignore aesthetic changes
    successCondition: result > 0.50
```

---

<img height="600" data-src="ai-development-meme.png" alt="But wait, there's more">

----

### Asynchronous remediation

<img width="1100" data-src="async-agent-workflow.png" alt="Parallel metrics and logs agents analyze and score the rollout in a quality-check loop. Failed rollouts asynchronously trigger remediation, producing a pull request for a simple code fix or a descriptive issue.">

----

### Give the agent the source repository

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: canary-analysis-ai-agent
spec:
  metrics:
  - interval: 10s
    name: success-rate
    provider:
      plugin:
        argoproj-labs/metric-ai:
          agentUrl: http://kubernetes-agent:8080
          stableLabel: role=stable
          canaryLabel: role=canary
          extraPrompt: ignore aesthetic changes
          githubUrl: https://github.com/kdubois/argo-rollouts-quarkus-demo
```

---

# Demo

----

<!-- .slide: data-background-video="demo-antigravity-quarkus.mp4" data-background-size="contain" data-background-color="#000000" -->

---

## Lessons learned

Performance was an interesting challenge

From one AI service to an agentic system: parallel and async agents

----

### LLM choice + context engineering + tool calling

Especially for PR creation

----

### Complexity vs portability

Could have used Serverless MCP, an external code assistant for PR creation, async remote agents, etc.

---

## Takeaways

Rolling out changes to all users at once is risky

Canary rollouts and feature flags are safer

AI agents can automate the loop by analyzing metrics and logs, and even proposing fixes for failures

----

<img height="600" data-src="ai-takeaway.png" alt="An AI-powered helper supports the team">

---

## Resources

Argo Rollouts Plugin for AI metrics

[rollouts-plugin-metric-ai](https://github.com/argoproj-labs/rollouts-plugin-metric-ai)

Demo app

[argo-rollouts-quarkus-demo](https://github.com/kdubois/argo-rollouts-quarkus-demo)

Antigravity SDK Agents

[kubernetes-agents-antigravity](https://github.com/carlossg/kubernetes-agents-antigravity)

<!-- [kubernetes-aiops-agent](https://github.com/kdubois/kubernetes-aiops-agent) -->

<!-- [progressive-delivery](https://github.com/kdubois/progressive-delivery) -->

---

<div class="container">

<div class="col">

[csanchez.org](http://csanchez.org)

[@csanchez](https://x.com/csanchez)<br>
[@csanchez.org](https://bsky.app/profile/csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png" alt="GitHub"> [carlossg](https://github.com/carlossg)

</div>

<div class="col">

<img width="50%" data-src="../assets/instagram-qr-code.png" alt="Carlos Sanchez's instagram QR code">

</div>
</div>

<a href="http://adobe.com"><img width="400" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"></a>
