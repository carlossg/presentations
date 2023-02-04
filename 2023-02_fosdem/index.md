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

Security concerns: ie. traffic leaving the clusters must be encrypted

----

## AEM Environments

* Customers can have multiple AEM environments that they can self-serve
<!-- * Customers run their dev/stage/production -->
* Each customer: 3+ Kubernetes namespaces (dev, stage, prod environments)
* Each environment is a micro-monolith ™
<!-- * Sandboxes, evaluation-like environments -->

<!-- Customers interact through Cloud Manager, a separate service with web UI and API -->

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

Kubernetes definitions stored in git

Deployed to blobstores across regions

----

## Gitinit

A deployment that runs continuously in each namespace (~10k)

Pulls the blob and applies the changes

Pushing instead of pulling would take ~5h running in parallel

----

## ArgoCD

New CaaS platform based on ArgoCD

Balance between:

* central definitions and enforcements
* microservices: you build it you run it

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

<img width="550" data-src="https://media.giphy.com/media/6UFgdU9hirj1pAOJyN/giphy.gif">

----

## Progressive Delivery

Rollout to different customer groups in separate waves

Rollout to a percentage of customers

----

## Progressive Delivery

Automated time based rollout

dev -> stage -> prod-candidate

Running in Jenkins

Ensures changes soak in dev/stage before going to prod

----

## Progressive Delivery

* feature flags at the namespace level (~10k namespaces)
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

Automated progressive rollout and rollback for each deployment

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



### Continuous and Progressive Delivery

Shift left and guardrails increases development speed and reduces issues

Progressive delivery techniques: canaries, percentage rollouts, automated rollbacks

Automation to do controlled and progressive rollouts pays off



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


