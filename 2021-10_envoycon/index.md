<style>
.container{
    display: flex;
}
.col{
    flex: 1;
}
</style>

## Dedicated Infrastructure in a Multitenant World

<a href="http://adobe.com"><img width="400" data-src="../assets/Adobe_Corporate_Horizontal_Lockup_Red_RGB.svg" alt="Adobe logo" style="background:white"></a>

Carlos Sanchez /
[csanchez.org](http://csanchez.org) / 
[@csanchez](http://twitter.com/csanchez)


---

Cloud Engineer

[Adobe Experience Manager Cloud Service](https://www.adobe.com/marketing/experience-manager/cloud-service.html)

Author of Jenkins Kubernetes plugin

Long time OSS contributor at Jenkins, Apache Maven, Puppet,…

---


# Adobe Experience Manager

----

Content Management System

Digital Asset Management

Digital Enrollment and Forms

Used by many Fortune 100 companies

----

An existing distributed Java OSGi application

Using OSS components from Apache Software Foundation

A huge market of extension developers

---




# AEM on Kubernetes

----

Running on Azure

18+ clusters and growing

Multiple regions: US, Europe, Australia, Singapore, Japan, more coming

Adobe has a dedicated team managing clusters for multiple products

----

Customers can run their own code

Cluster permissions are limited for security

Traffic leaving the clusters must be encrypted

----

Using namespaces to provide a scope

* network isolation
* quotas
* permissions

----

More details on our Kubernetes setup in my KubeCon 2020 talk

https://tinyurl.com/csanchez-kcna20

![](https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D1-NONkbI0Ec%26list%3DPLHsuXkXI4xdjGlGkCBdxIAmkzfWXqsUrO%26index%3D1&size=150x150&margin=0)


----

## Dedicated Infrastructure

Customers want to have dedicated infrastructure

* Egress IPs
* Private connections (VNET peering, Private Link, ExpressRoute, Direct Connect,...)
* VPN

---



<!-- 

# First Version: Squid


Running Squid Proxy in VMs



<img data-src="kubeconeu-2021-squid.svg">

Load Balancer in front of VMs gives a dedicated egress ip



<img data-src="kubeconeu-2021-squid.svg">

JVM is configured with Squid as HTTP proxy for transparent forwarding



<img data-src="kubeconeu-2021-squid.svg">

k8s network policies prevent one tenant to access a different tenant proxy



<img data-src="kubeconeu-2021-squid.svg">

Each tenant gets a VM auto scale set and a Load Balancer



<img data-src="kubeconeu-2021-squid.svg">

All VMs run in a VNET peered to the k8s cluster VNET



## Squid Version: Pros

Simple and transparent config in JVM using http proxy system properties

VNET peering makes traffic private



## Squid Version: Cons

Proxy authn/authz is not well supported, needs network policies

Only works for http/s protocol

Http traffic is not encrypted

Does not support other use cases (VPN, private connections,...)


-->






# Envoy


Running Envoy on VMs and pod sidecars in Kubernetes

----

<img data-src="kubeconeu-2021-envoy.svg">

Each tenant gets a VNET, a VM auto scale set and a Load Balancer

----

<img data-src="kubeconeu-2021-private-connection.svg">

VNET can be privately connected to customer network

----

<img data-src="kubeconeu-2021-lb-public.svg">

Load Balancer in front of VMs gives a dedicated public egress ip

----

<img data-src="kubeconeu-2021-lb-private.svg">

Private Load Balancer gives a dedicated private egress ip

----

<img data-src="kubeconeu-2021-proxy.svg">

JVM configured with Envoy sidecar as HTTP proxy


----

<img data-src="kubeconeu-2021-tunnel.svg">

HTTP2 tunnel between sidecar Envoy and VM Envoy with mTLS

----

## Envoy: Pros

Simple and transparent config in JVM using http proxy system properties

Any protocol supported using different listeners in sidecar

All traffic is encrypted

----

## Envoy: Pros

VNET allows configuration of VPN, private connections at cloud level as a service

mTLS prevents unauthorized connections and one tenant to connect to another tenant Envoy

----

## Envoy: Cons

Needs one set of certificates for each tenant for sidecars and VMs

rotation, expiration,...

---









# Envoy Sidecar

----

## Envoy Sidecar

<img data-src="kubeconeu-2021-listeners.svg">

One listener with TcpProxy filter for http/s.
`HTTP CONNECT` gives Envoy the destination

----

## Envoy Sidecar

<img data-src="kubeconeu-2021-listeners.svg">

One listener for each non http port.
Destination hardcoded in `tunneling_config`

----

## Envoy Sidecar

<img data-src="kubeconeu-2021-listeners.svg">

One cluster with the VM Envoy LB as endpoint and TLS `transport_socket` config

----

### Envoy Sidecar: Http Listener

```yaml
- name: listener_0
  "@type": type.googleapis.com/envoy.config.
  listener.v3.Listener
  address:
    socket_address:
      protocol: TCP
      address: 0.0.0.0
      port_value: 3128
  filter_chains:
  - filters:
    - name: tcp
      typed_config:
        "@type": type.googleapis.com/
        envoy.extensions
        .filters.network.tcp_proxy.v3.TcpProxy
        stat_prefix: tcp_stats
        cluster: cluster_0
```

----

### Envoy Sidecar: Non Http Listener

```yaml
- filters:
  - name: tcp
    typed_config:
      "@type": type.googleapis.com/envoy.extensions.
      filters.network.tcp_proxy.v3.TcpProxy
      stat_prefix: tcp_stats
      cluster: cluster_0
      tunneling_config:
        hostname: mysql:3306
```

----

### Envoy Sidecar: Cluster

```yaml
- name: cluster_0
  "@type": type.googleapis.com/envoy.
  config.cluster.v3.Cluster
  type: logical_dns
  typed_extension_protocol_options:
    envoy.extensions.upstreams.http.v3.
    HttpProtocolOptions:
      "@type": type.googleapis.com/envoy.extensions.
      upstreams.http.v3.HttpProtocolOptions
  respect_dns_ttl: true
  load_assignment:
    cluster_name: cluster_0
    endpoints:
      - lb_endpoints:
          - endpoint:
              address:
                socket_address:
                  address: envoy_vm
                  port_value: 443
```

----

### Envoy Sidecar: Cluster

```yaml
  transport_socket:
    name: envoy.transport_sockets.tls
    typed_config:
      "@type": type.googleapis.com/envoy.extensions.
      transport_sockets.tls.v3.UpstreamTlsContext
      common_tls_context:
        tls_certificate_sds_secret_configs:
          - name: upstream_cert
            sds_config:
              path: /var/lib/envoy/sds.yaml
        tls_params:
          tls_minimum_protocol_version: TLSv1_2
        validation_context_sds_secret_config:
          name: upstream_cert_ca
          sds_config:
            path: /var/lib/envoy/sds-ca.yaml
```

---




# Envoy VM

----

## Envoy in VM

<img data-src="kubeconeu-2021-listeners.svg">

One `HttpConnectionManager` listener with `CONNECT` upgrade

----


## Envoy in VM

<img data-src="kubeconeu-2021-listeners.svg">

One `dynamic_forward_proxy` cluster for all destinations

----

### Envoy in VM: Listener

```yaml
- name: listener_0
  "@type": type.googleapis.com/envoy.config.listener.v3.Listener
  address:
    socket_address:
      protocol: TCP
      address: 0.0.0.0
      port_value: 443
  filter_chains:
  - filters:
    - name: envoy.filters.network.http_connection_manager
      typed_config:
        "@type": type.googleapis.com/envoy.extensions
        .filters.network.http_connection_manager.v3.
        HttpConnectionManager
```

----

### Envoy in VM: Listener

```yaml
route_config:
  name: local_route
  virtual_hosts:
  - name: local_service
    domains: ["*"]
    routes:
      - match:
          connect_matcher: {}
        route:
          cluster: dynamic_forward_proxy_cluster
          upgrade_configs:
            - upgrade_type: CONNECT
              connect_config: {}
      # needed to be used as a proxy with http (not s)
      - match:
          prefix: "/"
        route:
          cluster: dynamic_forward_proxy_cluster
```

----

### Envoy in VM: Listener

```yaml
http_filters:
- name: envoy.filters.http.dynamic_forward_proxy
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.
    filters.http.dynamic_forward_proxy.v3.FilterConfig
    dns_cache_config:
      name: dynamic_forward_proxy_cache_config
      dns_lookup_family: V4_ONLY
- name: envoy.filters.http.router
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.
    filters.http.router.v3.Router
upgrade_configs:
  - upgrade_type: CONNECT
```

----

### Envoy in VM: Listener

```yaml
transport_socket:
  name: envoy.transport_sockets.tls
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.
    transport_sockets.tls.v3.DownstreamTlsContext
    common_tls_context:
      tls_certificate_sds_secret_configs:
        - name: upstream_cert
          sds_config:
            path: /var/lib/envoy/sds.yaml
      tls_params:
        tls_minimum_protocol_version: TLSv1_2
      validation_context_sds_secret_config:
        name: upstream_cert_ca
        sds_config:
          path: /var/lib/envoy/sds-ca.yaml
    require_client_certificate: true
```

----

### Envoy in VM: Cluster

```yaml
- name: dynamic_forward_proxy_cluster
  "@type": type.googleapis.com/envoy.config.cluster.
  v3.Cluster
  connect_timeout: 30s
  lb_policy: CLUSTER_PROVIDED
  cluster_type:
    name: envoy.clusters.dynamic_forward_proxy
    typed_config:
      "@type": type.googleapis.com/envoy.extensions.
      clusters.dynamic_forward_proxy.v3.ClusterConfig
      dns_cache_config:
        name: dynamic_forward_proxy_cache_config
        dns_lookup_family: V4_ONLY
```

----

### Envoy in VM: SDS

```yaml
resources:
  - "@type": type.googleapis.com/envoy.extensions.
    transport_sockets.tls.v3.Secret
    name: upstream_cert_ca
    validation_context:
      trusted_ca:
        filename: /etc/envoy/certs/cacert.pem
      # only allow connections with certificates
      # that have this SAN
      match_subject_alt_names:
        - exact: "envoy_sidecar"
```

---

# Certificate Rotation


----

## Certificate Rotation

Using Vault Agent to generate short lived certificates (sidecar and VM)

CA stored in Vault

Kubernetes and Azure passwordless authentication to Vault

----

### Envoy Sidecar: SDS

Configuring certificates as SDS in separate files to ensure certificates are automatically reloaded on change.

```yaml
resources:
  - "@type": type.googleapis.com/envoy.extensions.
    transport_sockets.tls.v3.Secret
    name: upstream_cert
    tls_certificate:
      certificate_chain:
        filename: "/etc/envoy/certs/tls.crt"
      private_key:
        filename: "/etc/envoy/certs/tls.key"
```

----

### Envoy Sidecar: SDS-CA

```yaml
resources:
  - "@type": type.googleapis.com/envoy.extensions.
    transport_sockets.tls.v3.Secret
    name: upstream_cert_ca
    validation_context:
      trusted_ca:
        filename: "/etc/envoy/certs/cacert.pem"
```

----

## Certificate Rotation: Alternatives

Can use certmanager to do the rotation

only in K8S

Spiffe is another option

---





# Envoy Debugging


----

## Envoy Debugging

TLS connection errors only show up in `connection` component debug logs

Client only sees socket closing messages

----

### `OPENSSL_internal` Errors

`KEY_VALUES_MISMATCH` <small>`[warning/config]`</small><br>
key does not match cert

`SSLV3_ALERT_CERTIFICATE_EXPIRED` <small>`[debug/connection]`</small>

`CERTIFICATE_VERIFY_FAILED` `SSLV3_ALERT_CERTIFICATE_UNKNOWN` <small>`[debug][connection]`</small><br>
cert SAN does not match expected SAN


----

Example: certificate SAN does not match `match_subject_alt_names`

VM side

```
envoy_vm_1     [debug][connection]
[source/extensions/transport_sockets/tls/ssl_socket.cc:224]
[C0] TLS error: 268435581:SSL routines:
OPENSSL_internal:CERTIFICATE_VERIFY_FAILED
```

Sidecar side

```
envoy_sidecar_1 [debug][connection]
[source/extensions/transport_sockets/tls/ssl_socket.cc:224]
[C1] TLS error: 268436502:SSL routines:
OPENSSL_internal:SSLV3_ALERT_CERTIFICATE_UNKNOWN
envoy_sidecar_1 [debug][connection]
[source/common/network/connection_impl.cc:241]
[C1] closing socket: 0
```



---




# How is it Used

* http/s: as a http proxy
* other ports: open port in localhost

----

## HTTP Proxy: Java

[System properties](https://docs.oracle.com/javase/8/docs/technotes/guides/net/proxies.html)

* `http.proxyHost` & `http.proxyPort`
* `https.proxyHost` & `https.proxyPort`
* `http.nonProxyHosts`

----

## HTTP Proxy: Java

Apache HTTP client ignores proxy by default

```java
HttpClient httpClient = HttpClientBuilder.create().
  useSystemProperties().build();
```

----

## Long Running Connections

Connection pools or long running connections ar typical (ie. db)

Configure `max_stream_duration` and `stream_idle_timeout`

Increase load balancer timeouts

----

## Connection Pools

Must configure connection pools to validate connections before use

In JDBC drivers it is a configuration option

----

## Envoy Tweaks

Some defaults can to be tweaked on the VM side listener

```yaml
typed_config:
  "@type": type.googleapis.com/envoy.extensions
  .filters.network.http_connection_manager.v3.
  HttpConnectionManager
  common_http_protocol_options:
    # do not reset connections if they are not idle, set to 24h
    max_stream_duration: 86400s
  # increase the stream idle timeout, it ignores tcp keepalives
  stream_idle_timeout: 7200s
```

----

## HTTP Proxy: httpd

```
SSLProxyEngine on
 
ProxyRemote "https://example.com"
  "http://${HTTP_PROXY_HOST}:${HTTP_PROXY_PORT}"
ProxyPass "/somepath" "https://example.com"
ProxyPassReverse "/somepath" "https://example.com"
```

httpd sends proxy requests with `CONNECT HTTP/1.0`

we need to set
`http_protocol_options.`
`accept_http_10`

---






## Envoy Config: Resources

envoyproxy.io

[arch_overview/http/upgrades](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/http/upgrades)

[sandboxes/tls](https://www.envoyproxy.io/docs/envoy/latest/start/sandboxes/tls)

[sandboxes/double-proxy](https://www.envoyproxy.io/docs/envoy/latest/start/sandboxes/double-proxy)

<img style="vertical-align:middle" data-src="https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fwww.envoyproxy.io%2Fdocs%2Fenvoy%2Flatest%2Fintro%2Farch_overview%2Fhttp%2Fupgrades&size=150x150&margin=0">

<img style="vertical-align:middle" data-src="https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fwww.envoyproxy.io%2Fdocs%2Fenvoy%2Flatest%2Fstart%2Fsandboxes%2Ftls.html&size=150x150&margin=0">

<img style="vertical-align:middle" data-src="https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fwww.envoyproxy.io%2Fdocs%2Fenvoy%2Flatest%2Fstart%2Fsandboxes%2Fdouble-proxy&size=150x150&margin=0">

----


<div class="container">

<div class="col">

[csanchez.org](http://csanchez.org)

<img height="64px" style="vertical-align:middle" data-src="../assets/twitter-logo.png">[csanchez](http://twitter.com/csanchez)

<img height="64px" style="vertical-align:middle" data-src="../assets/GitHub-Mark-64px.png"> [carlossg](https://github.com/carlossg)

</div>

<!-- <div class="col">
    <img width="80%" data-src="../assets/magritte.png">
</div> -->

<div class="col">

<img width="50%" data-src="../assets/blog-qr-code.png">


</div>
</div>


<a href="http://adobe.com"><img width="400" data-src="../assets/Adobe_Corporate_Horizontal_Lockup_Red_RGB.svg" alt="Adobe logo" style="background:white"></a>
