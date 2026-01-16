15:05:22  – 15:05:52
 Hello, thank you for being here. I'm going to talk to you about rollouts, can I roll out and AI? I'm not just not going to talk to you about it, but I'm going to show you how can you how to make progressive delivery while else.

15:05:52  – 15:06:22
 canary routes using AI to do automatic production fixes on the fly. So, where with me, I'll show you this at the end. So, I'm a principal scientist at Adobe Carlos and work on the Office of the Management Service running on Kubernetes. Scooter net is all the way down. And I've been, you may know me for being around for a long time in the open source.

15:06:22  – 15:06:52
 community, who is here at some point. So before I start, whose here is using Kubernetes? Please raise your hand. Like everybody? Okay. Here is using some sort of canary deployments on production. Just a few people. Okay. The rest. Well, you will see how you can do. We will see how you can do.

15:06:52  – 15:07:22
 it easily. So progressive delivery start with an introduction. It's a name that is kind of new, but it's includes techniques that have been around for a while. So it's all this deployment strategies that try to avoid this or or nothing deployments. So you don't want to deploy something to all your customers at once in case you break something.

15:07:22  – 15:07:52
 and then you want to do somehow progressively make changes in production. So on this progressive delivery world, you want new versions to be deployed to not replace what you have, but run in parallel for a period of time, and then you receive life production traffic, and then decide whether the new version behaves correctly for whatever term.

15:07:52  – 15:08:22
 of corrective means. And if that goes through, then you consider the roll-on-successful, if it fails, then you have a way to roll back quickly. I'm all enough to remember this from like a year ago. When cross-strike deploy something to production and took down half of the internet.

15:08:22  – 15:08:52
 So this was a cross strike saying they deploy some content and then they realize this broke everybody and then had to roll it back and involve a very hard rollback mechanism. The root cause analysis here was very interesting to read and one of the things that they came up with as how to avoid this happening in the future, like Blameless Port

15:08:52  – 15:09:22
 and we went to learn from not only warm mistakes, but other people's mistakes. And one of the things they said was here somewhere, the new template instances that have passed and are testing are to be successfully promoted to wider deployment reasons, they call it rings, other people call it waves. But basically, you deploy somewhere to check that that's correct, you add more customers, and then you check that that's still working.

15:09:22  – 15:09:52
 and keep adding these rings through different rings, depending also on how critical these customers are. Other companies will do it like internal employees first. You deploy internal employees. You can do this based on IPRG, and have there's whatever you want. And then you do a subset of different customers, maybe something that is low risk for something that is higher risk or has more traffic later.

15:09:52  – 15:10:22
 So, and they allow for back in time between these different deployments to the range to gather metrics and telemetry of surf what's the impact of this change is before keep rolling it. So you don't deploy to all our users as ones as they learn the hard way, you deploy on these waves or rings. So this is the reason you want to do this is you want to avoid downtime.

15:10:22  – 15:10:52
 And if something goes wrong, you can quickly roll back. Limit the blast radius, only a few customers get accepted, impacted, because you roll as small percentage as or portions of your user base at once. And it also allows you to get faster to production because you have all these safety nets and you can deploy things that you know, okay, if this breaks.

15:10:52  – 15:11:22
 I'm not breaking everything in production. I may break some internal employees website or whatever. So that depends on your, I don't know, aversion to failure in your organization. So what are the progress of the limiting mix that have been around, rolling updates? This is something that Kubernetes has us by default. This means every time you make a change to other countries so they're plus within aggressive are tough stuff, waiting for

15:11:22  – 15:11:52
 you get a new pod and set of pods up and how many you have running. When there's a lot of pod is ready and all pod is deleted, you get another new pod. When that's ready and all one is deleted. And that way, if you're always sending a bit of typically, you would send a bit of traffic automatically to these new pods. And as the old pods get deleted.

