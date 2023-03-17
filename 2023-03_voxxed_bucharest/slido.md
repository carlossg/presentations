## What is the default JVM heap size?

25% of container memory

## What is the default JVM Garbage Collector?

Java 11 or later: SerialGC or G1GC

Java 8: SerialGC or ParallelGC

Serial if <2 processors and < 1792MB memory available

## How many CPUs does the JVM think are available?


Java 11, 17, 18 older than October 2022 release

* 0 ... 1023 = 1 CPU
* 1024 = (no limit)
* 2048 = 2 CPUs
* 4096 = 4 CPUs

# In a host with 32 CPUs, and 2 JVMs with each 8 CPU requests/32 CPU limit, how much CPU can each use?

50%
