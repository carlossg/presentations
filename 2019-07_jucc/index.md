<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

<a href="http://jenkins-x.io"><img width="150" data-src="../assets/jenkins-x.png" alt="Jenkins X logo" style="background:white"> </a>

## Jenkins X
### Next Generation Cloud Native CI/CD

Carlos Sanchez /
[csanchez.org](http://csanchez.org) / 
[@csanchez](http://twitter.com/csanchez)

<a href="http://cloudbees.com"><img width="250" data-src="../assets/cloudbees-logo_4.png" alt="CloudBees logo" style="background:white"></a>

<!-- <small>[Watch online at carlossg.github.io/presentations](https://carlossg.github.io/presentations)</small> -->

---



# 你好

Principal Software Engineer @ CloudBees

Author of Jenkins Kubernetes plugin

Long time OSS contributor at Apache Maven, Eclipse, Puppet,…

<!-- <img width="300" data-src="../assets/gde.png" alt="GDE logo"> -->

---




# Jenkins X

----

<img data-src="../assets/kubernetes-logo-text.png">

----

<img data-src="../assets/jenkins-x-components-tekton.png">

----

<img data-src="../assets/helm.png">

Package manager for Kubernetes

----

<img width="450" data-src="../assets/skaffold.png">

Build Docker images with multiple backends: 

* Docker build
* Kaniko
* Google Cloud Build
* Jib (Maven/Gradle)

----

<img width="450" data-src="../assets/draft-logo.png">

Generates Dockerfile and Helm charts for your project

---




# Serverless Jenkins X

* Cloud Native, containers everywhere
* YAML pipelines
* Kubernetes Custom Resources

----

<img data-src="../assets/tekton-horizontal-color.png">

Pipeline engine in Kubernetes

Uses Pods and containers to run the pipeline steps

----

<img data-src="../assets/prow_logo.png">

Implements ChatOps

Handles GitHub webhooks

----

<img data-src="../assets/ArchitectureServerlessJenkins.png" height="600px">

---






## Buildpacks

[jenkins-x.io/architecture/build-packs](https://jenkins-x.io/architecture/build-packs/)

Project templates for multiple languages and stacks

Maven, Spring Boot, NodeJS, Golang,...

----

## Buildpacks

[jenkins-x-buildpacks/jenkins-x-classic](https://github.com/jenkins-x-buildpacks/jenkins-x-classic/tree/master/packs)

For Kubernetes applications:

[jenkins-x-buildpacks/jenkins-x-kubernetes](https://github.com/jenkins-x-buildpacks/jenkins-x-kubernetes/tree/master/packs)

----

## Buildpacks

* define containers to run the builds
* list steps in the pipelines
* allow different pipelines for pull requests and releases
* are extensible and steps can be overriden

----

### `jenkins-x.yml`

Main file that defines the build pack for my project

Can override configuration from the buildpack

```yaml
buildPack: maven-java11
```

----

`jenkins-x-kubernetes/packs/maven-java11/pipeline.yaml`

`maven-java11` buildpack extends the `maven` buildpack and changes the container that runs the builds

```yaml
extends:
  file: ../maven/pipeline.yaml
agent:
  label: jenkins-maven-java11
  container: maven
```

----

`jenkins-x-kubernetes/packs/maven/pipeline.yaml`

`maven` Kubernetes buildpack extends the classic `maven` buildpack

```yaml
extends:
  import: classic
  file: maven/pipeline.yaml
  ...
```

----

`jenkins-x-classic/packs/maven/pipeline.yaml`

`maven` classic buildpack defines the pipeline steps for pull requests

```yaml
extends:
  file: ../pipeline.yaml
agent:
  label: jenkins-maven
  container: maven
pipelines:
  pullRequest:
    build:
      steps:
      - sh: mvn versions:set -DnewVersion=$PREVIEW_VERSION
        name: set-version
      - sh: mvn install
        name: mvn-install
```

----

and for releases

```yaml
  release:
    setVersion:
      steps:
      - sh: echo \$(jx-release-version) > VERSION
        name: next-version
        comment: so we can retrieve the version in later steps
      - sh: mvn versions:set -DnewVersion=\$(cat VERSION)
        name: set-version
      - sh: jx step tag --version \$(cat VERSION)
        name: tag-version
    build:
      steps:
      - sh: mvn clean deploy
        name: mvn-deploy
```


----

### Customizing the Pipelines

To add a new step into a pipeline lifecycle you can use `jx create step`

<img data-src="../assets/create-step.gif">

----

You can also add or override an environment variable in your pipeline with `jx create variable` 

Or edit the yaml directly in VS Code and IDEA with smart completion and validation

----

Both worlds can coexist!

* Static Jenkins masters
* Serverless Jenkins X pipelines in containers

---




<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg/croc-hunter-jenkinsx](https://github.com/carlossg/croc-hunter-jenkinsx)

<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg/croc-hunter-java](https://github.com/carlossg/croc-hunter-java)

<img width="35%" data-src="../assets/croc-hunter-jenkinsx-qr-code.png">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img width="35%" data-src="../assets/croc-hunter-java-qr-code.png">

----

<img data-src="../assets/quarkus_logo_horizontal_rgb.png">

[quarkus.io](https://quarkus.io/)

A Kubernetes Native Java stack tailored for GraalVM & OpenJDK HotSpot, crafted from the best of breed Java libraries and standards

---



<div class="container">

<div class="col">

<h1>谢谢</h1>

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
