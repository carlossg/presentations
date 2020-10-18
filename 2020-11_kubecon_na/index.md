<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

## The Cloud Native Journey at

<a href="http://adobe.com"><img width="400" data-src="../assets/Adobe_Corporate_Horizontal_Lockup_Red_RGB.svg" alt="Adobe logo" style="background:white"></a>

Carlos Sanchez /
[csanchez.org](http://csanchez.org) / 
[@csanchez](http://twitter.com/csanchez)


---

Cloud Engineer

[Adobe Experience Manager Cloud Service](https://www.adobe.com/marketing/experience-manager/cloud-service.html)

Author of Jenkins Kubernetes plugin

Long time OSS contributor at Jenkins X, Apache Maven, Eclipse, Puppet,…

---


# Adobe Experience Manager

----

## Disclaimer

This applies to my team inside Adobe Experience Manager Cloud Service

There are many teams in AEM

There are maaany teams in Adobe

----

Content Management System

Digital Asset Management

Digital Enrollment and Forms

Used by many Fortune 100 companies

----

An existing distributed Java application

Author instances for authors

Publish instances for web visitors

Both can scale horizontally

----

## Stack

Java using OSGi for modules

Using OSS components from Apache Software Foundation

A huge market of extension developers

Writing modules that run in-process on AEM

---




# AEM on Kubernetes

----

Running on Azure

10+ clusters and growing

Multiple regions: US, Europe, Australia, more coming

Adobe has a dedicated team managing clusters for multiple products

----

## AEM Environments

* Customers can have multiple AEM environments that they can self-serve
<!-- * Customers run their dev/stage/production -->
* Each customer: 3+ Kubernetes namespaces (dev, stage, prod environments)
* Sandboxes, evaluation-like environments

Customers interact through Cloud Manager, a separate service with web UI and API

----

## Environments

Namespaces provide a scope

* network isolation
* quotas
* permissions

----

## Environments

Using init containers and (many) sidecars to apply division of concerns

<img width="400" data-src="../assets/meme-sidecar.jpeg">

----

## Sidecars

* Storage initialization
* httpd fronting the Java app
* Exporting metrics
* fluent-bit to send logs
* Java threaddump collection

----

## Sidecars

* Custom developed (threaddump collector, storage initialization)
* OSS (fluent-bit)
* Extended from OSS (httpd)


----

## Scaling

100s of customers

1000s of sandboxes

----

## Scaling

* ⚠️ Azure API rate limits can be hit on upgrades, so we limit each cluster to a few hundred nodes

* You could have bigger nodes too

Using Kubernetes Vertical and Horizontal Pod Autoscaler

----

## Scaling: VPA

We use VPA to scale up/down on memory and CPU

JVM footprint is hard to reduce

Changes to requests need pod restarts to become effective

⚠️ Do not set VPA to auto if you don't want random pod restart

----

## Scaling: HPA

HPA scales up on requests/minute

⚠️ Do not use same metrics as VPA

----

## Scaling: Hibernation

<img width="400" data-src="../assets/meme-hibernation.jpg">

For engineering environments and sandboxes that are seldomly used

Allows overbooking clusters and $$$ savings

----

## Scaling: Hibernation

* Kubernetes job checks Prometheus metrics
* If no activity in _n_ hours, scale deployment to 0
* Customer is shown a message to de-hibernate by clicking a button

Ideally it would de-hibernate automatically on new request,
more like Function as a Service, but JVM takes ~5 min to start

----

## Networking

<img width="400" data-src="https://media.giphy.com/media/xUA7aRuBrh8DNTVcze/giphy-downsized.gif">

----

## Networking

Kubernetes networking is complex

Multitenancy is even more

Services cannot connect to other namespaces

Everything blocked by default, open on each service case by case

----

## Networking

Everything is virtual

* Allows flexibility
* Introduces complexity

![](https://media.giphy.com/media/ggQesMRbhmulePsq3p/giphy-downsized.gif)

----

## Networking: [Cilium](https://cilium.io/)

* eBPF instead of iptables
* More efficient and performant
* Custom network policies at level 7 (path, header, method,...)

----


## Networking: Cilium

`NetworkPolicy` to block/allow traffic
* Block access to other namespaces
* Allow outgoing https and other common ports

Customers may also want to allow specific ingress ips only, ie. for dev/stage

----

## Networking: Ingress

Using a Contour fork

* With more features than standard Kubernetes `Ingress` object
* blocklist/allowlist, path based routing,...
* Uses Envoy proxy behind the scenes

----

## Networking: Envoy

<img width="400" data-src="https://media.giphy.com/media/mWO9gCz9v4Ak3cJJMO/giphy.gif">

* ⚠️ Missconfigurations can cause cluster wide issues
* ⚠️ Restarting it when config is wrong will clear all routes
* ⚠️ Locks when the rate of changes is too high

----

## Networking: Envoy

We had to do work to fix issues and use it correctly

ie. Validation of all configs both at build and runtime

<img width="300" data-src="https://media.giphy.com/media/147JO3pIxNJ4oo/giphy.gif">

----

## Logging

* Using `fluent-bit` sidecars to send logs to centralized store
* [Grafana `loki`](https://grafana.com/oss/loki/) for log aggregation

----

## Monitoring and Alerting

<img width="200" data-src="https://media.giphy.com/media/Tdpbuz8KP0EpQfJR3T/giphy.gif">

* Multiple Prometheus and Grafana
* Aggregating all clusters data
* Alerts coming from Prometheus AlertManager

----

## Customer Logging

Customers also need access to some logs

* `fluent-bit` sends logs to `logstash`/`loki` service
* Customer can view them in Cloud Manager
* ⚠️ `logstash` is heavy, 2GB+ memory needed, `loki` a better option

----

## Resiliency and Self Healing

<img width="180" data-src="https://media.giphy.com/media/lSVL6vdhdZVPW/giphy.gif">

* [Readiness and liveness probes](https://cloud.google.com/blog/products/gcp/kubernetes-best-practices-setting-up-health-checks-with-readiness-and-liveness-probes) so services are marked unavailable and restarted automatically
* [`PodDisruptionBudget`](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) to ensure a number of replicas on rollouts and cluster upgrades
* [`podAntiAffinity`](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) to distribute service across nodes and availability zones


----

## Multitenancy

Limit blast radius

Customers are namespace isolated

⚠️ All deployments **must** have CPU/memory requests and limits

----

### Running Customer Code

<img  data-src="https://media.giphy.com/media/Qtp1Ps7V6mRZwja223/giphy.gif">

Pods that run customer code are a higher risk

Started testing Kata Containers, pod runs in a VM transparently

Contributing improvements upstream

---




# External Services

----

## Persistence

* External MongoDB
* Azure Blob Storage

----

## Persistence

Kubernetes Persistent Volumes are a bit risky in Azure

* ⚠️ Can get the cluster in a bad state due to Azure API rate limitting at 100s of Persistent Volumes
* It is supposed to improve with new versions of the Azure Kubernetes cluster controller

----

## Data Processing

Using Kafka based service to sync data between author and publish

Works worldwide, when publishers are in multiple regions

----

## CDN: Fastly

<img data-src="https://media.giphy.com/media/Gpu3skdN58ApO/giphy.gif">
<br/>

* Fastly in front of the Load Balancer
* Binary content stored in Azure blobs

----

## Egress Dedicated ip

Dedicated ip requested by some customers for firewall configuration

Or to avoid being throttled/blocked by other tenants

----

## Egress Dedicated ip

* Scale set of proxies dedicated per customer
* Dedicated egress load balancer that sets the outgoing ip
* Using network policies to allow only the customer to access its proxy


---



# Continuous Delivery

----

AEM: From yearly to daily release

<img width="650" data-src="https://media.giphy.com/media/7XsFGzfP6WmC4/source.gif">

----

Using Jenkins for CI/CD

Using queues to trigger some jobs

----

## GitOps

Most configuration is stored in git
and reconciled on each commit

Pull vs Push model to scale

----

## Kubernetes Deployments

Combination of 

* Helm: AEM application
* Plain Kubernetes files: ops services
* Kustomize: some new microservices

----

## Helm

* ⚠️ Don't mix application and infra in the same package
* Need to push to all namespaces, would be easier pulling
* Moving to Helm operator that can be an improvement

----

## Kubeval

`Kubeval` to validate Kubernetes schemas

We added schema validation of some custom CRDs

----

## Conftest

`Conftest` to validate policies while allowing developer autonomy

* security recommendations
* labelling standards
* image sources

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


<a href="http://adobe.com"><img width="400" data-src="../assets/Adobe_Corporate_Horizontal_Lockup_Red_RGB.svg" alt="Adobe logo" style="background:white"></a>
