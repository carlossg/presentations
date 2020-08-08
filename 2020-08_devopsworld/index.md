<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

<!-- <a href="http://jenkins-x.io"><img width="300" data-src="../assets/jenkinsx-stacked-color.png" alt="Jenkins X logo" style="background:white"> </a> -->

## GitOps at Adobe

Carlos Sanchez /
[csanchez.org](http://csanchez.org) / 
[@csanchez](http://twitter.com/csanchez)

<a href="http://adobe.com"><img width="250" data-src="../assets/adobe-logo.svg" alt="Adobe logo" style="background:white"></a>

<!-- <small>[Watch online at carlossg.github.io/presentations](https://carlossg.github.io/presentations)</small> -->

---


Cloud Engineer

@ [Adobe Experience Manager Cloud Service](https://www.adobe.com/marketing/experience-manager/cloud-service.html)

Author of Jenkins Kubernetes plugin

Long time OSS contributor at Apache Maven, Eclipse, Puppet,…

<!-- <img width="300" data-src="../assets/gde.png" alt="GDE logo"> -->

---



# Why GitOps?

<img width="600" data-src="../assets/automate-all-the-things.png">

----

# Kubernetes

<img data-src="../assets/kubernetes-everywhere-meme.jpg">

----

Many clusters

Many regions

Many related services and infrastructure

----

## Benefits

----

### Full view across all sytems

For developers, SREs, on-call,...

----

### Declarative Configuration

<img height="400px" data-src="../assets/yaml.jpg">

----

Using standard YAML

ie. Kubernetes, Kustomize, Helm

and

custom defined

----

### Reconciliation

We keep the desired state in git 

and it is automatically reconciled against what is running

----

### Traceability

Using git logs

----

### Pull Requests

PRs can be deployed to different environments too

----

### Continuous Delivery

Changes in git trigger Jenkins pipelines that test and deploy the definitions

![](../assets/jenkins-logo.png)


---



# What For?

----

## Applications

Changes in git are automatically deployed across clusters and namespaces

pull vs push when possible

----

## Infrastructure

Can use 

* Terraform
* AWS CloudFormation
* Azure ARM
* Google Cloud Deployment Manager

Then react on git changes deploying and updating the infrastructure

----

### Is this the Real GitOps

or just Infrastructure As Code?

<img width="400" data-src="../assets/is-this-the-real-life.jpg">

----

## DNS

DNS configuration is stored in git

Using Jenkins and templates we continuously reconcile changes with the DNS API

----

## CDN

CDN configuration is also stored in git

Same Jenkins and templating mechanism to deploy and update CDN configuration

----

## And More!

Grafana

Prometheus

...

---




# Is it just for Humans?

----

## No!

Integrate changes coming from 

* UI
* APIs
* Humans (devs, SREs, on-call,...)

to keep a consistent always up to date view

----

## Decoupling systems and git

Providing services with APIs or using queues

that transform actions into git commits

Yes, you can [trigger Jenkins pipelines from message queues](https://github.com/jenkinsci/jms-messaging-plugin/)

----

## GitOps so far...

![](../assets/nice.gif)

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

<a href="http://adobe.com"><img width="400" data-src="../assets/adobe-logo.svg" alt="Adobe logo" style="background:white"></a>

</div>
</div>

