<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

## What to Do When the Cost of Writing Code Approaches Zero

<a href="http://adobe.com"><img width="300" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"></a>

Carlos Sanchez /
[csanchez.org](http://csanchez.org) / 
[@csanchez.org](https://bsky.app/profile/csanchez.org)


----

Principal Scientist

[Adobe Experience Manager Cloud Service](https://www.adobe.com/marketing/experience-manager/cloud-service.html)

Author of Jenkins Kubernetes plugin

Long time OSS contributor at Jenkins, Apache Maven, Puppet,…

<img width="300" data-src="../assets/gde.png" alt="GDE logo">

---

What matters more than ever is not writing code, but **what problems to solve**

----

### The Ariane 5 Flight 501 (1996)

Cost: **$370** million

**The Error:** An Integer Overflow. The software tried to cram a 64-bit floating-point number (representing horizontal velocity) into a 16-bit signed integer space.

----

### The Ariane 5 Flight 501 (1996)

**The Result:** The value was too large for 16-bit causing the computer to crash. The backup computer, running the exact same software, crashed simultaneously for the same reason.

----

### The Ariane 5 Flight 501 (1996)

**The Outcome:** The rocket veered off course due to incorrect aerodynamic data and was automatically detonated 40 seconds after launch.

----

### The Mars Climate Orbiter (1999)

Cost: **$327** million

**The Error:** Unit Mismatch. The ground-based software (Lockheed Martin) produced results in pound-force seconds. However, the spacecraft’s navigation software (NASA) expected those values in newton-seconds.

----

### The Mars Climate Orbiter (1999)

**The Result:** Every time the thrusters fired to adjust the orbit, the error compounded.

----

### The Mars Climate Orbiter (1999)

**The Outcome:** The orbiter approached Mars at an altitude of only 57 km instead of the intended 140 km. It was either destroyed by atmospheric friction or bounced off into space.

----

### The CrowdStrike Global Outage (2024)

Cost: Over **$10 billion**.

**The Error:** A faulty configuration update (a "Channel File") for the Falcon Sensor software was pushed to millions of Windows machines.  

----

### The CrowdStrike Global Outage (2024)

**The Result:** It triggered the "Blue Screen of Death" on 8.5 million systems simultaneously.  

----

### The CrowdStrike Global Outage (2024)

**The Outcome:** Over 5,000 flights canceled

Delta Air Lines alone lost $500 million

Hospitals had to cancel surgeries and switch to paper records

ATMs and payment systems went dark globally

----

<img data-src="timeline0.png">

----

<img data-src="timeline1.png">

----

<img data-src="timeline2.png">

----

## New Possibilities with AI

Let's look at a couple of examples of new possibilities that AI offers us

1. **Self-Healing Deployments**
2. **Agentic Sites: Hyper-Personalized Websites**

---

# Self-Healing Deployments
## Solving Production Problems with Agents

----

## The Problem

In Kubernetes, Argo Rollouts excels at *Progressive Delivery* and automatic *rollbacks* to contain a bad deployment...

**What if we could go one step beyond rolling back to the previous version?**

----

## The Solution

Integrating agents with Argo Rollouts *canary* deployments

- Analyze a deployment failure
- Narrow down the root cause  
- Propose or materialize fixes in *pull requests*
- Ready to redeploy after review

----

## The Result

**Truly self-healing deployments:**

- Progressive deployment limits the impact
- The agent shortens the time between "we rolled back" and "the problem is already solved in code and in production"

----

## Benefits

- **Reduced recovery time** from hours to minutes
- **Less manual intervention** in incidents
- **Continuous learning** from failure patterns
- **Greater confidence** in automated deployments

----

https://github.com/argoproj-labs/rollouts-plugin-metric-ai

https://github.com/carlossg/kubernetes-agent

https://github.com/carlossg/rollouts-demo

---

# Agentic Sites
## Hyper-Personalized Websites with AI

----

## The Traditional Problem

The era of static, one-size-fits-all websites is behind us

Users expect experiences that adapt to:
- Their context
- Their preferences  
- Their intent in the moment

----

## Current Limitations

Doing this at scale goes beyond:
- A simple A/B test
- A classic recommendation engine

**A new approach is needed**

----

## The Solution: Agentic Sites

- Learn from behavior
- Interpret context signals
- Compose hyper-personalized pages in real time

----

## Not Fixed Rules

The agent **reasons** about:
- User intent
- Available content variations
- Experience adaptation

While maintaining brand consistency and performance

----

## How Agentic Sites Work

Instant Personalization

On-Demand Generation

Proactive Recommendations

----

## Real-Time Experience

Pages are assembled dynamically as users browse

Content streams in without loading screens

Everything is editable and versionable

----

https://arco.coffee/

---


**With great power comes great responsibility**

<span style="color:white"><strong>The cost of writing code approaches zero</strong></span>

<span style="color:white"><strong>The key question is no longer "how do we build it?" but "what problems are worth solving?"</strong></span>

----

**With great power comes great responsibility**

**The cost of writing code approaches zero**

**The key question is no longer "how do we build it? but "what problems are worth solving?"**

---


<div class="container">

<div class="col">

[csanchez.org](http://csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/Bluesky_Logo.png">[@csanchez.org](https://bsky.app/profile/csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg](https://github.com/carlossg)

</div>

<!-- <div class="col">
    <img width="80%" data-src="../assets/magritte.png">
</div> -->

<div class="col">

<img width="50%" data-src="../assets/blog-qr-code.png">


</div>
</div>


<a href="http://adobe.com"><img width="400" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"></a>