#### Using Containers for
### Continuous Integration and
### Continuous Delivery

<span style="font-size:0.8em">
[Carlos Sanchez](http://csanchez.org)

[csanchez.org](http://csanchez.org) / [@csanchez](http://twitter.com/csanchez)
</span>

<a href="http://cloudbees.com"><img width="350" data-src="../assets/cloudbees-logo_4.png" alt="CloudBees logo" style="background:white;"></a>

<small>[Watch online at carlossg.github.io/presentations](https://carlossg.github.io/presentations)</small>

---





### About me

Engineer, Scaling Jenkins

<img width="300" data-src="../assets/cloudbees-logo_4.png" style="vertical-align:middle" alt="CloudBees logo">

Author of Jenkins Kubernetes plugin

Contributor to Jenkins, Maven official Docker images

OSS contributor at Apache Maven, Eclipse, Puppet,…

<img width="200" data-src="../assets/gde.png" alt="GDE logo">

---




# Our use case

![](../assets/jenkins-logo.png)

Scaling Jenkins

<small>Your mileage may vary</small>

----

<img width="200%" data-src="../assets/lstoll.png">

----

Isolated Jenkins masters

Isolated agents and jobs

Memory and CPU limits

<!--

![](../assets/dockerhub-jenkins.png)

![](../assets/dockerhub-jenkins-slave.png)
-->

----

## But it is not trivial

![](../assets/bad-containers.jpeg)

<!--
![](../assets/microservices-shit.jpg)
-->

<!--

> How would you design your infrastructure if you couldn't login? Ever.

> Kelsey Hightower


## Cluster Scheduling

* Running in public cloud, private cloud, VMs or bare metal
* HA and fault tolerant
* With Docker support of course

<!--
<img width="50%" data-src="../assets/run-crash.gif">


## Embrace failure!

![](../assets/disaster-girl.jpg)
-->

---



# Scaling Jenkins

Two options:

* More agents per master
* More masters

----

### Scaling Jenkins: More Agents

* Pros

 * Multiple plugins to add more agents, even dynamically

* Cons

 * The master is still a SPOF
 * Handling multiple configurations, plugin versions,...
 * There is a limit on how many agents can be attached

----

### Scaling Jenkins: More Masters

* Pros

 * Different sub-organizations can self service and operate independently

* Cons

 * Single Sign-On
 * Centralized configuration and operation

----

### [CloudBees Jenkins Enterprise](https://www.cloudbees.com/products/cloudbees-jenkins-enterprise)

The best of both worlds

CloudBees Jenkins Operations Center with multiple masters

Dynamic agent creation in each master

<!--

### [CloudBees Jenkins Enterprise](https://www.cloudbees.com/products/cloudbees-jenkins-enterprise)

![](../assets/CJE-graphic-revised-hi-res.png)

-->

----

### First implementation

<img width="40%" data-src="../assets/mesos-logo.png">

* Apache Mesos
* Mesosphere Marathon
* Terraform
* Packer

---





# ![](../assets/jenkins-logo.png) & ![](../assets/kubernetes-logo.png)

----

We can run both Jenkins **masters and agents** in Kubernetes

----

# Storage

Handling distributed storage

Masters can move when they are restarted

Jenkins masters need persistent storage, agents (_typically_) don't

Using `PersistentVolumeClaim` so you can provide any implementation

----

## Caveats

* Performance

> "Worst-case scenario for just about any commonly used network-based storage"

* Lack of multi-AZ for block storage, ie. EBS AWS

----

# Networking

Jenkins masters open several ports

* HTTP
* JNLP agent

----

## Networking: HTTP

We use ingress rules and `nginx` ingress controller

* Operations Center
* Jenkins masters

Path based routing `cje.example.com/master1`

----

## Networking: JNLP

* Agents started dynamically in cluster can connect to masters internally
* Agents manually started outside cluster connect directly
 * Using `NodePort`

---




## Agents with Infinite* Scale!

[Jenkins Kubernetes Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Kubernetes+Plugin)

* Dynamic Jenkins agents, running as Pods
* Multi-container support
  * One Jenkins agent image, others custom
* Jenkins Pipeline support for both agent Pod definition and execution
* Persistent workspace
* Auto configured

----

## On Demand Jenkins Agents

```groovy
podTemplate(label: 'mypod') {
  node('mypod') {
    sh 'Hello world!'
  }
}
```

----

## Grouping Containers (Pods)

```groovy
podTemplate(label: 'maven', containers: [
  containerTemplate(name: 'maven', image: 'maven:3.3.9-jdk-8-alpine',
    ttyEnabled: true, command: 'cat') ]) {

  node('maven') {
    stage('Get a Maven project') {
      git 'https://github.com/jenkinsci/kubernetes-plugin.git'
      container('maven') {
        stage('Build a Maven project') {
          sh 'mvn -B clean package'
        }
      }
    }
  }
}
```

----

## Using Declarative Pipeline

```groovy
pipeline {
  agent {
    kubernetes {
      label 'mypod'
      containerTemplate {
        name 'maven'
        image 'maven:3.3.9-jdk-8-alpine'
        ttyEnabled true
        command 'cat'
      }}}
  stages {
    stage('Run maven') {
      steps {
        container('maven') {
          sh 'mvn -version'
        }
      }}}
}
```

----

### Multi-language Pipeline

```groovy
podTemplate(label: 'maven-golang', containers: [
  containerTemplate(name: 'maven', image: 'maven:3.3.9-jdk-8-alpine',
    ttyEnabled: true, command: 'cat'),
  containerTemplate(name: 'golang', image: 'golang:1.8.0',
    ttyEnabled: true, command: 'cat')]) {

  node('maven-golang') {
    stage('Build a Maven project') {
      git 'https://github.com/jenkinsci/kubernetes-plugin.git'
      container('maven') {
        sh 'mvn -B clean package' }}

    stage('Build a Golang project') {
      git url: 'https://github.com/hashicorp/terraform.git'
      container('golang') {
        sh """
        mkdir -p /go/src/github.com/hashicorp
        ln -s `pwd` /go/src/github.com/hashicorp/terraform
        cd /go/src/github.com/hashicorp/terraform && make core-dev
        """
      }}}}
```

----

## Pods: Selenium

Example:

* Jenkins agent
* Maven build
* Selenium Hub with
  * Firefox
  * Chrome

5 containers

----

```groovy
podTemplate(label: 'maven-selenium', containers: [

  containerTemplate(name:'maven-firefox',
    image:'maven:3.3.9-jdk-8-alpine',
    ttyEnabled: true, command: 'cat'),

  containerTemplate(name:'maven-chrome',
    image:'maven:3.3.9-jdk-8-alpine',
    ttyEnabled: true, command: 'cat'),

  containerTemplate(name: 'selenium-hub',
    image: 'selenium/hub:3.4.0'),
```

----

```groovy
  // because containers run in the same network space, we need to
  // make sure there are no port conflicts
  // we also need to adapt the selenium images because they were
  // designed to work with the --link option

  containerTemplate(name: 'selenium-chrome',
    image: 'selenium/node-chrome:3.4.0', envVars: [
    containerEnvVar(key: 'HUB_PORT_4444_TCP_ADDR', value: 'localhost'),
    containerEnvVar(key: 'HUB_PORT_4444_TCP_PORT', value: '4444'),
    containerEnvVar(key: 'DISPLAY', value: ':99.0'),
    containerEnvVar(key: 'SE_OPTS', value: '-port 5556'),
  ]),
```

----

```groovy
  containerTemplate(name: 'selenium-firefox',
    image: 'selenium/node-firefox:3.4.0', envVars: [
    containerEnvVar(key: 'HUB_PORT_4444_TCP_ADDR', value: 'localhost'),
    containerEnvVar(key: 'HUB_PORT_4444_TCP_PORT', value: '4444'),
    containerEnvVar(key: 'DISPLAY', value: ':98.0'),
    containerEnvVar(key: 'SE_OPTS', value: '-port 5557'),
  ])
```

----

```groovy
  node('maven-selenium') {
    stage('Checkout') {
      git 'https://github.com/carlossg/selenium-example.git'
      parallel (
```

----

```groovy
        firefox: {
          container('maven-firefox') {
            stage('Test firefox') {
              sh """
              mvn -B clean test -Dselenium.browser=firefox \
                -Dsurefire.rerunFailingTestsCount=5 -Dsleep=0
              """
            }
          }
        },
```

----

```groovy
        chrome: {
          container('maven-chrome') {
            stage('Test chrome') {
              sh """
              mvn -B clean test -Dselenium.browser=chrome \
                -Dsurefire.rerunFailingTestsCount=5 -Dsleep=0
              """
            }
          }
        }
```

<!-- )
}
}
} -->

