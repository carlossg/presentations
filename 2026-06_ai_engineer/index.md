<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

## Agentic Sites: Building Hyper Personalized Websites 

<a href="http://adobe.com"><img width="300" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"></a>

Carlos Sanchez /
[csanchez.org](http://csanchez.org) / 
[@csanchez.org](https://bsky.app/profile/csanchez.org)


----

Principal Scientist

[Adobe Experience Manager Cloud Service](https://www.adobe.com/marketing/experience-manager/cloud-service.html)

<!-- Author of Jenkins Kubernetes plugin -->

Long time OSS contributor at Kubernetes,Jenkins, Apache Maven, Puppet,…

<!-- <img width="300" data-src="../assets/gde.png" alt="GDE logo"> -->

---


# Agentic Sites: What and How

----

## Intent-driven site

Adapts to each user's goals

Pages personalize in real time based on user persona and queries

----

## The stack

**AEM Edge Delivery + a backend service** power the experience

Combines Edge Delivery Services with a vendor-agnostic AI backend — Bedrock, Cerebras, SambaNova, Cloudflare, Vertex, and local models

----

## The engine

Personalization leverages rich content and custom blocks

In the demo, we showcase **35 custom blocks** and a **300+ page content corpus** for deep personalization

---


## Solving Static Site Limitations

One-size-fits-all limits engagement

<!-- Static sites deliver identical content to every visitor, ignoring unique needs -->

Manual authoring can't scale

<!-- Creating pages for every possible persona or question is impractical for authors -->

Multi-layer personalization unlocks relevance

<!-- Persona quiz, query generation, and proactive recommendations adapt content in real time -->

----


## Personalization Paths

Instant Persona Adaptation

<!-- Site content shifts in real time based on navigation and user queries -->

On-Demand Query Generation

<!-- Any natural-language question creates a tailored new page -->

Proactive "For You" Recommendations

<!-- Browsing signals trigger personalized pages for each user -->

----

## For Marketers

Defining the personalization strategy in natural language

Continuously evolving the personalization strategy based on analytics


---


# Architecture Overview

----

## Dynamic Frontend with Custom Blocks

AEM Edge Delivery Services enables flexible layouts and real-time updates

----

## AI-Powered Backend Integration

A service fronting any LLM — Bedrock, Cerebras, SambaNova, Vertex, or local — for deep personalization

Model evaluation customized to each site to validate performance and accuracy

----

## Model Evaluation

Using PromptFoo to evaluate different prompts against 50+ models and providers

Accuracy and speed

Different sites may need different accuracy and speed requirements

----

## Real-Time Personalization Engine

Browsing and queries adapt content instantly to user personas

* Morning Minimalist
* Craft Barista
* Traveller
* Non-Barista
* Office Manager
* ...

----

## Recommendations Adapt Instantly

Hero, product cards, blog feed, and navigation change based on persona

Call-to-action and navigation links are tailored for each persona

----


## "For You" Proactive Generation

Passive Browsing Signals: Tracks page visits, scrolls, quiz answers, and product interactions

Transforms user activity into a personalized natural-language query

----

## "For You" Proactive Generation

Prefetched page appears as a navigation link for immediate viewing

Re-triggers when user context changes, ensuring up-to-date personalization

---


# Query Generation: Intent Mapping

----

## AI-Powered Page Creation

Queries trigger dynamic, personalized pages

Intent classification: Queries are mapped to **distinct intent types** and journey stages

AI chooses relevant blocks and follow-up suggestions based on user needs

---


# Block Palette: Dynamic Composition

----

## Intent-Driven Block Selection

----

AI composes pages from a rich block palette to match user intent

Frontend blocks enable dynamic, personalized page assembly

Block sequence adapts to each user's goals and journey stage

Includes products, guides, interactive tools, media, and utilities

---


# Content Corpus: Rich Grounding

----

Grounding on products, guides, experiences, blog, tools, and bundles

Direct product comparisons help users make informed decisions

Product pages are tailored for different user personas, ensuring relevant recommendations

---


# Streaming Experience: Real-Time Build

----

Interactive Page Assembly: Recommendations and content blocks appear in real time as the page builds

Reasoning, block content, and images stream to the browser step-by-step

Users see the site adapt instantly — no single loading screen

---


# Demo

<!-- <img width="400" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"> -->

---

**Multiple Personalization Paths and Deep Context**
 <!-- — quiz, query, and proactive prefetch adapt content to user intent -->

**Intent-Driven Block Assembly**
 <!-- — AI selects blocks based on user goals and journey stage -->

<!-- **Deep Personalization via Context** -->
 <!-- — browsing signals and persona quiz drive tailored experiences -->

<!-- **Seamless Authoring & Publishing** -->
 <!-- — streaming generation and auto-persist enable fast, editable pages -->

**Flexible Model selection**
 <!-- — model selection based on goals is a must -->

---


<div class="container">

<div class="col">

[csanchez.org](http://csanchez.org)

[@csanchez](https://x.com/csanchez)<br>
[@csanchez.org](https://bsky.app/profile/csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg](https://github.com/carlossg)

</div>

<div class="col">

<img width="50%" data-src="../assets/blog-qr-code.png">


</div>
</div>


<a href="http://adobe.com"><img width="400" data-src="../assets/Adobe_Wordmark_RGB_Red_2024.svg" alt="Adobe logo" style="background:white"></a>
