## Using Docker for Testing



[Carlos Sanchez](http://csanchez.org)

[csanchez.org](http://csanchez.org) / [@csanchez](http://twitter.com/csanchez)

<a href="http://cloudbees.com"><img width="300" data-src="../assets/cloudbees-logo_4.png" alt="CloudBees logo" style="background:white;"></a>
<a href="http://www.sstqb.es/"><img width="400" data-src="SSTQB_COLOR_.jpg" alt="SSTQB logo" style="background:white;"></a>

<!-- <a href="http://cloudbees.com/jenkinsworld"><img width="150" data-src="jenkinsworld-2016.png" alt="Jenkins World logo" style="background:white;"></a> -->

<!-- <small>[Watch online at carlossg.github.io/presentations](https://carlossg.github.io/presentations)</small>
 -->

---





# About me

Engineer @ CloudBees, scaling Jenkins
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img width="100" data-src="../assets/jenkins-logo.png" alt="Jenkins logo" style="vertical-align: middle; ">

Long time OSS contributor at Apache (Apache Maven), Jenkins, Eclipse, Puppet,…

<img width="300" data-src="../assets/gde.png" alt="GDE logo">



---

<img width="200%" data-src="../assets/lstoll.png">

----

# Containers

* Linux containers
* File System
* Users
* Processes
* Network


----

> EVERYTHING at Google runs in a container

> Starts over two billion containers per week

----



# Docker Docker Docker

![](../assets/docker-logo.png)

----

## But it is not trivial

![](../assets/bad-containers.jpeg)

<!--
![](../assets/microservices-shit.jpg)
-->

----


## Operating Systems
### Engine Support

The Engine runs the containers

* Linux
* Windows

----

## Operating Systems
### Client Support

The client talks to the engine through an API

* Linux
* OS X
* Windows

----

## Build once
## run anywhere

Bare metal

Virtual Machines

Cloud

----

# Developer Oriented

Dependency hell

Installation nightmares

_"it ran on my machine"_

----

# Ops Oriented

No need to know internals of apps

Focus on OPs problems (scale, monitoring,…)

Clearer deliverables from dev

----

![](../assets/docker-layers.png)

----

![](../assets/docker-ecosystem.png)

----

![](../assets/docker-hub.png)


---





# Related Projects

----

# Docker Machine

Provision Docker engines in virtual machines

* Amazon EC2
* Microsoft Azure
* Google Compute Engine
* OpenStack
* Rackspace
* VMware

----

# Docker Compose

Define multi container applications

```yaml
version: '3'
services:
  web:
    build: .
    ports:
    - "5000:5000"
    volumes:
    - .:/code
    - logvolume01:/var/log
    links:
    - redis
  redis:
    image: redis
volumes:
  logvolume01: {}
```


----

# Orchestrators

![](../assets/mesos-logo.png)
<img data-src="../assets/docker-swarm-logo.png" width="25%">
<img data-src="../assets/kubernetes-logo-text.png">

---






# Docker and Selenium

----

Manage multiple combinations of browsers

Any number of them

Standalone or Selenium Hub
  even with VNC

----

![](../assets/selenium-node-firefox.png)

----

![](../assets/selenium-standalone-chrome-debug.png)

----

# Selenium Hub

```yaml
docker run -d -p 4444:4444 --name selenium-hub selenium/hub:3.4.0
docker run -d -p 5901:5900 --link selenium-hub:hub \
    selenium/node-chrome-debug:3.4.0
docker run -d -p 5902:5900 --link selenium-hub:hub \
    selenium/node-firefox-debug:3.4.0
```


---




# Graciñas

[csanchez.org](http://csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/twitter-logo.png"> [csanchez](http://twitter.com/csanchez)

<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg](https://github.com/carlossg)

