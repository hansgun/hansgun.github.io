---
layout: single
#classes: wide
title: "Redis A-S-S(Active-Standby) cluster 구축기"
date: 2024-11-01 16:16:01 -0600
categories: work
tags:
  - Redis Cluster
  - kubernetes
author_profile: false
toc: true
toc_label: "On This Page"
toc_icon: "cog"
toc_position: sticky
---


# Prolog 
- 과제로 작성한 내용임 
- OSS DB 혹은 cache 솔루션은 성능, 효율성을 강조하는 대신, 정합성을 포함한 안정성에 대해서는 상용 제품들에 비해 기본 기능에서 제공하지 않는 경우가 많다. 
- 고가용성 설정 Oracle RAC 등의 session failover 등의 detail 한 설정을 구현하기는 쉽지 않다. 
- OSS 레벨에서는 Primary에 문제가 생겼을 경우 Primary failover에 중점을 둔 replication 기반은 PSS 혹은 PSA 구조의 고가용성 구현이 지배적인 것 같다. 
- 이러한 구조는 primary 운영에 이슈가 생겼을 경우 vote 하는 절차에서 의미 있는 결과를 도출하기 위하여 `quorum` 기반의 알고리즘 이 영향을 미친 것 같다.   

# 1. Task 개요
----
- key-value store 이자 cache로 많이 활용되는 Redis 는 메모리 기반의 휘발성 저장 솔루션이다. 
- persistency를 위하여 RDBMS와 같이 저장장치에 데이터 동기화를 주기적으로 수행할 수 있으나 이 경우 메모리 상의 데이터 변경이 제한된다. 성능 저하 이슈도 발생한다. 
  - 최근에는 ahead logging 방식으로 sequential 하게 log를 기록하여 오버헤드를 줄이고, 이를 streaming 형태로 Standby 서버에 전송하여 준실시간 동기화를 통한 고가용성을 구현할 수 있다. 
- sharding 과 같은 개념으로 key 값을 분산 처리 하여 부하 분산할 수 있도록 cluster 구성이 가능하다. 
- 이에 대한 구현을 아래와 같이 진행하였다. 
- 관리형 k8s cluster 에서 pod 형태로 redis cluster 구성과 모니터링을 구성하였다. 

1. GKE 구성
2. Redis Cluster 구성 
  - `StatefulSet` 활용 
  - Primary-Secondary 구조 구성 
3. Prometheus 설치 
  - redis-exporter 설정 
4. redis 접근 application 생성 및 HA 접근 설정, key 분산 저장 여부 확인 

## 1-1. 구성도 
![redis cluster 구성도](/assets/images/cluster_archi.png)

# 2. GKE 구성
- GKE 구성은 `SDK` 설치 이후 `CLI` 를 통해 install 진행 

```bash
## env 
export CLUSTER_NAME="gke-han-cluster"
export ZONE="asia-east1"
export NUM_NODES=2
export MACHINE_TYPE="e2-medium"

gcloud auth login q*****@gmail.com

gcloud auth list

gcloud projects list
# PROJECT_ID: ninth-age-4*****-p0
# NAME: My First Project
# PROJECT_NUMBER: 39*******

export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

gcloud services enable container.googleapis.com

gcloud container clusters create $CLUSTER_NAME \ 
    --zone $ZONE \
    --num-nodes $NUM_NODES \
    --machine-type $MACHINE_TYPE \
    --enable-ip-alias \
    --network "default" --disk-size=50GB \
    --subnetwork "default"
    --enable-workload-identity

gcloud components install kubectl

gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE

# add disk 
gcloud compute disks create --size=10GB --zone=asia-east1-a nfs-disk
```

# (작성중)
# 7. [참고 사이트]

# Epilog
- 

---
