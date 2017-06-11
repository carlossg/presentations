### Using Containers for
## Continuous Integration
##### and
## Continuous Delivery

[Carlos Sanchez](http://csanchez.org)

[csanchez.org](http://csanchez.org) / [@csanchez](http://twitter.com/csanchez)

<a href="http://cloudbees.com"><img width="400" data-src="../assets/cloudbees-logo_4.png" alt="CloudBees logo" style="background:white;"></a>
<a href="http://paris-container-day.fr"><img width="400" data-src="Logo_PDC_2017.png" alt="Paris Container Day" style="background:white;"></a>

<small>[Watch online at carlossg.github.io/presentations](https://carlossg.github.io/presentations)</small>

---





# About me

Engineer @ CloudBees, Scaling Jenkins

Author of Jenkins Kubernetes plugin

Contributor to Jenkins Mesos plugin & Jenkins and Maven official Docker images

Long time OSS contributor at Apache Maven, Eclipse, Puppet,…

<img width="300" data-src="../assets/gde.png" alt="GDE logo">


---






# Docker Docker Docker

![](../assets/docker-logo.png)

----

<img width="200%" data-src="../assets/lstoll.png">

----

## Using Containers is not Trivial

<img width="450" data-src="../assets/container-ship-ships.jpg">
<img width="450" data-src="../assets/bad-containers.jpeg">

----

![](../assets/microservices-shit.jpg)

---






# Scaling Jenkins

Two options:

* More build agents per master
* More masters

----

## Scaling Jenkins: More Build Agents

* Pros

 * Multiple plugins to add more agents, even dynamically

* Cons

 * The master is still a SPOF
 * Handling multiple configurations, plugin versions,...
 * There is a limit on how many build agents can be attached

----

## Scaling Jenkins: More Masters

* Pros

 * Different sub-organizations can self service and operate independently

* Cons

 * Single Sign-On
 * Centralized configuration and operation

Covered by CloudBees Jenkins Enterprise

---





# Docker and Jenkins

----

# Running in Docker

![](../assets/dockerhub-jenkins.png)

----

![](../assets/dockerhub-jenkinsci.png)

----

![](../assets/dockerhub-jenkins-slave.png)

---

## Jenkins Docker Plugins

* Dynamic Jenkins agents with Docker plugin or Yet Another Docker Plugin
  * No support yet for Docker Swarm mode
* Isolated build agents and jobs
* Agent image needs to include Java, downloads slave jar from Jenkins master

----

## Jenkins Docker Plugins

* Multiple plugins for different tasks
  * Docker build and publish
  * Docker build step plugin
  * CloudBees Docker Hub/Registry Notification
  * CloudBees Docker Traceability
* Great pipeline support

----

<!-- ![](../assets/docker-plugin-global-config.png) -->


![](../assets/docker-plugin-image-config.png)

----


### Jenkins Docker Pipeline

    def maven = docker.image('maven:3.3.9-jdk-8');

    stage('Mirror') {
      maven.pull()
    }

    docker.withRegistry('https://secure-registry/',
      'docker-registry-login') {

      stage('Build') {
        maven.inside {
          sh "mvn -B clean package"
        }
      }
      
      stage('Bake Docker image') {
        def pcImg = docker.build(
          "examplecorp/spring-petclinic:${env.BUILD_TAG}", 'app')

        pcImg.push();
      }
    }

<!-- ### [Jenkins Docker Slaves Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Docker+Slaves+Plugin)

Use any Docker image, no need for Java

Definition in pipeline

Can have side containers


![](../assets/docker-slaves-plugin.png)


    dockerNode("maven:3.3.3-jdk-8") {
      sh "mvn -version"
    }

 -->

---




## When One Machine is no Longer Enough

* Running Docker across multiple hosts
* In public cloud, private cloud, VMs or bare metal
* HA and fault tolerant

----

<img height="100%" width="100%" data-src="../assets/devops_borat.png">

----

> If you haven't automatically destroyed something by mistake, you are not automating enough

----

![](../assets/mesos-logo.png)
<img data-src="../assets/docker-swarm-logo.png" width="25%">
<img data-src="../assets/kubernetes-logo-text.png">

<!-- 
# ![](../assets/mesos-logo.png)

<q>A distributed systems kernel</q>

<img data-src="../assets/hadoop-logo.png">
<img data-src="../assets/spark-logo-trademark.png" style="background:white;">
<img width="25%" data-src="../assets/kafka-logo-wide.png" style="background:white;">

 -->

<!-- 
# Apache Mesos

* Started before 2011
* Runs tasks, any binary or Docker, `rkt`, `appc` images
* Frameworks run on top of Mesos
 * Mesosphere Marathon: long running services
 * Apache Aurora: long running services
 * Chronos: distributed cron-like system
* Used in Twitter, Airbnb, eBay, Apple, Verizon, Yelp,... 
 -->

<!--
# Docker Swarm

<img data-src="../assets/docker-swarm-logo.png" width="25%">

* No need to install extra software
* Each daemon can run as a Swarm member
* New `service` object to describe distributed containers
 * Existing tooling needs to be updated

 -->

---






# <img data-src="../assets/kubernetes-logo-text.png">

----

# Kubernetes

* Based on Google Borg
* Run in local machine, virtual, cloud
* Google provides Google Container Engine (GKE)
* Other services run by stackpoint.io, CoreOS Tectonic, Azure,...
* Minikube for local testing

----

## Grouping Containers (Pods)

Example:

* Jenkins agent
* Maven build
* Selenium Hub with
  * Firefox
  * Chrome

5 containers

----

## Storage

Jenkins masters need persistent storage, agents (_maybe_)

[Persistent volumes](http://kubernetes.io/docs/user-guide/persistent-volumes/walkthrough/)

*   GCE disks
*   GlusterFS
*   NFS
*   EBS
*   etc

----

### Permissions

Containers should not run as root

Container user id != host user id

i.e. `jenkins` user in container is always 1000 but matches `ubuntu` user in host

----

### Permissions

    containers: [...]
    securityContext:
      fsGroup: 1000
    volumes: [...]

> Volumes which support ownership management are modified to be owned and writable by the GID specified in fsGroup

----

# Networking

Jenkins masters open several ports

* HTTP
* JNLP Build agent
* SSH server (Jenkins CLI type operations)

Jenkins agents connect to master:

* inbound (SSH)
* outbound (JNLP)

----

Multiple [networking options](http://kubernetes.io/docs/admin/networking/): 

GCE, Flannel, Weave, Calico,...

One IP per Pod

Containers can find other containers in the same Pod using `localhost`

----

## Memory limits

Scheduler needs to account for container memory requirements and host available memory

Prevent containers for using more memory than allowed

Memory constraints translate to Docker [--memory](https://docs.docker.com/engine/reference/run/#user-memory-constraints)

<small>[https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#how-pods-with-resource-limits-are-run](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#how-pods-with-resource-limits-are-run)</small>

----

### What do you think happens when?

Your container goes over memory quota?

----

<img height="80%" width="80%" data-src="../assets/explosion.gif">

----

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

----

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

----

## CPU limits

Scheduler needs to account for container CPU requirements and host available CPUs

CPU requests translates into Docker [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#cpu-share-constraint)

CPU limits translates into Docker [`--cpu-quota`](https://docs.docker.com/engine/reference/run/#cpu-quota-constraint)

<small>[https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#how-pods-with-resource-limits-are-run](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#how-pods-with-resource-limits-are-run)</small>


----

### What do you think happens when?

Your container tries to access more than one CPU

Your container goes over CPU limits

----

![](../assets/minion-what.gif)

Totally different from memory


---






## [Jenkins Kubernetes Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Kubernetes+Plugin)

* Dynamic Jenkins agents, running as Pods
* Multiple container support
  * One jnlp image, others custom
* Pipeline support for both agent Pod definition and execution
* Persistent workspace

----

### Jenkins Kubernetes Pipeline

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

Multi-language Pipeline

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
        sh 'mvn -B clean package'
      }
    }

    stage('Build a Golang project') {
      git url: 'https://github.com/hashicorp/terraform.git'
      container('golang') {
        sh """
        mkdir -p /go/src/github.com/hashicorp
        ln -s `pwd` /go/src/github.com/hashicorp/terraform
        cd /go/src/github.com/hashicorp/terraform && make core-dev
        """
      }
    }
  }
}
```


----

## Jenkins Plugins Caveats

* Using the Cloud API
 * Not ideal for containerized workload
 * Agents take > 1 min to start provision and are kept around
 * Agents can provide more than one executor

----

## Jenkins Plugins Caveats

* One Shot Executor
 * Improved API to handle one off agents
 * Optimized for containerized agents
 * Plugins need to support it

---






# Merci

[csanchez.org](http://csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/twitter-logo.png"> [csanchez](http://twitter.com/csanchez)

<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg](https://github.com/carlossg)

[<img width="400" data-src="../assets/cloudbees-logo_4.png" alt="CloudBees logo">](http://cloudbees.com)
