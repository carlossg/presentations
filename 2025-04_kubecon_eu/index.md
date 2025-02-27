<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

## Debugging Envoy Tunnels: A Deep Dive

<a href="http://adobe.com"><img width="300" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"></a>

Alexandra Stoica / Carlos Sanchez

<!-- <small>[Watch online at carlossg.github.io/presentations](https://carlossg.github.io/presentations)</small> -->

---

**Alexandra / Site Reliability Engineer**

<small>

Managing Cloud Infrastructure at Adobe

[alexandra-gabriela-stoica](https://www.linkedin.com/in/alexandra-gabriela-stoica/)

</small>

**Carlos / Principal Scientist**

<small>

OSS contributor, Jenkins Kubernetes plugin

[@csanchez.org](https://bsky.app/profile/csanchez.org)

</small>

**[Adobe Experience Manager Cloud Service](https://www.adobe.com/marketing/experience-manager/cloud-service.html)**


---


# Adobe Experience Manager

----

A Content and Digital Asset Management system

An existing distributed Java OSGi application

Using OSS components from Apache Software Foundation

A huge market of extension developers

----

Running on **Azure**

**60+ clusters** and growing

**Multiple regions**: US+, Europe+, Australia, Singapore, Japan, India, more coming

<!-- Adobe has a **dedicated team** managing clusters for multiple products -->

----


# Scale

31k+ environments

200k+ `Deployments`

12k+ namespaces


----

## Dedicated Infrastructure

Customers want to have dedicated infrastructure

* Egress IPs
* Private connections (VNET peering, Private Link, ExpressRoute, Direct Connect,...)
* VPN

----

# Envoy

An open source edge and service proxy, designed for cloud-native applications

---






# Quizz time

----

<img data-src="debugging-fortes.png">

<!-- <img height="400" data-src="Firefly a whodunit movie theme with people in a room style Agatha Christie 30561.jpg"> -->

----

<img width="100%" data-src="envoy.drawio.svg">

----

<iframe src="https://play.kahoot.it/v2/lobby?quizId=3f4ab1e5-fca1-4c2a-8d18-b465e312b9de" height="100%" width="100%" frameBorder="0" style="min-height: 560px;" allow="clipboard-write" title="Kahoot"></iframe>

---






## Envoy Config: Resources

envoyproxy.io

[arch_overview/http/upgrades](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/http/upgrades)

[sandboxes/tls](https://www.envoyproxy.io/docs/envoy/latest/start/sandboxes/tls)

[sandboxes/double-proxy](https://www.envoyproxy.io/docs/envoy/latest/start/sandboxes/double-proxy)

[github.com/carlossg/envoy-debugging-demo](https://github.com/carlossg/envoy-debugging-demo)

<img style="vertical-align:middle" data-src="https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fwww.envoyproxy.io%2Fdocs%2Fenvoy%2Flatest%2Fintro%2Farch_overview%2Fhttp%2Fupgrades&size=150x150&margin=0">

<img style="vertical-align:middle" data-src="https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fwww.envoyproxy.io%2Fdocs%2Fenvoy%2Flatest%2Fstart%2Fsandboxes%2Ftls.html&size=150x150&margin=0">

<img style="vertical-align:middle" data-src="https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fwww.envoyproxy.io%2Fdocs%2Fenvoy%2Flatest%2Fstart%2Fsandboxes%2Fdouble-proxy&size=150x150&margin=0">

<img style="vertical-align:middle" data-src="https://api.qrserver.com/v1/create-qr-code/?data=https://github.com/carlossg/envoy-debugging-demo&size=150x150&margin=0">

----

 <img style="vertical-align:middle" data-src="https://api.qrserver.com/v1/create-qr-code/?data=https://kccnceu2025.sched.com/event/1txEO/debugging-envoy-tunnels-a-deep-dive-carlos-sanchez-alexandra-stoica-adobe&size=150x150&margin=0">



<div class="container">

<div class="col">


<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [alexandrasgabriela](https://github.com/alexandrasgabriela)

<img height="64px" style="vertical-align:middle" data-src="../assets/LinkedIn_icon.svg">[alexandra-gabriela-stoica](https://www.linkedin.com/in/alexandra-gabriela-stoica/)


</div>

<!-- <div class="col">
    <img width="80%" data-src="../assets/magritte.png">
</div> -->

<div class="col">

<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg](https://github.com/carlossg)

<img height="64px" style="vertical-align:middle" data-src="../assets/Bluesky_Logo.png">[@csanchez.org](https://bsky.app/profile/csanchez.org)

<!-- [csanchez.org](http://csanchez.org) -->

<!-- <img height="300px" style="vertical-align:middle" data-src="qr.png"></img> -->


</div>
</div>

<a href="http://adobe.com"><img width="400" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"></a>
