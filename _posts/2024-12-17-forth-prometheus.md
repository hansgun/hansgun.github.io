---
layout: single
#classes: wide
title: "Setup Prometheus on private k8s cluster"
date: 2024-12-17 16:16:01 -0600
categories: work
tags:
  - Prometheus
  - Loki
  - Tempo
  - Opentelemetry auto-instrument
author_profile: false
toc: true
toc_label: "On This Page"
toc_icon: "cog"
toc_position: sticky
---
# Prolog 
- 상용 SaaS Observability 툴은 modern한 그래픽과 편의성을 제공하지만(ex:Datadog), 사용량 base로 과금으로 최적화 하지 않은 Log, Trace 혹은 Profile 기능을 활용 시 과금 폭탄을 맞고 있다. 
- Open Source 이자, k8s 환경에 잘 적용되고, 빠르게 발전중인 Prometheus로 대체 하고자 현 운영중인 private k8s cluster에 prometheus stack을 적용한 이야기를 적어본다. 
- `trace` 기능 구현을 search 하던 중 `open-telemetry` 를 발견하였으며, 다시 구축한다면 `opentelemetry stack` 을 활용하여 scratch 부터 구성하겠지만, `kube-prometheus-stack` 의 편리함을 한 번 맛보고 ~~나니 돌아가고 싶지 않다.~~

## 0. 구성요소 - 설치한 내용
----
* Prometheus - [ kube-prometheus-stack ] 
* Loki - for log
* Tempo, Opentelemetry Agent - for trace
* Exporters - Redis, PostgreSQL

## 1. 환경 설정
----
- 필요 프로그램 
- k8s agent - connecto to cluster 
- helm 

### 1-1. 다운로드 환경 
#### 1-1-1. docker image download

- private cluster 에서 public docker image download가 불가능 하므로, CI/CD Agent 서버에서 이미지 다운로드 후 proxy 서버(Azure Artifacts)에 등록하여 k8s cluster에 설치 함
- 예제

```bash
## sharedprdacr.azureacr.io 에 docker login 되어 있어야 함.. azure service account 로 가능 
## 1. download
docker pull docker.io/grafana/grafana:11.2.0 
docker pull registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20221220-controller-v1.5.1-58-g787ea74b6

## 2. taggging
docker tag docker.io/grafana/grafana:11.2.0 sharedprdacr.azureacr.io/grafana/grafana:11.2.0
docker tag registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20221220-controller-v1.5.1-58-g787ea74b6 sharedprdacr.azureacr.io/ingress-nginx/kube-webhook-certgen:v20221220-controller-v1.5.1-58-g787ea74b6

## 3. push 
docker push sharedprdacr.azureacr.io/grafana/grafana:11.2.0 
docker push sharedprdacr.azureacr.io/ingress-nginx/kube-webhook-certgen:v20221220-controller-v1.5.1-58-g787ea74b6
```

## 2. install kube-prometheus-stack  
----
### 2-1. helm chart download 

- kube-prometheus-stack 설치
- namespace 명 : `ns-prometheus`

```bash
WORKDIR = /data/mgmt/prometheus

### repo add
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

### helm pull
cd ${WORKDIR}
helm pull prometheus-community/kube-prometheus-stack 

```

### 2-2. edit values.yaml 
```yaml 
cd kube-prometheus-stack/

## values.yaml 백업
cp values.yaml values_241217.yaml 

### vi 로 values.yaml 파일 편집
## docker registry 변경
global.imageRegistry : "sharedacr.azureacr.io"
global.imagePullSecrets : [XXXXXXXX]

## alert manager off 
alertmanager.enabled : false

## registry
:s/(docker.io|registry.k8s.io|quay.io|gcr.io|ghcr.io)/shared.azureacr.io/g


## grafana : k8s service 로 등록 예정

```
### 2-3. install prometheus 
```bash
kubectl config use-context <<cluster context>>; helm upgrade --install prometheus . -n ns-prometheus --create-namespace -f values.yaml
```

## 3. Log 설정
----
- loki를 통하여 log를 전달 받아 cloud에 Object storage 에 저장하는 로직을 구현. 
- Loki에서는 cloud storage 설정, promtail 은 loki와 연결하는 인터페이스 설정이 필요 
- 설정을 위한 helm chart는 grafana를 이용하므로 개별 설정 변경 전에 먼저 다운 받아 둔다. 

```bash
## helm repo add
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm pull grafana-stack 
```

### 3-1. Loki 설정

#### 3-1-1. 워킹 디렉터리 변경 
```bash
cd ${WORKDIR}/grafana-stack/charts/loki-distributed
```