15:11:52  – 15:12:22
 more traffic is handled by the new pods. If you want, if you realize that something is broken, you just roll this back and only a percentage of traffic gets impacted. If you are using just the default Kubernetes way. Looking at the deployment, you have two versions, well, let's say you start with version one, which is green here. You deploy version.

15:12:22  – 15:12:52
 to a complete copy on version 2 and at some point you decide, okay I'm going to send traffic, you test it and I'm going to send traffic to version 2. If everything goes well, you kill version 1. If everything goes, if anything goes bad, you just point the load balance or back to version 1 or your DNA or whatever it is and then you have very quick rollback. The problem with blue.

15:12:52  – 15:13:22
 And the reason we're doing is that the unit typically twice as many resources and you are sending all the traffic to the new version at once when you are doing the switch. So all your, or a lot of your users could get impacted before you realize that you need to roll back. Larry deployment is a specialized version where you have a no.

15:13:22  – 15:13:52
 version, the green version, you have the new version of the blue version. And then you start sending traffic to that new version based on differing parameters that you decide, whatever it is. So you could be internal employees, go to the new version, or a percentage of traffic, 5% of the traffic goes to the new version. And then you keep moving this percentage until you reach the whole production. And then you start.

15:13:52  – 15:14:22
 you can delete all things as you move forward, you can delete all stuff. So you also have a quick rollback, not all the profits are affected, if you make a mistake. And if I was gonna say, you can have very granular, you just see what dirt it does.

15:14:22  – 15:14:52
 control of what you are sending to the new version. And you could do this over minutes, ours, even days if you wanted to, probably not agree to that, but you could. Dar launching is another variation of this where you are getting new features and only allowing those new features or new version to a specific set of people. So you launch something and use new.

15:14:52  – 15:15:22
 only let some people see it. And feature flags is even more granular. It's not so much as the operational level like the other ones, but you can combine this with all the other ones too. You can have feature flags saying, I want to deploy. I'm going to make this new feature, but it's going to be off by default. You split, call the deployment versus feature.

15:15:22  – 15:15:52
 enable them, enable them. Typically, when you apply a universal, old-style new features go in and people can start using them. We feature flashes. OK, I write a new feature. I put it in my code, but it's not enabled. I ship the code. The feature is that not enabled. And over time at some point, I can say, oh, I want to enable this particular feature for this group of people. And then you enable that.

15:15:52  – 15:16:22
 flag it could be using features like servers. There's open source ones. There's open, I think, open feature flag. One of them. Open feature. Or you can do just basic environment variables, anything like that, more simple. But this is very cool because it allows you to enable features for the specific customers without enabling them for everybody. See how those work.

15:16:22  – 15:16:52
 maybe you don't know if they, you are going to be able to cope with the load with when you make a change or not. So you can enable it for the only a percentage of the users. Check the load. Okay, the load is good. Oh, it's more loaded and we expect it or it's costing some errors here and there. We can stop the feature flagging and then you can fix it and keep it the rating. And it allows you to ship faster because these things you then you can quickly enable this...

15:16:52  – 15:17:22
 able them without having to do a new whole deployment process build as the deploy and so on. So I like to say that monitoring is a new testing because you want to know when user's are experiencing issues in production, and more importantly you want to react to these issues automatically. So if you have good metrics or good feedback, you can react to these things automatically, you can roll back things automatically based on.

15:17:22  – 15:17:52
 metrics for instance. And something that happened to me, and if you haven't automatically destroyed something by me state, that means you're not trying to automate enough. You always try to automate more things, and then at some point you're like, okay, maybe I went a bit too far, and it just there by. So how does this apply in the real world? In the real world world world, every environment you hear uses Kubernetes. And so forth,

15:17:52  – 15:18:22
 So, on Kubernetes there's this service architecture where you typically, you would have a lot balancer, you would have traffic going from the load balancer outside of the cluster into services and from those services into pods. That was the initial service architecture of Kubernetes. So different pods have labels, some base on those labels, their group on services and the load balancer depending on.

