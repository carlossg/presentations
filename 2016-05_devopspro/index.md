<img width="600" data-src="../assets/CloudBees_official_logo.png" alt="CloudBees logo" style="background:white;">

## From Monolith to Docker Distributed Applications

[Carlos Sanchez](http://csanchez.org)

[@csanchez](http://twitter.com/csanchez)

---



# About me

Senior Software Engineer @ CloudBees

Author of Jenkins Kubernetes plugin

Long time OSS contributor at Apache Maven, Eclipse, Puppet,…


---

![](../assets/docker-logo.png)

Linux containers

Filesystem

Users

Processes

Network

----

## But it is not trivial

![](../assets/bad-containers.jpeg)

----

![](../assets/microservices-shit.jpg)

----



# Our use case

![](../assets/jenkins-logo.png)

Scaling Jenkins

<small>Your mileage may vary</small>

---



# Architecture

Docker Docker Docker

<img width="200%" data-src="../assets/lstoll.png">

----

Isolated Jenkins masters

Isolated slaves and jobs

Memory and CPU limits

----

<iframe width="560" height="315" src="https://www.youtube.com/embed/PivpCKEiQOQ?rel=0&start=15" frameborder="0" allowfullscreen></iframe>

----

<img width="200%" data-src="../assets/fuhrer-docker.gif">

----

![](../assets/fuhrer-windows10.png)

----

![](../assets/dockerhub-jenkins.png)

----

![](../assets/dockerhub-jenkins-slave.png)

----

> How would you design your infrastructure if you couldn't login? Ever.

> Kelsey Hightower

----

## Embrace failure!

![](../assets/disaster-girl.jpg)

---

# Cluster Scheduling

Distribute tasks across a cluster of hosts

Running in public cloud, private cloud, VMs or bare metal

HA and fault tolerant

With Docker support of course

<!--
<img width="50%" data-src="../assets/run-crash.gif">
-->

----

## Apache Mesos

![](../assets/mesos-logo.png)

<q>A distributed systems kernel</q>

<img data-src="../assets/hadoop-logo.png">
<img data-src="../assets/spark-logo-trademark.png" style="background:white;">
<img width="25%" data-src="../assets/kafka-logo-wide.png" style="background:white;">

----

## Alternatives

<img data-src="../assets/docker-swarmnado.gif" width="25%">
<img data-src="../assets/kubernetes-logo.png">

Docker Swarm / Kubernetes

----

## Mesosphere Marathon

<img width="60%" data-src="../assets/marathon-logo.png">

----

## Apache Zookeeper

<img data-src="../assets/zookeeper-logo.png">

----

## Terraform

<img width="50%" data-src="../assets/terraform-logo.png">

----

## Terraform

    resource "aws_instance" "worker" {
        count = 1
        instance_type = "m3.large"
        ami = "ami-xxxxxx"
        key_name = "tiger-csanchez"
        security_groups = ["sg-61bc8c18"]
        subnet_id = "subnet-xxxxxx"
        associate_public_ip_address = true
        tags {
            Name = "tiger-csanchez-worker-1"
            "cloudbees:pse:cluster" = "tiger-csanchez"
            "cloudbees:pse:type" = "worker"
        }
        root_block_device {
            volume_size = 50
        }
    }

----

## Terraform

* State is managed
* Runs are idempotent
 * `terraform apply`
* Sometimes it is too automatic
 * Changing image id will restart all instances

----

<img height="100%" width="100%" data-src="../assets/devops_borat.png">

---



# Storage

Handling distributed storage

Servers can start in any host of the cluster

And they can move when they are restarted

----

## Docker Volume Plugins

*   Flocker
*   GlusterFS
*   NFS
*   EBS

----

![](../assets/flocker.jpg)


----

## Kubernetes

*   GCE disks
*   Flocker
*   GlusterFS
*   NFS
*   EBS

----

## Sidekick container

A privileged container that manages mounting for other containers

Can execute commands in the host and other containers

----

A lot of magic happening with `nsenter`

![](../assets/unicorn.jpg)

----

## In our case

Sidekick container (_castle_ service)

Jenkins masters need persistent storage, slaves (_typically_) don't

Supporting EBS (AWS) and external NFS

----

## Castle

* Jenkins master container requests data on startup using _entrypoint_
 * REST call to Castle
* Castle checks authentication
* Creates necessary storage in the backend
 * EBS volumes from snapshots
 * Directories in NFS backend

----

## Castle

* Mounts storage in requesting container
 * EBS is mounted to host, then bind mounted into container
 * NFS is mounted directly in container
* Listens to Docker event stream for killed containers

----

## Castle: backups and cleanup

Periodically takes S3 snapshots from EBS volumes in AWS

Cleanups happening at different stages and periodically

### Embrace failure!

----

## Permissions

Containers should not run as root

Container user id != host user id

i.e. `jenkins` user in container is always 1000 but matches `ubuntu` user in host

----

## Caveats

Only a limited number of EBS volumes can be mounted <!-- .element: class="fragment" -->

<p class="fragment">Docs say `/dev/sd[f-p]`, but `/dev/sd[q-z]` seem to work too</p>

Sometimes the device gets corrupt and no more EBS volumes can be mounted there <!-- .element: class="fragment" -->

NFS users must be centralized and match in cluster and NFS server <!-- .element: class="fragment" -->

---



# Memory

Scheduler needs to account for container memory requirements and host available memory

Prevent containers for using more memory than allowed

Memory constrains translate to Docker [--memory](https://docs.docker.com/engine/reference/run/#runtime-constraints-on-resources)

----

## What do you think happens when?

Your container goes over memory quota?

----

<img height="80%" width="80%" data-src="../assets/explosion.gif">

----

## What about the JVM?


----

## What about the child processes?

---



# CPU

Scheduler needs to account for container CPU requirements and host available CPUs

----

## What do you think happens when?

Your container tries to access more than one CPU

Your container goes over CPU limits

----

![](../assets/minion-what.gif)

Totally different from memory

Mesos/Kubernetes CPU translates into Docker [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#runtime-constraints-on-resources)

---



# Other considerations

----

## Zombie reaping problem

![](../assets/adoption.png)

Zombie processes are processes that have terminated but have not (yet) been waited for by their parent processes.

The init process -- PID 1 -- task is to "adopt" orphaned child processes

<!-- [source](https://blog.phusion.nl/2015/01/20/docker-and-the-pid-1-zombie-reaping-problem/) -->

----

### This is a problem in Docker

Jenkins slaves run multiple processes

But Jenkins masters too, and they are long running

----

### [`tini`](https://github.com/krallin/tini)

Systemd or SysV init is too heavyweight for containers

> All Tini does is spawn a single child (Tini is meant to be run in a container),
> and wait for it to exit all the while reaping zombies and performing signal forwarding.

<!--
## process reaping

Docker 1.9 gave us trouble at scale, rolled back to 1.8

Lots of _defunct_ processes
-->

---


# Networking

Multiple services running in the same ports

Must redirect from random ports in the host

Services running in one host need to access services in other hosts

----

## Networking: Service discovery

DNS is not great, caching can happen at multiple levels

`marathon-lb` uses `haproxy` and Marathon API

A typical `nginx` reverse proxy is also easy to setup

There are more complete solutions like Consul

----

## Networking: security

Prevent/Allow


| from | to ||
|---|---|---|
| container | host | `iptables` |
| container | container | `--icc=false` + `--link`, `docker0` bridge device tricks |
| container | another host | `--ip-forward=false`, `iptables ` |
| container | container in another host | `iptables` |


----

## Networking: Software Defined Networks

Create new custom networks on top of physical networks

Allow grouping containers in subnets

Not trivial to setup

----

## Networking: Software Defined Networks

[Battlefield: Calico, Flannel, Weave and Docker Overlay Network](http://chunqi.li/2015/11/15/Battlefield-Calico-Flannel-Weave-and-Docker-Overlay-Network/)

[http://chunqi.li/2015/11/15/Battlefield-Calico-Flannel-Weave-and-Docker-Overlay-Network/](http://chunqi.li/2015/11/15/Battlefield-Calico-Flannel-Weave-and-Docker-Overlay-Network/)

----

### Docker Overlay

Docker networking with default `overlay` driver, using VxLAN

    # On the Swarm master
    docker network create --driver overlay --subnet=10.0.9.0/24 my-net

Uses Consul, etcd or ZooKeeper as key-value stores

<!--

### Weave

UDP and VxLAN backends

![](../assets/weave.png)


### CoreOS `flannel`

<img data-src="../assets/flannel.png" style="background:white;">

UDP and VxLAN backends

Uses `etcd` for key-value store


### Project Calico

![](../assets/calico.png)

A pure Layer 3 model


### Kubernetes networking

All containers can communicate with all other containers  without NAT

All nodes can communicate with all containers (and vice-versa)  without NAT

The IP that a container sees itself as is the same IP  that others see it as


### Kubernetes networking

Every machine in the cluster is assigned a full subnet

ie. node A 10.0.1.0/24 and node B 10.0.2.0/24

Simpler port mapping

Only supported by GCE or using CoreOS `flannel`
-->

---



# Scaling

New and interesting problems

----

### Terraform AWS

* Instances
* Keypairs
* Security Groups
* S3 buckets
* ELB
* VPCs

----

### AWS

Resource limits: VPCs, S3 snapshots, some instance sizes <!-- .element: class="fragment" -->

Rate limits: affect the whole account <!-- .element: class="fragment" -->

Retrying is your friend, but with exponential backoff <!-- .element: class="fragment" -->

----

### Terraform OpenStack

* Instances
* Keypairs
* Security Groups

----

## OpenStack

Custom flavors

Custom images

Different CLI commands

There are not two OpenStack installations that are the same

---


# Upgrades / Maintenance

Moving containers from hosts

Draining hosts

Rolling updates

Blue/Green deployment

Immutable infrastructure


---

# Thanks

[csanchez.org](http://csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/twitter-logo.png"> [csanchez](http://twitter.com/csanchez)

<img height="64px" style="vertical-align:middle" data-src="../assets/github-logo.png"> [carlossg](https://github.com/carlossg)

[<img height="150px" data-src="../assets/CloudBees_official_logo.png" alt="CloudBees logo" style="background:white;">](http://cloudbees.com)