#### 3-1-2. `values.yaml` 파일 편집
```yaml
...(생략)..
schemaConfig:
  configs:
  - from: "2024-09-11"
    index:
      period: 24h
      prefix: index_
    object_store: azure
    schema: v13
    store: tsdb
storageConfig:
  azure:
    account_name: <스토리지이름> 
    account_key: BO1dfASaldkjfklUXAlkjasldkfjalskjf==
    container_name: prometheus
    use_managed_identity: false
    request_timeout: 0 
  tsdb_shipper:
    active_index_directory: var/loki/index ### var 앞에 / 추가할 경우 에러 발생
    cache_location: var/loki/index_cache
    cache_ttl: 24h
  filesystem: 
    directory: var/loki/chunks
...(하략)...
```

#### 3-1-3. loki-distributed install
```bash
## k8s context 선택
kubectl config use-context <cluster-context>

## install 
helm upgrade --install loki . -n ns-prometheus -f values.yaml
```

#### 3-1-4. Loki 설치 확인 

```bash
$ k get po -n ns-prometheus | grep -i loki 
NAME                                                        READY   STATUS  RESTART AGE
loki-loki-distritubed-gateway-6dc5578cb9-j7scf              1/1     Running 0       10d
loki-loki-distritubed-distributor-6dc5578cb9-j7scf          1/1     Running 0       10d
loki-loki-distritubed-ingester-0                            1/1     Running 0       10d
loki-loki-distritubed-querier-0                             1/1     Running 0       10d
loki-loki-distritubed-query-frontend-8689676f4f-h8wn4-0     1/1     Running 0       10d
```

### 3-2. promtail 설정

#### 3-2-1. 워킹 디렉터리 변경 

```bash
cd $WORKDIR/grafana-stack/charts/promtail
```

#### 3-2-2. `values.yaml` 파일 편집
```yaml 
....(생략)....
clients:
- url: http://loki-loki-distributed-gateway/loki/api/v1/push
....(하략)....
```

#### 3-2-3. `install promtail` 
```bash 
helm upgradee --install promtail . -n ns-prometheus -f values.yaml
```
> [to-do] multi-line 처리


### 3-3. promtail 설치 확인
```bash
$ k get po -n ns-prometheus | grep -i promtail
NAME                    READY   STATUS  RESTART AGE
promtail-2f8v9          1/1     Running 0       10d
promtail-2f8v9          1/1     Running 0       10d
promtail-2f8v9          1/1     Running 0       10d
promtail-2f8v9          1/1     Running 0       10d
promtail-2f8v9          1/1     Running 0       10d
promtail-2f8v9          1/1     Running 0       10d
``` 
## 4. `Trace` 설정
### 4-0. opentelemetry 개요 
### 4-1. 설치 순서
- 먼저 opentelemetry 설치 전에 cert manager를 설치필요(requirement)
- opentelemetry trace는 CRD 형태로 배포 후 operator resource를 설치하고 collector 서비스를 기동하여 수집을 위한 환경을 만든다. 
- 앞서 생성한 collector에 실제 trace 데이터를 전송하는 agent는 몇 가지 방법으로 설치할 수 있는데, CI/CD pipeline을 통해 자동화하려면 크게 2가지 방법으로 정리된다. 
    1. autoinstrument k8s object를 생성하여 label selector를 통하여 자동 적용
    2. opentelemery agent를 JVM 구동 시 library 형태로 주입하고, 설정에 필요한 환경변수들은 helm 배포 시 주입되도록 조작
- 앞선 방법 중 1번의 경우 cert manager와 통신을 위해서 k8s cluster nodeport 에 대해 open이 필요하나(`port : 8443`) private cluster의 방화벽 open 필요. ~~정보보안팀에 연락하기 귀찮...~~. 2번 방법으로 진행
- 결론적으로 설치 순서
    0. cert manager 설치
    1. opentelemetry operator 
    2. opentelemetry collector
    3. opentelemetry instrument
      - JVM 실행 시 opentelemetry agent library로 실행 주입 

- helm repo add
```bash
helm repo add open-telemetry https://github.com/open-telemetry/opentelemetry-helm-charts
helm repo update
helm pull 
```


### 4-2. `cert manager` 설치
- k8s 내부 TLS 통신에 대해 인증 처리하는 모듈로 
- 통상 self-signed TLS 인증서로 통신 가능하도록 설정해 줌 

```bash
# default 설치
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.161/cert-manager.yaml 

# 설치 확인
$ k get po -n 
NAME                                        READY   STATUS  RESTART AGE
cert-manager-54f448d676d-cgznw              1/1     Running 0       10d
cert-manager-cainjector-7fc66c5787-gbpjk    1/1     Running 0       10d
cert-manager-webhook-fb4d6fb7-7zn7j         1/1     Running 0       10d
```