15:18:22  – 15:18:52
 what's not which headers, the main name, whatever it goes to one service or another. There's the English architecture that is more recent, where you have an English layer on the Kubernetes cluster. And this is like any other Kubernetes service, where when the traffic gets into the English layer, then based on rules and you have more flexibility.

15:18:52  – 15:19:22
 that with the previous model, you could send some domains to some services, some paths to some services, some headers to some services, and you can do a very fine granular configuration. So this helps when doing things like canary. You have a bunch of English controllers, every cloud provider has their own, like AWS, GCE, and then you can...

15:19:22  – 15:19:52
 have a you have open source ones that are based on NGNX, Ambassador, is based on envoy, East Hill which is service mesh also has their own ingress, HIP proxy and so on. So you can choose the one whatever one you want, whatever one works best for you. Now enter Argorolos, who's here, knows about Argor in general. Wow okay. Let me have a minute. Argorolos. Argorolos.

15:19:52  – 15:20:22
 not see the just roll out. Okay, that's a few people. Okay. So I guess everybody here about, most people here about our capacity, maybe our goal, workflows, there's another product from the our goal community, our goal, our goal routes. That provides these advanced capabilities of doing blue green, canary, analysis, experimentation, all these progressive delivery features into Kubernetes. And it allows you to.

15:20:22  – 15:20:52
 It's very easy to do. So you can do blu-green, canary analysis is where you decide based on metrics or some backend is this roll out something that needs to be rolled back or not. Is this something good to go or can be rolled back? Experimentation is very interesting because you can say, I want a new version to run for a period of time and then kill it just together, metric.

15:20:52  – 15:21:22
 at Adobe, we were, I think one of the ideas was maybe we can run Java rates. So you run, you want to upgrade Java, you think you got it, you run it for a few hours, gather the metrics, is this providing the same response rates as the old one, is the latency good, all these things are going, well, before actually rolling out. So this experiment has a lot of potential to do this

15:21:22  – 15:21:52
 sort of testing whenever you want. How our work is you have a rollout controller, like in any corner is a network of the controller. And you have a new object that is called a rollout. This rollout defines what analysis is to run, based on analysis templates. Some sort

15:21:52  – 15:22:22
 you could say, OK, my template is, go to Prometheus, check for this metric, and make sure that this metric is over this value. So or under, whatever. So you could say, I want go to Prometheus. I want 500 errors to be under 1% in order to consider the new version successful. So when there's a new, when you change the rollout object, or you can have the rollout linked.

15:22:22  – 15:22:52
 the deployment. When you change the rollout or deployment object and I'll show you this in the demo, what are those it creates a different replica sets, replic sets are the underlying object behind deployments on Kubernetes. So you have a stable one and are a great secondary one and then it increases based on the rules you say you set on the rollout, it increases the number of bots in one and decreases the one in the other.

15:22:52  – 15:23:22
 So, over time, you will have more canary pods, less stable pods, depending on the rules you set. If you are using service mesh or any advanced ingress that Argo rollout supports, you can also do verifying grain routing. So, you could say, I want...

15:23:22  – 15:23:52
 request with this header to go to the canary. I want request with this going to this path to go to the canary. You can do more advanced fine grain selection of traffic. So some of the things that are supported is promissius. Kate, to read his jobs, is very interesting. Also because you can just do whatever you want in this job.

15:23:52  – 15:24:22
 You can tell Argo, launch a job, hit the metrics. You can tell, you can tell Kubernetes or Argo, launch this job. And in that job, you can do whatever you want. And if that job passes, Argo will consider that the rollout is passing. So you could check some back and you could go and check some database. You could do whatever you want. So it's very flexible in that sense.

15:24:22  – 15:24:52
 Let's do the demo and bear with me because it's going to be, let's hope it's, is it to follow? We're going to have some source code that is deployed. We're going to have a canary running. There's going to be an analysis and in this demo, instead of doing an analysis with permissions or anything, I'm using AI.

