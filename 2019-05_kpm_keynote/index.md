<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

<img width="150" data-src="../assets/kubernetes-logo.png" alt="Kubernetes logo" style="background:white">

### The Rise of Kubernetes

Carlos Sanchez

[csanchez.org](http://csanchez.org) / 
[@csanchez](http://twitter.com/csanchez)

<a href="http://cloudbees.com"><img width="250" data-src="../assets/cloudbees-logo_4.png" alt="CloudBees logo" style="background:white"></a>

<!-- <small>[Watch online at carlossg.github.io/presentations](https://carlossg.github.io/presentations)</small> -->

---




Principal Software Engineer @ CloudBees

Author of Jenkins Kubernetes plugin

Long time OSS contributor at Apache Maven, Eclipse, Puppet,…

<!-- <img width="300" data-src="../assets/gde.png" alt="GDE logo"> -->

---




# Micro Services

> the microservice architectural style is an approach to developing a single application as a suite of **small services**,
each running in its own process and **communicating with lightweight mechanisms**, often an HTTP resource API.

----

> These services are built around **business capabilities** and **independently deployable** by fully automated deployment machinery.

<small>James Lewis and Martin Fowler</small>

----

* One application, multiple small services
* Separate processes with lightweight comunications, typically HTTP
* Deployed independently
* Minimal centralized management
* Fully automated deployment

----

### Monolith vs Micro-Services

![](../assets/sketch.png)

----

#### Componentization via Services

vs libraries

----

#### Organized around Business Capabilities

cross functional teams

#### Products not Projects

business oriented

ongoing maintenance

----

<!-- #### Smart endpoints and dumb pipes

vs ESB

decoupled and cohesive

----
-->

#### Decentralized Governance

different lenguages

Amazon: you build it you run it

----

#### Decentralized Data Management

each service manages its own database

----

#### Infrastructure Automation

Continuous Delivery

----

#### Evolutionary Design

modular design and replaceability

----

#### Design for failure

resiliency and self-healing

----

<!-- <small>[https://martinfowler.com/articles/microservices.html](https://martinfowler.com/articles/microservices.html)</small> -->


<img width="500" data-src="../assets/youmustbethistall.png">

* Rapid provisioning
* Basic monitoring
* Rapid application deployment - DevOps Culture

<small>[https://martinfowler.com/bliki/MicroservicePrerequisites.html](https://martinfowler.com/bliki/MicroservicePrerequisites.html)</small>

----

## Organizational Structure


> Any organization that designs a system will inevitably produce a design whose structure is a copy of the organization's communication structure.

<small>Conway's Law</small>

---




![](../assets/kubernetes-logo-text.png)

----


## Cluster Orchestration

Allow running services in cluster

Abstract underlying infrastructure

High availability

Handle persistence for you

Network isolation and SDNs

----

Declarative configuration

Active reconciliation

Optimized for GitOps

----

## Pets vs Cattle

----

> How would you design your infrastructure if you couldn't login? Ever.

<small>Kelsey Hightower</small>


<!--
## Pets vs Cattle vs Chicken

![](Chicken_cartoon_04.svg)

<small>[http://www.cloudcomputingexpo.com/node/3293710](http://www.cloudcomputingexpo.com/node/3293710)</small>
-->

----

## But it is not trivial

![](../assets/bad-containers.jpeg)

<!--
![](../assets/microservices-shit.jpg)
-->

----

<img height="400" data-src="../assets/certified_kubernetes_color.png">

----

## Managed Kubernetes

* Google Cloud GKE
* AWS EKS
* Azure AKS
* Alibaba Cloud Container Service
* IBM Cloud Container Service
* Oracle Cloud Container Service

----

## Hybrid Kubernetes

![](../assets/anthos-logo.png)

----

![](../assets/anthos_diagram_2x.png)

----

## (Auto)Scaling and Scale to Zero

New and interesting problems

----

* Infinite capacity
* Resource limits
* Rate limits

----

## Serverless Kubernetes

<img height="150" data-src="../assets/Microsoft_Azure_Logo.svg">

<img height="150" data-src="../assets/alibaba-cloud-logo.png">

----

## Kubernetes is the API

---






## Continuous Delivery

The first 90%

* Develop
* Build
* Test
* Deploy

----

## Continuous Delivery

The other 90%

* Monitor
* React to problems
* Prevent problems


----

### Automation
### Automation
### Automation

----

<img height="100%" width="100%" data-src="../assets/devops_borat.png">

----

> If you haven't automatically destroyed something by mistake, you are not automating enough

---




## Progressive Delivery

----

* Rolling updates
* Blue-Green deployment
* Canary deployment

----

[![](../assets/blue_green_deployments.png)](https://blog.snap-ci.com/blog/2015/06/22/continuous-deployment-strategies/)

----

[![](../assets/canary_deployments.png)]](https://blog.snap-ci.com/blog/2015/06/22/continuous-deployment-strategies/)

----

> [Progressive Delivery](https://redmonk.com/jgovernor/2018/08/06/towards-progressive-delivery/) makes it easier to adopt Continuous Delivery. New versions are deployed to a subset of users and are evaluated in terms of correctness and performance before rolling them to the totality of the users and rolled back if not matching some key metrics.

----

Continuous Delivery is hard

Progressive Delivery makes Continuous Delivery easier to adopt

----

Monitoring is the new testing

----

Use data from monitoring

Take proactive actions, ie. scaling

---




# Resilient & Self Healing Systems

----

Services need to auto adapt to changes and errors

In case of unexpected errors, try to adapt and restore to working condition

----

Never expect an order of deployment

Will your app crash if database is not yet up and running?

----

In case your database is down, what would you do?

1. send an alert and fail fast
2. keep trying

----

Services need to retry calls

----

In complex systems there is no single cause of failure

----

## Embrace failure!

![](../assets/disaster-girl.jpg)

----

## The Principles of Chaos Engineering

[principlesofchaos.org](http://principlesofchaos.org/)

* Build a Hypothesis around Steady State Behavior
* Vary Real-world Events
* Run Experiments in Production
* Automate Experiments to Run Continuously

----

![](../assets/chaosmonkey.jpeg)

---






<div class="container">

<div class="col">

    <p>[csanchez.org](http://csanchez.org)</p>

    <p><img height="64px" style="vertical-align:middle" data-src="../assets/twitter-logo.png">[csanchez](http://twitter.com/csanchez)</p>

    <p><img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg](https://github.com/carlossg)</p>
</div>

<!-- <div class="col">
    <img width="80%" data-src="../assets/magritte.png">
</div> -->

<div class="col">
    <img width="80%" data-src="../assets/blog-qr-code.png">
</div>
</div>

[<img width="400" data-src="../assets/cloudbees-logo_4.png" alt="CloudBees logo">](http://cloudbees.com)