### 4-3. `opentelemetry operator` 설치

```bash
cd ${WORKDIR}/opentelemetry-helm-charts/charts/opentelemetry-operator
```
#### 4-3-1. `values.yaml` 편집내용
```yaml 
## 변경 내용 : image repostiroy 
....(중략)....
manager:
  image:
    repository: sharedprdacr.azureacr.io/open-telemetry/opentelemetry-operator/opentelemetry-operator
    tag: ""
  collectorImage:
    repository: sharedprdacr.azureacr.io/open-telemetry/opentelemetry-operator/opentelemetry-collector
    tag: 0.110.0
....(생략)....

kubeRBACProxy:
  image:
    repository: sharedprdacr.azureacr.io/brancz/kube-rbac-proxy

```
#### 4-3-2. `opentelemetry-collector` 설치

- values.yaml 편집


```yaml
....(생략) - tempo 설정....
mode: "deployment" # deployment로 변경
config:
  exporters:
    otlp:
      endpoint: "http://tempo.ns-prometheus.svc.cluster.local:4317"  ## tempo를 이용할 것으로 exporter로 tempo를 지정 , Tempo 설치는 다음절 참조
      tls:
        insecure: true
# 변경 사항은 아니지만, 중요 설정 
  processors:
    batch: {} 
    memory_limiter:
      check_interval: 5s
      limit_percentage: 80
      spike_limit_percentage: 25
  receivers:
    jaeger: # jaeger
      protocols: 
        grpc: 
          endpoint: ${env:MY_POD_PI}:14250
        thrift_http:
          endpoint: ${env:MY_POD_IP}:14268
        thrift_compact:
          endpoint: ${env:MY_POD_IP}:6831
    otlp: # otlp
      protocols:
        grpc:
          endpoint: ${env:MY_POD_IP}:4317
        http:
          endpoint: ${env:MY_POD_IP}:4318
    prometheus:
      config:
        scrape_configs:
        - job_name: opentelemetry_collector
          scrape_interval: 10s
          static_configs:
          - targets:
            - ${env:MY_POD_IP}:8888
    zipkin:
      endpoint: ${env:MY_POD_IP}:9411
  service:
    telemetry:
      metrics:
        address: ${env:MY_POD_IP}:8888
    extensions:
      - health_check
    pipelines:
      logs:
        exportors:
          - debug
        processors:
          - memory_limiter
          - batch
        receivers:
          - otlp
      metrics:
        exporters:
          - debug
        processors:
          - memory_limiter
          - batch
        receivers:
          - otlp
          - prometheus
      traces:
        exportoers:
          - debug
        processors:
          - memory_limiter
          - batch
        receivers:
          - otlp
          - jaeger
          - zipkin
```
 
- `helm install` 


```bash
cd ${WORKDIR}/opentelemetry-helm-charts/charts/opentelemetry-collector
helm upgrade --install otel-collector . -f values.yaml
```

### 4-4. `opentelemetry-instatruments` 설정
- instruments 설정 방벙에는 여러 가지가 있으며, 앞서 살펴본 바와 같이 auto-instruments를 설정하여 resource 생성 시 tag를 활용하여 자동 주입되는 환경은 아니다. 
  : 해당 설정을 위해서는 **certManager Webhook** 설정이 필요하며 이는 **cluster 의 9443 port open 필요**
- 여기서는 instrument를 별도로 설치하지 않고, 보내는 서비스에서 lib 파일을 agent 형태로 추가하여 collector에 전송하는 방법을 택했다. 
- 참고 사항으로 auto-instruments 설정을 위한 manifests 파일은 아래와 같다. 

#### 4-4-1. [참고] otel-instrumentation 
```yaml
apiVersion: opentelemetry.io/v1alpha1
kind: Instrumentation
metadata:
  name: otel-instrumentation 
spec:
  exporter:
    endpoint: " http://otel-collector-opentelemetry-collector.ns-prometheus:4317"
  propagators:
    - tracecontext
    - baggage
  sampler:
    type: parentbased_traceidratio
    argument: "0.25"
  python:
    env:
    - name: OTEL_EXPORTER_OTLP_ENDPOINT
      value: http://otel-collector-opentelemetry-collector.ns-prometheus:4318
  dotnet:
    env:
    - name: OTEL_EXPORTER_OTLP_ENDPOINT
      value: http://otel-collector-opentelemetry-collector.ns-prometheus:4318
  go:
    env:
    - name: OTEL_EXPORTER_OTLP_ENDPOINT
      value: http://otel-collector-opentelemetry-collector.ns-prometheus:4318
```