15:24:52  – 15:25:22
 Why would you ask why do I use a AI because I can't and because otherwise the talk would not accept it here, right? So you are using AI for log analysis It has use cases You will say so AI I send in the locks to an LLM. I'm using jaminai in this case Really amni and then the AI will tell me okay based on this locks should they promote

15:25:22  – 15:25:52
 it or not. If I promote it, it goes to production. If the lentil is not to promote it, it rolls it back automatically. And then there's going to be something else that needs to be done. By a human, probably. So bear with me on the demo. I'll try to show you what I have here, right? Okay. So I have the demo running here. I need to have us.

15:25:52  – 15:26:22
 service. Okay. I have a rollout. Can you see it? Fine. Yes. Okay. So on the left hand side, you can see the article gives you a bit of command line view. And it's for somebody who is blinking too much. It's just blinking. And I saw only blinking in my screen. So they're good. And I have this version.

15:26:22  – 15:26:52
 called blue here and it's written in blue on the website. So if I go and do I upgrade and I'm gonna upgrade the rightly changes the image name because yellow I'm gonna set the image to green and my rollout process is very quick just for the demo Every ten seconds

15:26:52  – 15:27:22
 the consequences are going to go to 20% more and more. So over time, I'm getting more green dots. And because I'm getting on the left hand side, I'm getting, it's blinking there too. I'm getting two new pots. I'm getting, I have four old pots now. That's really. And it's switching, creating more new pots, that are taking more traffic. So the new pots, I'll bring the old pots are in.

15:27:22  – 15:27:52
 And here at the bottom I have the looks, but let's wait, it's in weight is 60, so I 60% out of 100. And it's 20% every 10 seconds wait between things. So if I go and get analysis wrong, this is an object that argued us, that creates. I can see an analysis.

15:27:52  – 15:28:22
 run happening in the last 57 seconds. Let's wait, see if this finishes. Okay, we are now at 100%. So all the dots are now green. So it went through the rollout. Everything was fine. It moved. How it was decided that everything was fine. Let's describe this analysis around. Several. Third. Last 65 seconds. The first person that got

15:28:22  – 15:28:52
 And Gemini, I send the logs to Gemini, and Gemini tells me, okay, here is, the stable version consistently returns to 100 blue, the canary version returns to 100 ring, both versions return at 200 status code, based on the logs the canary version seems to stable. Nothing too complex, but this is just the demo, but this gives you an idea of you could ask for more complicated things if you wanted.

15:28:52  – 15:29:22
 Now let's see what else can I show you here. Let's say I want to deploy a new version. That is not so good. So it is doing the same for one second. That.

15:29:22  – 15:29:52
 This version is going to return multiple colors. And so the rollout is starting. And there is one part running the canary. You're getting some random colors in the middle. And here is now two parts are running the canary. And the old ones is it was four. But here, if maybe should have stopped this.

15:29:52  – 15:30:22
 So it stops blinking. Yes. Automatically, yeah, we can see here that it went back to all green again. So there was a period of time where some traffic went to the new version that returned random colors and then it went back to the green automatically. I didn't have to do anything. Trust me. And then...

15:30:22  – 15:30:52
 Here I see the gradient on the status. Let's go look at analysis. Okay, I think I lost it. Let's play it vertically. Yes. So, let analysis run. Yes.

15:30:52  – 15:31:22
 And analysis round. 90 seconds ago, I have a fail one. And this will tell me why. So the analysis says the stable version returns 200 and corrects it can change impacts on new vehicles and products with colorguring.

15:31:22  – 15:31:52
 The narrative version returns some mix of colors, purple, blue, green, or in the yellow, in those colors, along with several panic errors due to runtime error in this out of range with lens zero. This indicates that the canary version has a back and should not be promoted, the error occurs in the get-color function. So I took the logs of the stable, took the logs of the canary, compare them and says, this is not working well. And I get, when I, when I'm ready to go to LLM, is,

