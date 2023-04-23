<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

## We Moved one Java Product to Kubernetes and This Is What We Learned

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

35+ clusters and growing

Multiple regions: US, Europe, Australia, Singapore, Japan, India, more coming

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
<!-- * Sandboxes, evaluation-like environments

Customers interact through Cloud Manager, a separate service with web UI and API -->

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



# Sidecars

<img width="400" data-src="https://media.giphy.com/media/dXjLrEDc5XVisjgPu2/giphy.gif">


----

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

Each customer environment (17k+) is a micro-monolith ™

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

----

# ARM architecture

15-25% cost savings for the same performance

Easy switch for containerized Java

---




# Java and Kubernetes

----

## Quizz

Assume:

* Java 11+ and latest releases
* 4GB memory available
* 2+ CPUs available

----

<iframe src="https://wall.sli.do/event/jhm2sw73pV2PqtUDvNALAU?section=418b376d-3406-4520-bf7d-63e0a1605486" width="100%" height="600"></iframe>

----

### What is the default JVM heap size?

1. 75% of container memory
2. 75% of host memory
3. 25% of container memory
4. 25% of host memory
5. 127MB


----

It depends

----

### What is the default JVM heap size?

1. **75% of container memory** (< 256 MB)
2. 75% of host memory
3. **25% of container memory** (> 512 MB)
4. 25% of host memory
5. **127MB** (256 MB to 512 MB)

----

JDKs >8u191 and >11 will detect the available memory in the container, not the host

Using the container memory limits, so there is no guarantee that physical memory is available

----

Do not trust JVM ergonomics

Configure memory with

* `-XX:InitialRAMPercentage`
* `-XX:MaxRAMPercentage`
* ~~`-XX:MinRAMPercentage`~~ (allows setting the maximum heap size for a JVM running with less than 200MB)

----

Typically can use up to 75% of container memory

Unless there is a lot of off-heap memory used (ElasticSearch, Spark,...)

JVM takes all the memory on startup and manages it

JVM memory use is hidden from Kubernetes, which sees all of it as used

Set request and limits to the same value

----

<iframe src="https://wall.sli.do/event/jhm2sw73pV2PqtUDvNALAU?section=418b376d-3406-4520-bf7d-63e0a1605486" width="100%" height="600"></iframe>

----

### What is the default JVM Garbage Collector?

1. SerialGC
2. ParallelGC
3. G1GC
4. ZGC
5. ShenandoahGC

----

It depends

----

### What is the default JVM Garbage Collector?

1. **SerialGC**   *<2 processors & < 1792MB available*
2. **ParallelGC** *Java 8*
3. **G1GC**       *Java >=11*
4. ZGC
5. ShenandoahGC


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

<iframe src="https://wall.sli.do/event/jhm2sw73pV2PqtUDvNALAU?section=418b376d-3406-4520-bf7d-63e0a1605486" width="100%" height="600"></iframe>

----

### How many CPUs does the JVM think are available?

1. Same as the host
2. Same as the k8s container cpu requests
3. Same as the k8s container cpu limits

----

It depends

----

### How many CPUs does the JVM think are available?

1. **Same as the host** Java 19+ / 17.0.5+ / 11.0.17+ / 8u351+
2. Same as the k8s container cpu requests
3. **Same as the k8s container cpu limits** (otherwise, sort of)

----

Before Java 19/17.0.5/11.0.17/8u351

* 0 ... 1023 = 1 CPU
* 1024 = (no limit)
* 2048 = 2 CPUs
* 4096 = 4 CPUs

----

[JDK-8281181 Do not use CPU Shares to compute active processor count](https://bugs.openjdk.org/browse/JDK-8281181)

> the JDK interprets cpu.shares as an absolute number that limits how many CPUs the current process can use

Kubernetes sets `cpu.shares` from the CPU requests


----

Do not trust JVM ergonomics

Configure cpus with

* `-XX:ActiveProcessorCount`

----

<iframe src="https://wall.sli.do/event/jhm2sw73pV2PqtUDvNALAU?section=418b376d-3406-4520-bf7d-63e0a1605486" width="100%" height="600"></iframe>

----

### In a host with 32 CPUs, and 2 JVMs with each 8 CPU requests/16 CPU limit, how much CPU can each use if both are as busy as possible?

1. 100%
2. 75%
3. 50%
4. 25%

----

### In a host with 32 CPUs, and 2 JVMs with each 8 CPU requests/16 CPU limit, how much CPU can each use if both are as busy as possible?

1. 100%
2. 75%
3. **50%**
4. 25%

----

<iframe src="https://wall.sli.do/event/jhm2sw73pV2PqtUDvNALAU?section=418b376d-3406-4520-bf7d-63e0a1605486" width="100%" height="600"></iframe>

----

### In a host with 32 CPUs, and 2 JVMs with each 8 CPU requests and no limits, how much CPU can one use if the other one is not using CPU?

1. 100%
2. 75%
3. 50%
4. 25%

----

### In a host with 32 CPUs, and 2 JVMs with each 8 CPU requests and no limits, how much CPU can one use if the other one is not using CPU?

1. **100%**
2. 75%
3. 50%
4. 25%

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

```
+----------+   +-----------------------------+   +-----------
|  Core 1  |   | Thread 1                    |   |  Thread 1
+----------+   +-----------------------------+   +-----------
+----------+   
|  Core 2  |   
+----------+   
+----------+   
|  Core 3  |   
+----------+   
+----------+   
|  Core 4  |   
+----------+   
               <----------------------------->   <-----------
                        Period 100 ms
```

----

```
+----------+   +-----------------------------+   +-----------
|  Core 1  |   | Thread 1 ~~~~~~~~~~~~~~~~~~~|   |  Thread 1
+----------+   +-----------------------------+   +-----------
+----------+   +-----------------------------+   +-----------
|  Core 2  |   | Thread 2 ~~~~~~~~~~~~~~~~~~~|   |  Thread 2
+----------+   +-----------------------------+   +-----------
+----------+   +-----------------------------+   +-----------
|  Core 3  |   | Thread 3 ~~~~~~~~~~~~~~~~~~~|   |  Thread 3
+----------+   +-----------------------------+   +-----------
+----------+   +-----------------------------+   +-----------
|  Core 4  |   | Thread 4 ~~~~~~~~~~~~~~~~~~~|   |  Thread 4
+----------+   +-----------------------------+   +-----------
               <----------------------------->   <-----------
                        Period 100 ms
                          <------------------>
                               Throttling
```

----

<!-- ### Secrets of Performance Tuning Java on Kubernetes

by @brunoborges

https://2022.javazone.no/#/program/77f4b4f6-094a-44ba-a23f-0fd505e8d9d6
 -->

<!-- 

# Scaling

* ⚠️ API rate limits can be hit on upgrades, so we limit each cluster in the hundreds of nodes

* You could have bigger nodes too

Using Kubernetes Vertical and Horizontal Pod Autoscaler -->


<iframe src="https://wall.sli.do/event/jhm2sw73pV2PqtUDvNALAU?section=418b376d-3406-4520-bf7d-63e0a1605486" width="100%" height="600"></iframe>


---





Easy to start in k8s, then optimize

Use patterns to decompose application: sidecars, init containers, new services,...

Resource optimization: tuning JVM CPU, memory, GC


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