> [참고] otel-instrumentation 설치를 위한 명령어 
```bash
kubectl config use-context <<cluster-context>>;
helm upgrade --install --set "manager.collectorImage.repository=sharedprdacr.azureacr.io/opentelemetry-collector-k8s" \
                       --set "admissionWebhooks.certManager.enabled=false \ 
                       --set admissionWebhooks.autoGenerateCert.enabled=true
                       opentelemetry-operator . -f values.yaml -n ns-prometheus 
```


> [참고] otel operator 재설치할 경우 삭제가 필요한 CRD 목록

| 대상 | 삭제 명령 | 
|--|--|
| instrumentations.opentelemetry.io | kubectl delete crd instrumentations.opentelemetry.io |
| opampbridges.opentelemetry.io | kubectl delete crd opampbridges.opentelemetry.ioopampbridges.opentelemetry.io |
| opentelemetrycollectors.opentelemetry.io | kubectl delete crd opentelemetrycollectors.opentelemetry.io | 


## 5. `Tempo` 설치
- Tempo는 `trace` 를 위한 OSS library 중 하나로 grafana community version에서 확인 가능 

### 5-1. `values.yaml` 편짐 
```yaml
....(생략)....
tempo:
  metricsGenerator:
    enabled: true
    repoteWriteUrl: "http://prometheus-kube-promethus-prometheus.ns-prometheus:9090/api/v1/write"
  ........
  retention: 24h
  storage:
    trace:
      backend: azure
      azure:
        container_name: grafana-tempo
        storage_account_name: <<STORAGE_ACCOUNT_NAME>>
        storage_account_key: <<STORAGE_ACCOUNT_KEY>>
      local:
        path: /var/tempo/traces
      wal:
        path: /var/tempo/wal
  receivers:
    opencensus:
    otlp:
      protocols:
        grpc:
          endpoint: "0.0.0.0:4317"
        http:
          endpoint: "0.0.0.0:4318"
```

### 5-2. `Tempo` install
```bash
cd ${WORKDIR}/grafana-stack/charts/tempo
kubectl config use-context <<cluster-context>>; helm upgrade --install tempo . -n ns-prometheus
```

## 6. Exporter 설치
### 6-1. `postgresql-exporter` 설치
#### 6-1-1. 설정 값 변경
```yaml
image:
  registry: quay.io
  repository: prometheuscommunity/postgres-exporter

service:
  type: ClusterIP
  port: 80
  targetPort: 9187
  name: http
  labels: {}
  annotaions: 
    prometheus.io/path: /metrics
    prometheus.io/scrape: "true"
serviceMonitor:
  enabled: true
  namespace: ns-prometheus
  interval: 30s
  telemetryPath: /metrics
  labels: pg-dev
  timeout: 10s
prometheusRule:
  enabled: false
```

#### 6-1-2. `postgresql-exporter` 설치
```bash
cd ${WORKDIR}/postgres_exporter/prometheus-postgre-exporter
helm upgrade --install prometheus-postgres-exporter . -f postgre-exporter.yaml -n ns-prometheus 
```

#### 6-1-3. `prometheus exporter` 설정
```yaml
# prometheus config 
....
prometheusSpec:
  additionalScrapeConfigs:
  ## for pg
  - job_name: pg_exporter
    metrics_path: /metrics
    scrape_interval: 60s
    scrape_timeout: 30s
    static_configs:
    - targets:
      - prometheus-postgres-exporter:80
  ## for redis 
  - job_name: redisexporter
    static_configs:
    - targets:
      - redis-exporter-prometheus-reids-exporter:9121
```
### 6-2. `redis-exporter` 설치
- oliver006/redis_exporter 활용 : [github주소](https://github.com/oliver006/redis_exporter)

#### 6-2-1. `values.yaml` 편집 
```yaml
# 확인 
service:
  type: ClusterIP
  port: 9121
  portName: redis-exporter
```
## 7. [참고 사이트]

## 8. Epilog
- k8s 서비스 노출을 L7 LB를 통하여 `domain`을 열어야 하는 구조인데, 해당 기능 승인을 정보보안팀에서 담당하여, 하나 `domain` 해제하기 까다롭고 절차도 오래 걸려, `manifest` 파일을 ~~한땀 한땀 수정하여~~ 구축하였으나 ~~삽질 인듯...~~
- `multi-cluster` 적용과 multicluster를 통합한 `Thanos` 적용기도 추가할 예정이다. 
<br>