15:31:52  – 15:32:22
 Tell me in a JSON format, should I promote it or not? And here, promote these false. And what confidence level do you have? And here is 95. So 95 is 95% certain that I should not promote it. And therefore, our goal does the rollback. And I'm using the Dmni20 flash model, metric fail, the result is failed, analysis result is failed.

15:32:22  – 15:32:52
 analysis run. Okay, so the last, this are the two, the two in the middle are the ones from this demo and one was successful, the other one was failed. Now you say, okay, this is interesting, I can do more complex things to analyze logs and analyze anything you want. And I can use an LLM to do it, not just because it's more expensive, but it will

15:32:52  – 15:33:22
 provide some value, hopefully at some point. If we go here, the other thing that this plugin, I'll say this is a plugin for Argor Olaughts. You can write your own plugins. This is a, I put it on Pensors and it's going to the intention is to get it contributed to the Argor project. This plugin, what it does also. So if I go to my demo, roll it.

15:33:22  – 15:33:52
 I'm a three minute circle. I have a great idea right, GitHub issue for me. So while it's setting the in my plugin is if the promotion fails, go on create a GitHub issue with until go to the LLM and say, which title and which content should they issue have. So the LLM has created. This the same.

15:33:52  – 15:34:22
 Okay, can I read the plumbing for the real analysis? The canary is failing due to runtime error, blah, blah, blah. There's also in 500 errors, multiple colors. It's getting confused with the colors, because it's different. That's fine. It's showing a runtime error with a length 0. And the panic suggests that this function is trying to access an element of the index 0. Here makes sense. Establed logs, canary logs, and the panic.

15:34:22  – 15:34:52
 So, and the bunch of recommended actions. Now, so now I got an issue automatically created. Okay, that saves some time. But what else? I can do a sign to compile it. That sometimes it works automatically sometimes it doesn't. Need to figure out why. Okay, I'll assign it to compile it. Now it wants to install.

15:34:52  – 15:35:22
 Oh, I said it had a word. It's the internet. Now it's assigned to compile it. But the one thing I did was label it with this jules label. So here, jules is a Google Labs coding agent that you can invoke in your issues and will basically go on fixed and for you. Same thing as a GitHub.

15:35:22  – 15:35:52
 of compile it. So, you'll sell, oh, I'm on it, you will see another comment, ready for our review. So, between five minutes and three minutes, while I was talking, maybe having a coffee, maybe just not doing anything. It did a great appear for me. Compilated was a bit of love because I had to click on it. Let's go to the pull request. So, the two ones that work.

15:35:52  – 15:36:22
 created one is was okay so the two times a click went two times but let's go to this one. Anyway you can use this dual-strong Google that's compile the from it up you can use cloud code whatever if you have the pro version you can use also the coding agent and dual-scrated this pull request that says okay course that

15:36:22  – 15:36:52
 Yeah, you can talk to me, whatever. The test is failing. Like, I'm sorry, it's a point in your nose. It removal the section that I added. I had to add an error that was not very obvious. So it removed the whole section that I added, which is good, because that was useless. But for whatever reason the tests are not passing this time, which is surprising. So we do have a scene that will also fit the linearly unseen triangle snake. If we were to put tornadoes in the ouvриbodus's dale show, we could have our original weapon run now. So as players fall apart and it's not really much better than it was, you could have

15:36:52  – 15:37:22
 some, let's, we can take a look here. We'll make it even successful. Important and useless. It didn't remove an import. Okay, right. This is not useful. So this is the dual center phase. If we have time later, we can go for it. Come on, duals.

15:37:22  – 15:37:52
 And if Copilot does Copilot, same thing, it goes with a plan. And initial plan, it started working one minute ago, so that's going to take a little bit. It hasn't done any changes yet. So we can go and look at the Canary, sorry, the Dules. Make it bigger. So it's basically what you would do in your local laptop with one coding assistant. It just does it for you on an issue up.

