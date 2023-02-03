<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

## Continuous Delivery to many Kubernetes Clusters

<a href="http://adobe.com"><img width="300" data-src="../assets/Adobe_Corporate_Horizontal_Lockup_Red_RGB.svg" alt="Adobe logo" style="background:white"></a>

Carlos Sanchez /
[csanchez.org](http://csanchez.org) / 
[@csanchez](http://twitter.com/csanchez)


----

Principal Scientist

[Adobe Experience Manager Cloud Service](https://www.adobe.com/marketing/experience-manager/cloud-service.html)

Author of Jenkins Kubernetes plugin

Long time OSS contributor at Jenkins, Apache Maven, Puppet,…

---


# Adobe Experience Manager

----

Content Management System

Digital Asset Management

Digital Enrollment and Forms

Used by many Fortune 100 companies

----

An existing distributed Java OSGi application

Using OSS components from Apache Software Foundation

A huge market of extension developers

---




# AEM on Kubernetes

----

Running on Azure

35 clusters and growing

11 regions: US, Europe, Australia, Singapore, Japan, India, more coming

Adobe has a dedicated team managing clusters for multiple products

----

Customers can run their own code

Cluster permissions are limited for security

Traffic leaving the clusters must be encrypted

----

## AEM Environments

* Customers can have multiple AEM environments that they can self-serve
<!-- * Customers run their dev/stage/production -->
* Each customer: 3+ Kubernetes namespaces (dev, stage, prod environments)
* Each environment is a micro-monolith ™
* Sandboxes, evaluation-like environments

Customers interact through Cloud Manager, a separate service with web UI and API

----

Using namespaces to provide a scope

* network isolation
* quotas
* permissions

----

## Services

Multiple teams building services

Different requirements, different languages

You build it you run it

Using APIs or Kubernetes operator patterns

----

## Environments

Using init containers and (many) sidecars to apply division of concerns

<img width="400" data-src="../assets/meme-sidecar.jpeg">


---



# Continuous Delivery

----

AEM: From yearly to daily release

<img width="650" data-src="https://media.giphy.com/media/7XsFGzfP6WmC4/source.gif">

----

Using Jenkins for CI/CD

Tekton and other services to orchestrate pipelines

ArgoCD for new microservices

----

## GitOps

Most configuration is stored in git
and reconciled on each commit

Pull vs Push model to scale

----

## Kubernetes Deployments

Combination of 

* Helm: AEM application
* Templated Kubernetes files: ops services
* Kustomize and ArgoCD: some new microservices

----

## Platform Engineering

* Microservice deployments with ArgoCD
* Progressive rollouts

----

## Helm

Helm operator to pull in each namespace

⚠️ Don't mix application and infra in the same package

If you cannot enforce the same Helm chart version for all tenants

----

## Helm

Global Helm overrides from platform level

* Helm values: for known options
* kustomize patches: for unknown options

ie. enforcing a sidecar image version across all Helm installations

----

## Progressive Delivery

Rollout to different customer groups in separate waves

Rollout to a percentage of customers

----

## Shift Left

Detect problems as soon as possible, not in production

Running checks on PRs so developers can act on them asap

Generating the gitops and helm templates and running multiple tests

----

### Kubectl Apply Dry Run

The most basic check

```
kubectl apply --dry-run=server
```

----

### Kubeconform

`Kubeconform` to validate Kubernetes schemas

Succesor of `Kubeval`

We added schema validation of some custom CRDs

----

### Conftest

`Conftest` to validate policies while allowing developer autonomy

* security recommendations
* labelling standards
* image sources

Using Rego language 🥺

----

### Pluto

`Pluto` to detect API versions deprecated or removed

----

## Gitinit

Our own version of gitops pull

Git definitions are stored in a blob across regions

Gitinit deployment pulls the blob and applies the changes

----

## Dealing with Secrets

Not a simple task

Cannot put secrets in plain text in git or blob

----

## Dealing with Secrets

* Vault operator to create Kubernetes Secrets
* Vault operator to mutate deployments
* Bitnami sealed secrets operator

---




# Progressive Delivery

----

## Progressive Delivery

Automated time based rollout

dev -> stage -> prod-candidate

Running in Jenkins

Ensures changes soak in dev/stage before going to prod

----

## Progressive Delivery

* feature flags at the namespace level
* templates for Kubernetes definitions

----

### Progressive Delivery: Namespaces

Developers can target different namespaces based on config files

* by environment: dev/stage/prod
* by cluster
* by template type
* a percentage

using templates in k8s objects

----

### Progressive Delivery: Rules

```yaml
containers:
- name: "foo"
  image: "foo:{{foo_version}}"
{{#enableMyRule}}
- name: "bar"
  image: "bar:{{bar_version}}"
{{/enableMyRule}}
```

```yaml
rules:
- {}
properties:
  foo_version: "1.0"
  enableMyRule: false

rules:
- namespaceEnv:
  - dev
properties:
  foo_version: "1.1"
  enableMyRule: true
```

----

### Progressive Delivery: Percentiles

```yaml
rules:
- namespaceEnv:
  - dev
  - stage
- namespaceEnv:
  - prod
  percentile: 5
properties:
  foo_version: "1.1"
  enableMyRule: true
```

----

### Progressive Delivery: Namespaces

This has proven very useful for developers to test things safely

Increases development speed, PRs are merged faster

----

### Progressive Delivery: Namespaces

dev->stage->prod is just a use case for canary deployments

The next challenge is more automation

----

## Argo Rollouts

Argo project to to automated progressive rollout and rollback

* blue-green
* canary

----

## Argo Rollouts

Rollouts progress at specific amount of time, including manual approvals

```yaml
steps:
- setWeight: 10
- pause:
    duration: 1h
- setWeight: 20
- pause:
    duration: 1h
...
```

----

## Argo Rollouts


* using service mesh
 * you can fine tune the traffic percentages
* using standard Kubernetes services
 * coarse grained, limited to number of replicas

---



# Sidecars

* Service warmup
* Storage initialization
* httpd fronting the Java app
* Exporting metrics
* fluent-bit to send logs
* Java threaddump collection
* Envoy proxying
* Autoupdater

----

## Sidecars

* Custom developed (threaddump collector, storage initialization)
* OSS (fluent-bit)
* Extended from OSS (httpd)

----

### Service warmup

Ensure that the service is ready to serve traffic

Probes the most requested paths for lazy caching

Without requiring expensive starts

----

### Exporting metrics

Export system level metrics such as

* disk size 
* disk space
* network reachability

----

### fluent-bit to send logs

Using a shared volume to send logs to a central location

Configured independently from the application

----

### Java threaddump collection

Gets the threaddumps generated by the JVM

and uploads them to a shared location

----

### Envoy proxying

Using Envoy for traffic tunneling and routing

Enables dedicated ips per tenant and VPN connectivity

Can be used as a load balancer and reverse proxy with many features: rate limiting, circuit breaking, retries, etc.

----

### Autoupdater

Runs on startup and updates any configuration needed

Allows patching the whole cluster fleet

---



# Scaling and Resource Optimization

----

Each customer environment (1000s) is a micro-monolith ™

Multiple teams building services

Need ways to scale that are orthogonal to the dev teams

----

Kubernetes workloads can define resource requests and limits:

Requests:

how many resources are guaranteed

Limits:

how many resources can be consumed

----

And are applied to

CPU

Memory

Ephemeral storage

----

CPU: may result in CPU throttling

Memory: limit enforced, results in Kernel OOM killed

Ephemeral storage: limit enforced, results in pod eviction

---




# Java and Kubernetes

----

## What is the default JVM heap size?

----

It depends

----

JDKs >11 will detect the available memory in the container, not the host

Using the container memory limits, so there is no guarantee that physical memory is available

----

Do not trust JVM ergonomics

Configure memory with

* `-XX:InitialRAMPercentage`
* `-XX:MaxRAMPercentage`
* `-XX:MinRAMPercentage`

----

Typically can use up to 75% of container memory

Unless there is a lot of off-heap memory used (ElasticSearch, Spark,...)

JVM takes all the memory on startup and manages it

JVM memory use is hidden from Kubernetes, which sees all of it as used

Set request and limits to the same value

----

## What is the default JVM Garbage Collector?

----

It depends

----

Java 11 or later: SerialGC or G1GC

Java 8: SerialGC or ParallelGC

Serial if <2 processors and < 1792MB memory available

----

Poorly tuned GC will cause pauses and other issues

----

Do not trust JVM ergonomics

Configure GC with

* `-XX:+UseSerialGC`
* `-XX:+UseParallelGC`
* `-XX:+UseG1GC`
* `-XX:+UseZGC`
* `-XX:+UseShenandoahGC`


----

![](garbage_collectors.png)

----

## How many CPUs does the JVM think are available?

----

It depends

----

As of today

* 0 ... 1023 = 1 CPU
* 1024 = (no limit)
* 2048 = 2 CPUs
* 4096 = 4 CPUs

----

But in Java 19 and backported to 11, 17, 18 in the October 2022 release

[JDK-8281181 Do not use CPU Shares to compute active processor count](https://bugs.openjdk.org/browse/JDK-8281181)

> the JDK interprets cpu.shares as an absolute number that limits how many CPUs the current process can use

Kubernetes sets `cpu.shares` from the CPU requests

----

[In versions 18.0.2+, 17.0.5+ and 11.0.17+, OpenJDK will no longer take CPU shares settings into account for its calculation of available CPU cores.](https://developers.redhat.com/articles/2022/04/19/java-17-whats-new-openjdks-container-awareness#opinionated_configuration)


----

Do not trust JVM ergonomics

Configure cpus with

* `-XX:ActiveProcessorCount`

----

### CPU requests in Kubernetes

It is used for scheduling and then a relative weight

It is not the number of CPUs that can be used

----

### CPU requests in Kubernetes

1 CPU means it can consume one CPU cycle per CPU period

Two containers with 0.1 cpu requests each can use 50% of the CPU time of the node

----

### CPU limits in Kubernetes

This translates to cgroups quota and period.

Period is by default 100ms

The limit is the number of CPU cycles that can be used in that period

After they are used the container is throttled

----

### CPU limits in Kubernetes

Example

`500m` in Kubernetes -> 50ms of CPU usage in each 100ms period

`1000m` in Kubernetes -> 100ms of CPU usage in each 100ms period

----

### CPU limits in Kubernetes

This is challenging for Java and multiple threads

For `1000m` in Kubernetes and 4 threads

you can consume all the CPU time in 25ms and be throttled for 75 ms

----

### Secrets of Performance Tuning Java on Kubernetes

by @brunoborges

https://2022.javazone.no/#/program/77f4b4f6-094a-44ba-a23f-0fd505e8d9d6


<!-- 

# Scaling

* ⚠️ API rate limits can be hit on upgrades, so we limit each cluster in the hundreds of nodes

* You could have bigger nodes too

Using Kubernetes Vertical and Horizontal Pod Autoscaler -->

---



# Kubernetes Cluster Autoscaler

Automatically increase and reduce the cluster size

----

## Kubernetes Cluster Autoscaler

Based on CPU/memory requests

Some head room for spikes

Multiple scale sets in different availability zones

At scale it is easy to cause a Denial of Service in our services or cloud services

----

## Kubernetes Cluster Autoscaler

Max nodes managed at the cluster level

Least waste Scaling Strategy

Selects the node group with the least idle CPU after scaleup

Savings: 30-50%

----

![](cluster-autoscaler.png)

----

![](cluster-autoscaler-bug.png)

---


# Vertical Pod Autoscaler

Increasing/decreasing the resources for each pod

----

## VPA

Allows scaling resources up and down for a deployment

Requires restart of pods (automatic or on next start)

(there is a PR in Kubernetes to avoid it)

Makes it slow to respond, can exhaust resources in busy nodes

⚠️ Do not set VPA to auto if you don't want random pod restart

----

## VPA

Only used in AEM dev environments to scale down if unused

And only for some containers

JVM footprint is hard to reduce

Savings: 5-15%

---



# Horizontal Pod Autoscaler

Creating more pods when needed

----

## HPA


AEM scales on CPU and http requests per minute (rpm) metrics

⚠️ Do not use same metrics as VPA

CPU autoscaling is problematic

Periodic tasks can spike the CPU, more pods do not help

Spikes on startup can trigger a cascading effect

----

# HPA

AEM needs to be warmed up on startup

rpm autoscaling is better suited

As long as customers don’t have expensive requests

Savings: 50-75%

----

Pods vs RPM

![](hpa-pods.png)
![](hpa-rpm.png)

----

## VPA vs HPA

Increasing the memory and CPU is more effective than adding more replicas

But you are going to need multiple replicas for HA

---


# Other Scalability Concerns

----

## etcd Limits

Kubernetes is not a database

Stored objects capacity (secrets/configmaps) is not infinite

----

## etcd Limits

Every mounted object will create a watch

Number of watches cause increased memory usage

Slower response time can lead to API slowness and timeouts

That will prevent reaction to changes in the cluster, ie. pod movements

----

## etcd Limits

Better to create less objects with more data than too many objects (50k+)

Use immutable secrets/configmaps to avoid watches if not needed

Don't use etcd as a database!

----

## Ingress Controller Limits

Ingress Controller uses Envoy proxy

Envoy is an edge and service proxy, designed for cloud-native applications.

Hundreds of ingresses can make Envoy reprogramming slower

Can cause traffic go to old pods no longer running

---



# Hibernation

<img width="400" data-src="../assets/meme-hibernation.jpg">

Scaling to zero environments not used

----

Scaling down multiple deployments associated to one “AEM environment”

Deleting ingress routes and other objects that may limit cluster scale

----

## Hibernation

* Kubernetes job checks Prometheus metrics
* If no activity in _n_ hours, scale deployment to 0
* Customer is shown a message to de-hibernate by clicking a button

----

## Hibernation

Ideally it would de-hibernate automatically on new request,
more like Function as a Service

but JVM takes ~5 min to start

Savings: 60-80%

---




# Automatic Resource Configuration

Service built internally at Adobe to help with resource consumption

----

## Automatic Resource Configuration

In most clusters services request more cpu/memory than used

ARC can transparently reduce cpu/memory requirements

Limits are not affected, so side effects are limited, would not trigger OOM Killer (likely)

----

### ARC Recommender

ARC recommender leverages historical metrics at the deployment level

Can provide recommendations about optimization at deployment level based on actual usage

----

### ARC Cluster Ratios

ARC can dial down resource requests at cluster/namespace level

Savings: 10-15%

----

![](arc.png)

----

Why ARC and not VPA recommender?

Full control over recommendation algorithm

Implementation at more global cluster level with deployment level recommendations

---



# Networking

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

Custom ingress controller

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

* `fluent-bit` sends logs to `loki` service
* Customer can view them in Cloud Manager
* ⚠️ `logstash` is heavy, 2GB+ memory needed, `loki` a better option

----

## Resiliency and Self Healing

<img width="180" data-src="https://media.giphy.com/media/lSVL6vdhdZVPW/giphy.gif">

* [Readiness and liveness probes](https://cloud.google.com/blog/products/gcp/kubernetes-best-practices-setting-up-health-checks-with-readiness-and-liveness-probes) so services are marked unavailable and restarted automatically
* [`PodDisruptionBudget`](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) to ensure a number of replicas on rollouts and cluster upgrades
* [`topologySpreadConstraints`](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/) to distribute service across nodes and availability zones

----

## Shutting Down

Handling `SIGTERM` to shutdown gracefully

`terminationGracePeriodSeconds` to allow services to finish their work


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

----

### Security Profiles Operator

Using SELinux, seccomp and AppArmor in Kubernetes

Allows recording, auditing and blocking system calls

---




# External Services

----

## Persistence

Remove all usage of local storage

* External MongoDB
* Azure Blob Storage

----

## Persistence

Kubernetes Persistent Volumes are not very scalable

* ⚠️ In the past hit API rate limitting at 100s of Persistent Volumes
* It is supposed to have improved

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

## Egress Connectivity Extensions

Dedicated ip requested by some customers for firewall configuration

Or to avoid being throttled/blocked by other tenants

VPN connections

----

## Egress Dedicated ip

Scale set of Envoy proxies dedicated per customer

Dedicated egress load balancer that sets the outgoing ip

Using Envoy to tunnel from sidecar to outgoing load balancer

Short lived certificates for mTLS tunnels

----

## Private Connections

Customers can connect through VPN to their private networks

Using transparently Azure VPN Gateway at the end of the Envoy mTLS tunnels


---


### Resource Optimization in Kubernetes

From the JVM: tuning CPU, memory, GC

From Kubernetes ecosystem: Cluster autoscaler, HPA, VPA
Internal: Hibernation, ARC

At application and infrastructure levels

A combination of them will help you optimize and reduce resources used


---

### Continuous and Progressive Delivery

Adding guardrails increases development speed and reduces issues

Automation to do controlled and progressive rollouts

Progressive delivery techniques: canaries, percentage rollouts, automated rollbacks




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
