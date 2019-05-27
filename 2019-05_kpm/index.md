<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

<a href="http://jenkins-x.io"><img width="150" data-src="../assets/jenkins-x.png" alt="Jenkins X logo" style="background:white"> </a>

### Jenkins X: Continuous Delivery for Kubernetes

Carlos Sanchez

[csanchez.org](http://csanchez.org) / 
[@csanchez](http://twitter.com/csanchez)

<a href="http://cloudbees.com"><img width="250" data-src="../assets/cloudbees-logo_4.png" alt="CloudBees logo" style="background:white"></a>

<!-- <small>[Watch online at carlossg.github.io/presentations](https://carlossg.github.io/presentations)</small> -->

---



# About me

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

## Buildpacks

[jenkins-x-buildpacks/jenkins-x-kubernetes](https://github.com/jenkins-x-buildpacks/jenkins-x-kubernetes/tree/master/packs)

[jenkins-x-buildpacks/jenkins-x-classic](https://github.com/jenkins-x-buildpacks/jenkins-x-classic/tree/master/packs)

----

### `jenkins-x.yml`

```yaml
buildPack: maven-java11
```

----

<!-- `jenkins-x-kubernetes/packs/maven-java11/pipeline.yaml`

```yaml
extends:
  file: ../maven/pipeline.yaml
agent:
  label: jenkins-maven-java11
  container: maven
```



`jenkins-x-kubernetes/packs/maven/pipeline.yaml`

```yaml
extends:
  import: classic
  file: maven/pipeline.yaml
  ...
``` 
-->


`jenkins-x-classic/packs/maven/pipeline.yaml`

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
      ...
      - sh: mvn install
        name: mvn-install
```

----

```yaml
  release:
    ...
    build:
      steps:
      - sh: mvn clean deploy
        name: mvn-deploy
```

----

Both worlds can coexist!

* Static Jenkins masters
* Serverless Jenkins X pipelines in containers

---



# Progressive Delivery

----

> [Progressive Delivery](https://redmonk.com/jgovernor/2018/08/06/towards-progressive-delivery/) makes it easier to adopt Continuous Delivery. New versions are deployed to a subset of users and are evaluated in terms of correctness and performance before rolling them to the totality of the users and rolled back if not matching some key metrics.

----

Continuous Delivery is hard

Progressive Delivery makes Continuous Delivery easier to adopt



---

# Progressive Delivery with Jenkins X

----

Install Istio, Prometheus and [Flagger](https://docs.flagger.app)

```shell
jx create addon istio
jx create addon prometheus
jx create addon flagger
```

----


<img data-src="../assets/istio.png">

----

## Flagger

[flagger.app](https://flagger.app)

> automates the promotion of canary deployments by using Istio’s traffic shifting and Prometheus metrics to analyse the application’s behaviour during a controlled rollout

----

<!-- 
Get the ip of the Istio ingress and point your wildcard domain to it

```shell
kubectl -n istio-system get service istio-ingressgateway \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```



Add the [canary object](../charts/croc-hunter-jenkinsx/templates/canary.yaml) that will add our deployment to Flagger

```yaml
{{- if eq .Release.Namespace "jx-production" }}
{{- if .Values.canary.enable }}
apiVersion: flagger.app/v1alpha2
kind: Canary
metadata:
  name: {{ template "fullname" . }}
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ template "fullname" . }}
  progressDeadlineSeconds: 60
  service:
    port: {{.Values.service.internalPort}}
{{- if .Values.canary.service.gateways }}
    gateways:
{{ toYaml .Values.canary.service.gateways | indent 4 }}
{{- end }}
```



```yaml
{{- if .Values.canary.service.hosts }}
    hosts:
{{ toYaml .Values.canary.service.hosts | indent 4 }}
{{- end }}
  canaryAnalysis:
    interval: {{ .Values.canary.canaryAnalysis.interval }}
    threshold: {{ .Values.canary.canaryAnalysis.threshold }}
    maxWeight: {{ .Values.canary.canaryAnalysis.maxWeight }}
    stepWeight: {{ .Values.canary.canaryAnalysis.stepWeight }}
{{- if .Values.canary.canaryAnalysis.metrics }}
    metrics:
{{ toYaml .Values.canary.canaryAnalysis.metrics | indent 4 }}
{{- end }}
{{- end }}
{{- end }}
```

-->



`values.yaml` `canary` section

```yaml
...
canary:
  enable: true
  service:
    hosts:
    - croc-hunter.istio.us.g.csanchez.org
    gateways:
    - jx-gateway.istio-system.svc.cluster.local
  canaryAnalysis:
    interval: 60s
    threshold: 5
    maxWeight: 50
    stepWeight: 10
```

----

```yaml
    metrics:
    - name: istio_requests_total
      # minimum req success rate (non 5xx responses)
      # percentage (0-100)
      threshold: 99
      interval: 60s
    - name: istio_request_duration_seconds_bucket
      # maximum req duration P99
      # milliseconds
      threshold: 500
      interval: 60s
```

----

## Profit!

```shell
jx promote croc-hunter-jenkinsx \
  --version 0.0.130 \
  --env production
```

----

<img data-src="../assets/flagger-canary-overview.png">

----

<img data-src="../assets/flagger-canary-steps.png">

----

<img data-src="../assets/grafana-canary-analysis.png">

----

<img data-src="../assets/flagger-slack-canary-notifications.png">
<img data-src="../assets/flagger-slack-canary-failed.png">

---



<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg/croc-hunter-jenkinsx](https://github.com/carlossg/croc-hunter-jenkinsx)

<img width="45%" data-src="../assets/croc-hunter-jenkinsx-qr-code.png">

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