15:37:52  – 15:38:22
 and comes up with this with whatever suggestion creates the PR up this appearance. So let's see, it's too bad because I cannot merge the fix. This one is the broken one, but if we look at the previous one here from Duel's, what did it do? Here it changed a little bit differently, it fixed the product.

15:38:22  – 15:38:52
 Now, I didn't remove the whole section that we used, and added a test. So depending on which time you execute it, you get different results as with everything AI. And copilot in the previous one, it did remove the string same port, remove the function, and also added a test. And I think this past.

15:38:52  – 15:39:22
 Yeah, the one interesting thing with with Copilot, it doesn't let you run the workflows automatically. You have to prove them because I guess Kit helped us in trust. They don't want you to trust it too much, maybe. And so I have to prove the workflows for it to run. So, I'll show you this is the article roll.

15:39:22  – 15:39:52
 is UI where you can see the steps. So it was 20% pause for 10 seconds, for the 10 seconds, 60 seconds, 100. So this is what you can define it completely. I'll show you the code. But you also, you have the CLI, but you have the UI here. And this is Cloud Build. It was in the middle 20.

15:39:52  – 15:40:22
 this morning. Okay, and plant the ploy because the idea was if these passes I go and click a merge. And this is the plugin else and I'll give you the links in later. Come on, so this is not yet working, not yet suggesting something.

15:40:22  – 15:40:52
 So, yeah, Copilot is still in one of four tasks, still a bit stuck in there. But we could do this one was the good one, because you could do as many as you want, and you can even tell each other to reveal each other's pull requests. So let's go and merge this one. Now that one, I don't care.

15:40:52  – 15:41:22
 Jolo. Do I need to update? Because this was... That's quite a much. Yeah. The good thing is that you get nice code comments. And that nice git hub logs. This will require fixes, this critical thing, whatever. And it fixes everything and the others are test. So it must be good. I trust you. I want you to update your code.

15:41:22  – 15:41:52
 Okay, so this keeps running and let me show you then a bit of the code here. Okay, so the rollout, rollout with AI. It looks pretty much like the deployment. On Nargo, rollout, you can do the Canary, see the analysis. You pass which template uses this, which template to use for the analysis. Then you start.

15:41:52  – 15:42:22
 with the steps here in the steps set weight 20% pause this I think this is a null one but doesn't matter too much set weight 40 set weight 60 set weight 80 and then pauses in between and then you have the whole deployment specification from from Kubernetes standard so you can also point it to us

15:42:22  – 15:42:52
 deployment. So you can have rollout and deployment. And then the rollout, you say, okay, just control this deployment. The interesting bit here is you have two things, you have labels where you can say label the old pots in a way and label the new pots in a different way. This is very nice for, let's say you want to have a preview of what you are deploying of the canary. Or you want to send all the drafts.

15:42:52  – 15:43:22
 of your employees internal network, whatever, to the new version. You can route that traffic to the new version based on the labels that are architects. So you have the two labels in both ways. And the other thing is the templates. I go, well look at the template. And in the template I say, check every 10 seconds. So every 10 seconds is doing the analysis.

15:43:22  – 15:43:52
 I want the result to be over 50%. So if the confidence is over 50, if the LLM tells me to promote with a confidence of over 50%, just do it. And this is the plugin that I wrote where I say I want to use the Gemini model. And this is the GitHub URL. This is a label for...

15:43:52  – 15:44:22
 to create the issue and when Argo does the rollout it calls this plugin to do things. And the plugin is this ArtXamples. This is a Go project where you can do this one. Ah, this is.

15:44:22  – 15:44:52
 the plugin, the plugin is using hash corp, go lang, plugin format and the interesting bits is okay this is all the initialization. This was most of it, it was vibecoded, I want to create an argo plugin, do it like this and I want to function this way. So the AI part,

15:44:52  – 15:45:22
 is analyzed log with AI. The prompt is analyzed, this canary behavior, and respond mean this specific format that I want to understand and give me a number between 0100, telling me how confident you are of the promotion or not promotion. You can also pass extra prompt. I think I did it here. So on the AI analysis,

