<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

### Improving Release Reliability with Argo Rollouts across 10k Customer Services

<a href="http://adobe.com"><img width="300" data-src="../assets/Adobe_Corporate_Horizontal_Lockup_Red_RGB.svg" alt="Adobe logo" style="background:white"></a>

Carlos Sanchez /
[csanchez.org](http://csanchez.org) / 
[@csanchez](http://twitter.com/csanchez)

<small>Principal Scientist / [Adobe Experience Manager Cloud Service](https://www.adobe.com/marketing/experience-manager/cloud-service.html)</small>


---


## Adobe Experience Manager

Content Management System

Used by many Fortune 100 companies

An existing distributed Java OSGi application

Using OSS components from The ASF

Customers can add their own code

----

## AEM on Kubernetes

Running on Azure

35+ clusters and growing

Multiple regions: US, Europe, Australia, Singapore, Japan, India, more coming


----


## AEM Environments

* Customers can have multiple AEM environments that they can self-serve
* Each customer: 3+ Kubernetes namespaces (dev, stage, prod environments)
* Each environment is a micro-monolith ™

----

## Scale

17k+ environments

100k+ `Deployments`

6k+ namespaces

Already doing progressive rollouts at the environment level

----

## Challenges

How to avoid issues in production

deploying Adobe code / customer code 

For 17k+ unique services 

----

## Challenges

Full end to end testing is expensive

Does not cover all cases and does not scale

If a few environments fail it requires analysis

* is it an AEM release issue?
* is it a customer code issue?
* is it a temporary issue?

----

## Challenges

It is time consuming

Releases can get delayed

Issues can impact 100% of one environment traffic

---

## Solution: Argo Rollouts

Canary deployments with automatic rollback

Based on real world traffic and error metrics

Using existing metrics from Prometheus


---

## The Good

Automatic roll back on high error rates

Non blocking rollouts across environments and async investigation

Only a percentage of traffic is affected temporarily

----

## The Good

More frequent releases

Validate with real traffic

More velocity

----

## The Bad

Migration requires orchestration to avoid downtime

Even using `workloadRef`

A problem with 1000s of services

----

## The Ugly

Need good metrics

Metrics need to account for `canary`/`stable` labels

What happens with environments with low traffic?

`Rollout` requires changing runbooks, tooling and training

---


Progressive Delivery is a great idea

Argo Rollouts is a great implementation

Some things to iron out and prepare for


<p>&nbsp;</p>


<small>[csanchez.org](http://csanchez.org) 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[@csanchez](http://twitter.com/csanchez)</small>

