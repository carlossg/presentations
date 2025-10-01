<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

## Self-Healing Rollouts

#### Automating Production Fixes with Agentic AI
#### & Argo Rollouts

<a href="http://adobe.com"><img width="300" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"></a>

Carlos Sanchez /
[csanchez.org](http://csanchez.org)
/
[@csanchez](https://bsky.app/profile/csanchez.bsky.social)
<!-- /
[@csanchez@fosstodon.org](https://fosstodon.org/@csanchez) -->

<!-- <small>[Watch online at presentations.csanchez.org](https://presentations.csanchez.org/)</small> -->

----

Principal Scientist

[Adobe Experience Manager Cloud Service](https://www.adobe.com/marketing/experience-manager/cloud-service.html)

Long time OSS contributor at Kubernetes, Jenkins, Apache Maven,…

<!-- <img width="300" data-src="../assets/gde.png" alt="GDE logo"> -->

---




# Progressive Delivery

----

> [Progressive Delivery](https://redmonk.com/jgovernor/2018/08/06/towards-progressive-delivery/) is a term that includes deployment strategies that try to avoid the pitfalls of all-or-nothing deployment strategies

----

> New versions being deployed do not replace existing versions but run in parallel for an amount of time receiving live production traffic, and are evaluated in terms of correctness and performance before the rollout is considered successful.

----

<img data-src="crowdstrike.png">

----

<img data-src="crowdstrike_remediation.png">

----

<!-- Continuous Delivery is hard

Progressive Delivery makes Continuous Delivery easier to adopt

reduces the risk associated with Continuous Delivery -->



* Avoiding downtime
* Limit the blast radius
* Shorter time from idea to production

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

## Argo Rollouts

<img height="500px" data-src="../assets/argo-icon-color-square.png">

----

## Argo Rollouts

> provides advanced deployment capabilities such as blue-green, canary, canary analysis, experimentation, and progressive delivery features to Kubernetes.

----

## Argo Rollouts

<img data-src="../assets/argo-rollout-architecture.png">

----

<!-- <img height="600px" data-src="../assets/argo-rollout-ui.png"> -->

<img height="400px" data-src="feedback-loop-diagram1.png">

----

<img height="600px" data-src="conspiracy theory.png">

----

<img height="400px" data-src="feedback-loop-diagram2.png">

----

<img height="600px" data-src="ai_pet_family.png">

---



Rolling out changes to all users at once is risky

Canary rollouts and feature flags are safer

AI Agents can automate the loop fixing the failures

----

<div class="container">

<div class="col">

<img height="200px" data-src="welcome_our_robot_overlords.webp">

</div>

<div class="col">

<img height="200px" style="vertical-align:middle" data-src="feedback-qr.png">

</div>

</div>

<div>

<small><a href="https://argoproj.github.io/rollouts/">argoproj.github.io/rollouts</a></small>
<br>
<small><a href="https://github.com/carlossg/rollouts-plugin-metric-ai">github.com/carlossg/rollouts-plugin-metric-ai</a></small>
<br>
<small><a href="https://github.com/carlossg/rollouts-demo">github.com/carlossg/rollouts-demo</a></small>


[csanchez.org](http://csanchez.org)
/
<img height="32px" style="vertical-align:middle" data-src="../assets/Bluesky_Logo.png">[csanchez](https://bsky.app/profile/csanchez.bsky.social)
/
<img height="32px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg](https://github.com/carlossg)
<!-- <img width="100px" data-src="../assets/blog-qr-code.png"> -->

</div>

<!-- <div class="col">
    <img width="80%" data-src="../assets/magritte.png">
</div> -->


<a href="http://adobe.com"><img width="300" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"></a>
