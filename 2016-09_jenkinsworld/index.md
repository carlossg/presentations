<a href="http://cloudbees.com"><img width="400" data-src="../assets/CloudBees_official_logo.png" alt="CloudBees logo" style="background:white;"></a>

### Scaling Jenkins with Docker
## Swarm, Kubernetes or Mesos?

[Carlos Sanchez](http://csanchez.org)

[csanchez.org](http://csanchez.org) / [@csanchez](http://twitter.com/csanchez)

<a href="http://cloudbees.com/jenkinsworld"><img width="150" data-src="jenkinsworld-2016.png" alt="Jenkins World logo" style="background:white; position:fixed; bottom:0px; right:0px;"></a>

---





# About me

Engineer @ CloudBees

Contributor to the Jenkins Mesos plugin and the Java Marathon client, Jenkins and Maven official Docker images,...

Author of Jenkins Kubernetes plugin

Long time OSS contributor at Apache, Eclipse, Puppet,…


---






# Docker Docker Docker

![](../assets/docker-logo.png)

----

<img width="200%" data-src="../assets/lstoll.png">

----

## But it is not trivial

![](../assets/bad-containers.jpeg)

<!--
![](../assets/microservices-shit.jpg)
-->

----


# Cluster Scheduling

* Running in public cloud, private cloud, VMs or bare metal
* HA and fault tolerant
* With Docker support of course


----


![](../assets/mesos-logo.png)
<img data-src="../assets/docker-swarm-logo.png" width="25%">
<img data-src="../assets/kubernetes-logo-text.png">

---






# ![](../assets/mesos-logo.png)

<q>A distributed systems kernel</q>

<img data-src="../assets/hadoop-logo.png">
<img data-src="../assets/spark-logo-trademark.png" style="background:white;">
<img width="25%" data-src="../assets/kafka-logo-wide.png" style="background:white;">

----

# Apache Mesos

* Started before 2011
* Runs tasks, any binary or Docker, `rkt`, `appc` images
* Frameworks run on top of Mesos
 * Mesosphere Marathon: long running services
 * Apache Aurora: long running services
 * Chronos: distributed cron-like system
* Used in Twitter, Airbnb, eBay, Apple, Verizon, Yelp,... 

---






# Docker Swarm

<img data-src="../assets/docker-swarm-logo.png" width="25%">

----

# Docker Swarm

* By Docker Inc.
* Uses the same Docker API
* No need to modify existing tooling

----

## Docker Engine Swarm mode

* New [Swarm mode](https://docs.docker.com/engine/swarm/) in Docker 1.12
* No need to install extra software, each daemon can run as a Swarm member
* New `service` object to describe distributed containers
 * Existing tooling needs to be updated


---






# <img data-src="../assets/kubernetes-logo-text.png">

----

# Kubernetes

* Based on Google Borg
* Run in local machine, virtual, cloud
* Google provides Google Container Engine (GKE)
* Other services run by stackpoint.io, CoreOS Tectonic, Azure,...
* Minikube for local testing

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

Covered by CloudBees Jenkins Operations Center and CloudBees Jenkins Platform Private SaaS Edition

----

# Scaling with Docker

![](../assets/dockerhub-jenkins.png)

----

![](../assets/dockerhub-jenkins-slave.png)

---







# Cluster Scheduling

Isolated build agents and jobs

Using Docker

Capabilities can be dropped

----

## Grouping containers

Example:

* Jenkins agent
* Maven build
* Selenium testing in
  * Firefox
  * Chrome
  * Safari

5 containers

----

## Grouping containers

<table>
  <tbody>
    <tr>
      <td>Mesos</td>
      <td>Does not support grouping yet</td>
    </tr>
    <tr>
      <td>Swarm</td>
      <td>
        Supports grouping through Docker Compose<br/>
        Can force execution in the same host
      </td>
    </tr>
    <tr>
      <td>Kubernetes</td>
      <td>
        Supports the concept of Pods natively<br/>
        All running in the same host
      </td>
    </tr>
  </tbody>
</table>


----

## Memory limits

Scheduler needs to account for container memory requirements and host available memory

Prevent containers for using more memory than allowed

<table>
  <tbody>
    <tr>
      <td>Mesos</td>
      <td>required</td>
    </tr>
    <tr>
      <td>Swarm</td>
      <td>optional</td>
    </tr>
    <tr>
      <td>Kubernetes</td>
      <td>optional (plus namespaces)</td>
    </tr>
  </tbody>
</table>

Memory constrains translate to Docker [--memory](https://docs.docker.com/engine/reference/run/#runtime-constraints-on-resources)

----

### What do you think happens when?

Your container goes over memory quota?

----

<img height="80%" width="80%" data-src="../assets/explosion.gif">

----

### What about the JVM?


----

### What about the child processes?


----

## CPU limits

Scheduler needs to account for container CPU requirements and host available CPUs

<table>
  <tbody>
    <tr>
      <td>Mesos</td>
      <td>required</td>
    </tr>
    <tr>
      <td>Swarm</td>
      <td>optional</td>
    </tr>
    <tr>
      <td>Kubernetes</td>
      <td>optional (plus namespaces)</td>
    </tr>
  </tbody>
</table>

CPU translates into Docker [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#runtime-constraints-on-resources)

----

### What do you think happens when?

Your container tries to access more than one CPU

Your container goes over CPU limits

----

![](../assets/minion-what.gif)

Totally different from memory

----

## Storage

Handling distributed storage

Jenkins masters need persistent storage, agents (_typically_) don't

<table>
  <tbody>
    <tr>
      <td>Mesos</td>
      <td>[Docker volume support](https://mesos.apache.org/documentation/latest/docker-volume/) in 1.0+</td>
    </tr>
    <tr>
      <td>Swarm</td>
      <td>Docker volume plugins: RexRay, Convoy, Flocker,...</td>
    </tr>
    <tr>
      <td>Kubernetes</td>
      <td>[Persistent volumes](http://kubernetes.io/docs/user-guide/persistent-volumes/walkthrough/)</td>
    </tr>
  </tbody>
</table>


----

### Permissions

Containers should not run as root

Container user id != host user id

i.e. `jenkins` user in container is always 1000 but matches `ubuntu` user in host

----

### Caveats

Only a limited number of EBS volumes can be mounted <!-- .element: class="fragment" -->

<p class="fragment">Docs say `/dev/sd[f-p]`, but `/dev/sd[q-z]` seem to work too</p>

NFS users must be centralized and match in cluster and NFS server <!-- .element: class="fragment" -->

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

Allows getting one IP per container

<table>
  <tbody>
    <tr>
      <td>Mesos</td>
      <td>[Network Isolator Modules](http://mesos.apache.org/documentation/latest/networking-for-mesos-managed-containers/): Calico, Weave</td>
    </tr>
    <tr>
      <td>Swarm</td>
      <td>[Docker overlay](https://docs.docker.com/swarm/networking/), and others from plugins</td>
    </tr>
    <tr>
      <td>Kubernetes</td>
      <td>Multiple [networking options](http://kubernetes.io/docs/admin/networking/): GCE, Weave, Calico,...</td>
    </tr>
  </tbody>
</table>


----

## It is not trivial

![](../assets/bad-containers.jpeg)

<!--
![](../assets/microservices-shit.jpg)
-->

---




# Jenkins plugins

----

## Jenkins Docker Plugins

* Dynamic Jenkins agents with Docker plugin or Yet Another Docker Plugin
  * No support yet for Docker 1.12 Swarm mode
* Agent image needs to include Java, downloads slave jar from Jenkins master
* Multiple plugins for different tasks
  * Docker build and publish
* Great pipeline support

----

### Jenkins Docker Pipeline

    def maven = docker.image('maven:3.3.9-jdk-8');

    stage 'Mirror'
    maven.pull()
    docker.withRegistry('https://secure-registry/', 'docker-registry-login') {

      stage 'Build'
      maven.inside {
        sh "mvn -B clean package"
      }
      
      stage 'Bake Docker image'
      def pcImg = docker.build("examplecorp/spring-petclinic:${env.BUILD_TAG}", 'app')

      pcImg.push();
    }

----

## Jenkins Mesos Plugin

* Dynamic Jenkins agents, both Docker and isolated processes
* Agent image needs to include Java, grabs slave jar from Mesos sandbox
* Can run Docker commands on the host, outside of Mesos

----

## Jenkins Mesos Plugin

Can use Docker pipelines with some tricks

* Need Docker client installed
* Shared docker.sock from host
* Mount the workspace in the host, visible under same dir

----

### Mesos Plugin and Pipeline

    node('docker') {
        docker.image('golang:1.6').inside {

            stage 'Get sources'
            git url: 'https://github.com/hashicorp/terraform.git', tag: "v0.6.15"

            stage 'Build'
            sh """#!/bin/bash -e
            mkdir -p /go/src/github.com/hashicorp
            ln -s `pwd` /go/src/github.com/hashicorp/terraform
            pushd /go/src/github.com/hashicorp/terraform
            make core-dev plugin-dev PLUGIN=provider-aws
            popd
            cp /go/bin/terraform-provider-aws .
            """

            stage 'Archive'
            archive "terraform-provider-aws"
        }
    }

----

## Jenkins Kubernetes Plugin

* Dynamic Jenkins agents, running as Pods
* Multiple container support
  * One jnlp image, others custom
* Pipeline support for both agent Pod definition and execution will be in next version

----

### Jenkins Kubernetes Pipeline

TODO

----

# Jenkins Plugins recap

* Dynamic Jenkins agent creation
* Using JNLP slave jar
  * In complex environments need to use the `tunnel` option to connect internally
* Using the Cloud API
 * Not ideal for containerized workload
 * Agents take > 1 min to start provision and are kept around
 * Agents can provide more than one executor

----

# Jenkins One Shot Executor

Improved API to handle one off agents

Optimized for containerized agents

Plugins need to support it

---






# Thanks

[csanchez.org](http://csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/twitter-logo.png"> [csanchez](http://twitter.com/csanchez)

<img height="64px" style="vertical-align:middle" data-src="../assets/github-logo.png"> [carlossg](https://github.com/carlossg)

[<img height="150px" data-src="../assets/CloudBees_official_logo.png" alt="CloudBees logo" style="background:white;">](http://cloudbees.com)