15:45:22  – 15:45:52
 template, you could say whatever you want, I think in this example, it's that don't care about the color of return because it's going to be different. So you could pass a specific prompt additions whenever you do this. And the plugin has two ways of working right now. One is in line, so this plugin goes on.

15:45:52  – 15:46:22
 Where is the LLM gets the promotion or not promotion information goes to GitHub-based issue? But also has a native mode. Where instead of doing all that, it goes and calls an agent using a2A. And this allows you to build an agent that understands your problem space better. So you can give it access to tools, the agent, the initial agent.

15:46:22  – 15:46:52
 this has access to keep CPL, but you could add more tools. You could have a different agent that has a different context, information, or more internal data, or I don't know. You want to go on and go into the database, go into zero, go into some other tools. You could do that. So that allows you to change agents and do this more advanced use cases. So let's look here.

15:46:52  – 15:47:22
 back if where is this standing okay this still failed still here this was merged let's see if this built 36 yes this was built this was just to be the hard to be deployed

15:47:22  – 15:47:52
 Yeah, so for room some reason okay, let's Let's get the analysis runs and In the last two minutes are still failed. Okay Why did it fail this time? This thing was written that the Okay

15:47:52  – 15:48:22
 The canary version is behaving differently than the stable version. It could indicate a bug or a new feature that needs further investigations since the color is ignored, the variety of responses to just an unintended change and does the canary should not be promoted. I told you to ignore the color. What did you not understand? Anyway, so you can see that it works perfectly all the times. vamos is perfect.

15:48:22  – 15:48:52
 is that it would just deploy automatically for you. So let's see. So, where you got it, right? You got all the things in the middle. So, what was at the end of this loop, and this is what is I think is important for AI and agente workflows. You need the loop that allow.

15:48:52  – 15:49:22
 Today I want to understand where it has errors or where it has successes. So, after the rollback, now, create the GitHub issue. Get one of these coding agents, whatever one you choose. You can also say, I mean, use an LLM directly and say, okay, clone the repo, make some changes, push it on, but not. But all these tools now give you coding agents. Generate the pullback less.

15:49:22  – 15:49:52
 the code changes and you go back into the loop. So I'm guessing if these works, I get another issue saying three minutes ago saying, we've got the wrong colors. Right? And now I have jewels working on it again and I'm going to have it working 24 hours until it fixes it. That does the thing, right? I can go and have a break and no problem. So it's magic. Oh, it's...

15:49:52  – 15:50:22
 It's already fixed. OK, what did you do this time? I said the random color just returned. Perfect. I like it. Ready? Yeah, it's ready. I thought about saying, this automatically merged it and everything. But then it will be too fast to show.

15:50:22  – 15:50:52
 Yes, OK. Pure Dahl. So an issue that was created sometime ago, and now it's fixed, everything works fine. So I think this is where the future goes. You don't want to work in one thing at a time. You have the machines that can work in 20 things at a time. And you just need to reveal that what they do is what you want them to do, which not always going to be the case. But there's a lot of TV stars that we...

15:50:52  – 15:51:22
 have to do that with and what I do. And so with that, I hope you understand how you can use in a more practical way AI with some more of the code, the development, and the deployments, and integrating the whole picture of it. And I saw this picture as like, I cannot put it in the presentation. So this is the world we're going to. Presentation 2 is the pilot Police is

15:51:22  – 15:51:52
 So, running out changes to all users, that one is risky. Canaries allows you to move or feature flags. And a combination allows you to make this safer. And you can use AI agents today to automate this loop, solving the issues for you and automatically fix them. So, this is totally possible too.

15:51:52  – 15:52:22
 there is not science fiction. And I for one welcome or new robot over the lots and yeah those are the URLs where you can get the code. The bar code is for the feedback of the session if you think is good. That's it if not that's not the right code. And so yeah thank you. I'll be around if you have questions later. Thanks.