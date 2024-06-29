<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

## Progressive Delivery in Kubernetes

<a href="http://adobe.com"><img width="300" data-src="../assets/Adobe_Corporate_Horizontal_Lockup_Red_RGB.svg" alt="Adobe logo" style="background:white"></a>

Carlos Sanchez /
[csanchez.org](http://csanchez.org)
/
[@csanchez](http://twitter.com/csanchez)
<!-- /
[@csanchez@fosstodon.org](https://fosstodon.org/@csanchez) -->

<!-- <small>[Watch online at carlossg.github.io/presentations](https://carlossg.github.io/presentations)</small> -->

----

Principal Scientist

[Adobe Experience Manager Cloud Service](https://www.adobe.com/marketing/experience-manager/cloud-service.html)

Long time OSS contributor at Jenkins, Apache Maven, Puppet,…

<!-- <img width="300" data-src="../assets/gde.png" alt="GDE logo"> -->

---




# Progressive Delivery

----

<img data-src="../assets/progressive-delivery-launchdarkly.png">

----

<img width="800" data-src="../assets/progressive-delivery-redmonk.png">

----

> [Progressive Delivery](https://redmonk.com/jgovernor/2018/08/06/towards-progressive-delivery/) is a term that includes deployment strategies that try to avoid the pitfalls of all-or-nothing deployment strategies

----

> New versions being deployed do not replace existing versions but run in parallel for an amount of time receiving live production traffic, and are evaluated in terms of correctness and performance before the rollout is considered successful.

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

## Feature Flags

<a href="https://martinfowler.com/articles/feature-toggles.html">
  <img data-src="../assets/feature-toggles_jp.png">
</a>


----

## Monitoring is the new testing

Know when users are experiencing issues **in production**

React to the issues **automatically**

----

<!-- Progressive Delivery requires a good amount of metrics -->



<img height="100%" width="100%" data-src="../assets/devops_borat.png">

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

<img height="600px" data-src="../assets/yaml.jpg">

----

<img height="600px" data-src="../assets/argo-canary-deployments.png">

----

<img height="600px" data-src="../assets/argo-rollout-ui.png">




<!-- <img data-src="../assets/istio.png"> -->

<!-- ## Prometheus

<img data-src="../assets/prometheus_logo_orange_circle.svg">

A systems monitoring and alerting toolkit -->

<!--

<img data-src="../assets/quarkus_logo_horizontal_rgb.png">

[quarkus.io](https://quarkus.io/)

A Kubernetes Native Java stack tailored for GraalVM & OpenJDK HotSpot, crafted from the best of breed Java libraries and standards
-->

---





<div class="container">

<div class="col">

[csanchez.org](http://csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/twitter-logo.png">[csanchez](http://twitter.com/csanchez)

<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg](https://github.com/carlossg)

</div>

<!-- <div class="col">
    <img width="80%" data-src="../assets/magritte.png">
</div> -->

<div class="col">

<img width="50%" data-src="../assets/blog-qr-code.png">


</div>
</div>