----

## Storage

[Persistent volumes](http://kubernetes.io/docs/user-guide/persistent-volumes/walkthrough/)

*   GCE disks
*   GlusterFS
*   NFS
*   EBS
*   etc

----

## Using persistent volumes

```
apiVersion: "v1"
kind: "PersistentVolumeClaim"
metadata:
  name: "maven-repo"
  namespace: "kubernetes-plugin"
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

----

```groovy
podTemplate(label: 'maven', containers: [
  containerTemplate(name: 'maven', image: 'maven:3.3.9-jdk-8-alpine',
    ttyEnabled: true, command: 'cat')
  ], volumes: [
  persistentVolumeClaim(mountPath: '/root/.m2/repository',
    claimName: 'maven-repo', readOnly: false)
  ]) {

  node('maven') {
    stage('Build a Maven project') {
      git 'https://github.com/jenkinsci/kubernetes-plugin.git'
      container('maven') {
          sh 'mvn -B clean package'
      }
    }
  }
}
```

----


<!--

## Memory limits

Scheduler needs to account for container memory requirements and host available memory

Prevent containers for using more memory than allowed

Memory constraints translate to Docker [--memory](https://docs.docker.com/engine/reference/run/#user-memory-constraints)

<small>[https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#how-pods-with-resource-limits-are-run](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#how-pods-with-resource-limits-are-run)</small>



### What do you think happens when?

Your container goes over memory quota?



<img height="80%" width="80%" data-src="../assets/explosion.gif">



### New JVM Support for Containers

JDK 8u131+ and JDK 9

```
$ docker run -m 1GB openjdk:8u131 java \
  -XX:+UnlockExperimentalVMOptions \
  -XX:+UseCGroupMemoryLimitForHeap \
  -XshowSettings:vm -version
VM settings:
    Max. Heap Size (Estimated): 228.00M
    Ergonomics Machine Class: server
    Using VM: OpenJDK 64-Bit Server VM
```

[Running a JVM in a Container Without Getting Killed](https://blog.csanchez.org/2017/05/31/running-a-jvm-in-a-container-without-getting-killed)
<small>[https://blog.csanchez.org/2017/05/31/running-a-jvm-in-a-container-without-getting-killed](https://blog.csanchez.org/2017/05/31/running-a-jvm-in-a-container-without-getting-killed)</small>



### New JVM Support for Containers

```
$ docker run -m 1GB openjdk:8u131 java \
  -XX:+UnlockExperimentalVMOptions \
  -XX:+UseCGroupMemoryLimitForHeap \
  -XX:MaxRAMFraction=1 -XshowSettings:vm -version
VM settings:
    Max. Heap Size (Estimated): 910.50M
    Ergonomics Machine Class: server
    Using VM: OpenJDK 64-Bit Server VM
```

[Running a JVM in a Container Without Getting Killed](https://blog.csanchez.org/2017/05/31/running-a-jvm-in-a-container-without-getting-killed)
<small>[https://blog.csanchez.org/2017/05/31/running-a-jvm-in-a-container-without-getting-killed](https://blog.csanchez.org/2017/05/31/running-a-jvm-in-a-container-without-getting-killed)</small>



## CPU limits

Scheduler needs to account for container CPU requirements and host available CPUs

CPU requests translates into Docker [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#cpu-share-constraint)

CPU limits translates into Docker [`--cpu-quota`](https://docs.docker.com/engine/reference/run/#cpu-quota-constraint)

<small>[https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#how-pods-with-resource-limits-are-run](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#how-pods-with-resource-limits-are-run)</small>




### What do you think happens when?

Your container tries to access more than one CPU

Your container goes over CPU limits



![](../assets/minion-what.gif)

Totally different from memory

-->


## Resource Requests and Limits

```groovy
podTemplate(label: 'mypod', containers: [
    containerTemplate(
        name: 'maven', image: 'maven', ttyEnabled: true,
        resourceRequestCpu: '50m',
        resourceLimitCpu: '100m',
        resourceRequestMemory: '100Mi',
        resourceLimitMemory: '200Mi')]) {
...
}
```

---





# Deploying to Kubernetes

----

<img height="100%" width="100%" data-src="../assets/devops_borat.png">

----

> If you haven't automatically destroyed something by mistake, you are not automating enough

----

```groovy
podTemplate(label: 'deployer', serviceAccount: 'deployer',
  containers: [
    containerTemplate(name: 'kubectl',
    image: 'lachlanevenson/k8s-kubectl:v1.7.8',
    command: 'cat',
    ttyEnabled: true)
]){
  node('deployer') {
    container('kubectl') {
      sh "kubectl apply -f my-kubernetes.yaml"
    }
  }
}
```

----

[kubernetes-pipeline-plugin](https://github.com/jenkinsci/kubernetes-pipeline-plugin)

```groovy
podTemplate(label: 'deploy', serviceAccount: 'deployer') {

  stage('deployment') {
    node('deploy') {
      checkout scm
      kubernetesApply(environment: 'hello-world',
        file: readFile('kubernetes-hello-world-service.yaml'))
      kubernetesApply(environment: 'hello-world',
        file: readFile('kubernetes-hello-world-v1.yaml')) }}

  stage('upgrade') {
    timeout(time:1, unit:'DAYS') {
      input id: 'approve', message:'Approve upgrade?'
    }
    node('deploy') {
      checkout scm
      kubernetesApply(environment: 'hello-world',
        file: readFile('kubernetes-hello-world-v2.yaml'))
    }}
}
```

----

Or Azure [kubernetes-cd-plugin](https://github.com/jenkinsci/kubernetes-cd-plugin)

```groovy
kubernetesDeploy(
  credentialsType: 'KubeConfig',
  kubeConfig: [path: '$HOME/.kube/config'],

  configs: '*.yaml',
  enableConfigSubstitution: false,
)
```

---



## The Future

* Periodic snapshotting, ie. EBS volumes in AWS
* Affinity
* Dedicated workers for agents, infra autoscaling
* Multi-region
* Namespaces per team: quotas, isolation

---




# Thanks

[csanchez.org](http://csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/twitter-logo.png"> [csanchez](http://twitter.com/csanchez)

<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg](https://github.com/carlossg)

[<img width="400" data-src="../assets/cloudbees-logo_4.png" alt="CloudBees logo">](http://cloudbees.com)
