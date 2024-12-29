---
sidebar_position: 2
---

# 02. Outer_Architecture

# 0. 개요
# 1. Azure Subscription 
- Hub&Spoke
- DEV/STG/PRD divided by env 
- Shared Zone 
- Azure DevOps

| 분류    | 구독          | 구분  | 역할                                         | 가용 호스트수(IP)        | 거주 대상 시스템                                                                  | 비고                           |
| ----- | ----------- | --- | ------------------------------------------ | ------------------ | -------------------------------------------------------------------------- | ---------------------------- |
| Hub   | hub-sub     | 공통  | On-prem 시스템 및 내부 시스템 연계대외 서비스 출입 게이트웨이 | 1022               | ER Circuit/ER GatewayWAF, FirewallApp. Gateway                     |                              |
| Spoke | prd-sub     | 운영  | 운영 전용 워크로드                                 | 2046               | Cluster(k8s)Backing Service(DB, storage, secret ... etc)               | AKSDBRedis, Eventhub |
|       | stg/dev-sub | 개발  | STG,DEV 워크로드                               | 2046               | 상동                                                                         |                              |
|       | shared-sub  | 공통  | 공통 자원                                      | 510(운영)254(개발) | DevOps self-hostedAPIMGithub Enterprise(as source version control) |                              |
<!-- ![[스크린샷 2024-03-29 오후 9.34.43.png]]![[스크린샷 2024-03-29 오후 9.34.59.png]] -->

## 1-1. 워크로드 영역의 Cloud Service
| 분류                | 자원명(Azure)       | 용도                                              | spec       | 비고                                                                     |
| ----------------- | ---------------- | ----------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| K8s               | AKS              | 서비스 워크로드                                        | 3 nodes    | -Load Balancer:서비스노출 연계 -KeyVault: 환경변수-Storage Account:공용스토리지 |
| MessageBroker | Event Hubs       | -App Service의 Event Pub/Sub-CDC 데이터 Pub/Sub | Premium    | Private Link 구성                                                        |
| DB                | Azure PostgreSQL | 표준 RDBMSlegacy Oracle과의 호환성(Heap table)     | 2 Flexible | DB subnet 구성Private Link 연결                                        |
| CDC               | Kafka Connect    | On-prem. Oracle과 Cloud PostgreSQL 동기화           | VM         | OSS를 활용 자체 개발(Kafka Connect, Debezium)                                 |

> **Azure Database for PostgreSQL**

<!-- ![[스크린샷 2024-03-30 오후 9.38.08.png]] -->
## 1-2. Shared Sub 및 Azure DevOps
| 분류      | 자원명                      | Azure Service | 용도                   | spec      | 비고                              |
| ------- | ------------------------ | ------------- | -------------------- | --------- | ------------------------------- |
| DevOps  | Github Ent.              | VM            | 소스코드 저장소             | 1 VM      | -설치형-라이선스 별도 구매             |
|         | self-hosted Agent        | VM            | 빌드 및 배포 서버           | 1 VM      | -설치형-Organization별 추가 설치 필요 |
|         | Azure Container Registry | PaaS          | 이미지 저장소              | Premium   | -Private Link 구성                |
| JumpBox | Jumpbox Linux            | VM            | AKS, VM 관리 접속 호스트    | linux 1VM |                                 |
|         | Jumpbox Win.             | VM            | 자원관리용 접속 호스트         | Win 1VM   |                                 |
| APIM    | APIM                     | SaaS          | Open API 서비스 및 대외 연계 |           |                                 |
- Azure DevOps에도 source version control을 위한 repo가 존재하나, 내부 소스를 외부 저장소에 유출 하는 것에 대한 부담으로 설치형 선택 ~~아니 VM이나 PaaS나 외부 노툴은 매한 가지 아닌가.~~
- Self-hosted 역시 같은 이유로 설치형으로 진행. 또한 조직별, 환경별 별도 Agent 추가할 목적으로 구성하였으나, 구축 이후 VM 추가 승인이 안남. 
- Cluster, VM 서버 등 접근을 위해서 Azure Bastion 등을 이용할 수 있으나 접속 로깅 불가 등의 이유로 VM을 통한 접근 제어 
- APIM 은 tier 선정 간 Enterprise tier 선택이 필요하며, 실제 활용 API 갯수 자체가 적은데 ~~10개도 안됨~~. 매달 300만원의 base 비용을 감당할 필요가 없어 보임 

### 1-2-1. Azure DevOps 활용 기능 
| 분류           | 서비스명           | 용도                                                    |
| ------------ | -------------- | ----------------------------------------------------- |
| Azure DevOps | Azure Boards   | 프로젝트 관리 - agile, kanban board backlog 등 프로젝트 일정 관리 가능 |
|              | Azure Pipeline | 빌드 및 배포 파이프라인 관리 : script-based 이나 UI 편의성 ~~역시 MS~~   |
|              | Azure Artifact | 라이브러리 연계. package proxy 서버 역할                         |
# 2. DevOps
- Github Ent., Azure Artifatcts, Self-Hosted Agent, ACR(Azure Container Registry), AKS 활용 구조
- 개발은 내부망으로 한정된 VDI 를  통해서만 개발 가능
> **DevOps 프로세스**
>1. Azure DevOps에 접속하여 Pipeline 시작
>2. Github - Azure DevOps 통신 및 사용자 소스 관리
>3. PE를 통해 ACR에 접속하여 Container 이미지 Push
>4. CD 작업을 위해 AKS 접속하여 배포 명령 실행
>5. ACR에 접속하여 이미지 Pull 및 배포 수행

<!-- ![[스크린샷 2024-03-29 오후 9.40.15.png]] -->
## 2-1. 모니터링
- streaming 된 log는 App Insight 를 통하여 수집되면 Azure Portal을 통해 확인 가능. RBAC 으로 권한 관리 
## 2-2. AD SSO 연계 
- Azure 는 AD(Active Directory)를 통한 사용자 인증이 가능한 관계로(현재 MS Entra) SAML 인증을 통한 SSO 구현 가능
- 다만 Organization 관리자만 SSO 셋업 가능 
- Github Ent., Azure DevOps, Azure Portal 등이 SAML 통한 SSO 가능
## 2-3. AKS 구성
### 2-3-1. Public/Private 비교
- Public EndPoint 
	- AKS에 대한 자격 증명을 가지고 있을 경우, 인터넷이 가능한 모든 장소에서 접근 가능
	- Azure Portal에서 AKS에 대한 정보 확인 가능 
- Private EndPoint 
	- AKS에 대한 자격 증명과 AKS가 위치하는 Vnet 내부 또는 Peering 된 통신 가능한 장소에서만 접근 가능. 
### 2-3-2. AZ 구성
- AKS의 Compute 는 가용성을 고려하여 최소 2개의 노드를 배포하며, 3개 이상의 노드가 권장사항임. 각 노드는 VMSS에 매핑하여 AZ를 고려하여 구성함 
- \[사용자 노드 풀의 고려사항\]
	- 노드에 설정된 최대 Pod 수를 압축하려면 더 큰 노드 크기를 선택 
	- 모니터링 및 로깅과 같은 모든 노드에서 실행되는 서비스의 공간을 최소화 한다. 
	- 두 개 이상의 노드를 배포. 이렇게 하면 워크로드에 두 개의 복제본이 있는 고가용성 패턴을 구성할 수 있다. AKS를 사용하면 클러스터를 다시 만들지 않고 노드 수를 변경할 수 있다. 
	- 워크로드의 실제  노드 크기는 디자인 시 결정한 요구 사항에 따라 달라진다. 
	- 클러스터에 대한 용량을 계획할 때 워크로드가 각 노드의 최대 80% 사용할 수 있다고 가정한다. 나머지 20%는 AKS 서비스에 예약되어 있다. 
	- 용량 계획에 따라 노드 당 최대 Pod를 설정한다. 용량 기준을 설정하려는 경우 30 값으로 시작한다. 워크로드, 노드 키기 및 IP 제약 조건의 요구 사항에 따라 해당 값을 조정한다. 

```bash
		az aks create \
			--resource-group 리소스그룹이름 \
			--name 클러스터이름 \
			--generate-ssh-keys \
			--vm-set-type VirtualMachineScaleSets \
			--load-balancer -sku standard \
			--node-count 3 \
			--zone 1 2 3
```
### 2-3-2. AKS 애플리케이션 노출 및 load balancing 방안
<!-- ![[스크린샷 2024-03-29 오후 9.45.28.png]]
![[스크린샷 2024-03-30 오후 10.11.43.png]] -->

### 2-3-3. External data stores 구성
<!-- ![[스크린샷 2024-03-29 오후 9.42.09.png]] -->
#### 스토리지 구성 방안 
>
>- AKS 내 단일 App 내의 Microservice는 동일한 데이터 볼륨을 공유할 수 있어야 한다. 
>- Pod 가 다른노드에서 스케줄링 될 경우에도 동일 데이터 볼륨에 연결되어야 한다. 
>- App의 구성정보 또는 중요한 데이터를 Pod에 삽입할 수 있어야 한다. 

- **Persistent Volumn 구성**
	- **Provisioning 방식** 
		1. Dynamic 방식 : AKS에서 자동으로 만들 수 있도록 동적 구성 설정
		2. Static 방식 : 데이터 볼륨을 수동으로 만들어 Pod에 할당하는 방식
		3. _비교_ : Dynamic 방식은 Storage account 와 pv가 자동 생성된다는 장점이 있으나 네이밍이 16진수 코드로 된 임의의 스트링으로 생성되어 운영 관리 용이성이 떨어짐 

<!-- ![[스크린샷 2024-03-29 오후 9.42.38.png]]

![[스크린샷 2024-03-29 오후 9.59.26.png]]

![[스크린샷 2024-03-30 오후 10.19.23.png]]
![[스크린샷 2024-03-30 오후 10.20.24.png]] -->

### 2-3.4. AKS 내 Microservice 배포
<!-- ![[스크린샷 2024-03-30 오후 10.21.37.png]]![[스크린샷 2024-03-30 오후 10.22.17.png]] -->

### 2-3-5. Jumpbox를 통한 AKS 계정별 권한 관리 
- VM의 계정별 kube 설정
	1. OS user 별 namespace 사전 정의
	2. Service account 생성 및 Rolebinding 
	3. 각 Service Account 별 token으로 config 파일 생성하여 OS 계정 별로 세팅 : ~/.kube/config 
- 미리 정의된 권한은 ClusterRole에 cluster-admin, admin, edit, view가 있으며, binding 하는 종류(Rolebinding, ClusterRolebinding)에 따라 권한 접근 범위가 namespace 인지 cluster 전체인지가 결정된다. 
<!-- ![[스크린샷 2024-03-29 오후 9.46.36.png]] -->

# 3. 로깅 및 모니터링
## 3-1. Azure Application Insight Agent 및 설정 파일 주입 방법
1. Agent 파일 - Self-hosted Agent 의 로컬 저장소에 업로드 후 Copy(30Mbyte)
2. Metric 정보 수집 범위 설정 파일(json) : 소스 repository 내 배포스크립트와 함께 관리
3. 관련 파일
	1. helm/template/deployment.yaml

```yaml
spec:
  containers:
  - name : <<서비스이름>>
    image : imageacr.azureacr.io/서비스이름
    ports : 
  - containerPort : 8090
  env : 
    - name : APPLICATIONINSIGHT_CONNECTION_STRING
      value : 
```

	2. Dockerfile 

```dockerfile
FROM openjdk-8u212-jdk-alpine
COPY target/*SNAPSHOT.jar app.jar
COPY applicationinsight-agent-3.2.xx.jar /
COPY manifests /applicationinsights.json /
EXPOSE 8080
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/location && echo $TZ > etc/timezone
RUN apk add busybox-extras
ENTRYPOINT ["java","-Xms:400M", "-javaagent/applicationinsight-agent-3.2.xx.jar", "-Djava.security.egd=file:/dev/ ./urandom","-jar", "/app.jar","--spring.profiles.active=docker" ]
```

### 3-1-2. 모니터링 설정 
[Azure Monitor MS Doc](https://docs.microsoft.com/en-us/azure/azure-monitor/app/java-standalone-config)

## 3-2. Azure Monitor + Datadog 통합 
- Azure Log Analytics와 연계하여 컨테이너 환경을 포함한 Azure 리소스를 통합 모니터링 하고 로깅함 
- Azure Portal의 제약 사항 => **전문 모니터링 툴 필요**
	- UI 일관성 부족, 사용상의 어려움(각 리소스 개별 화면으로 접근하여 Activity, Diagnotic, Metric 등 항목별 분리)
	- APM 기능 부재 외 기능상의 부족(상세 SQL 쿼리 로그 성능 조회 등 )
## 3-3. AKS 모니터링 - kubernetes Dashboard 활용
1. 로그인 토큰 생성
	1. Service account 생성
	2. ClusterRoleBinding 생성
	3. 사용자 계정의 토큰 조회
		1. `kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}'`
	4. 조회한 토큰 입력

```yaml
apiVersion: v1
    kind : ServiceAccount
    metadata : 
        name : admin-user
        namespace: kube-system
apiVersion: rbac.authorization.k8s.io/v1
    kind : ClusterROleBinding
    metadata : 
        name: admin-user
    roleRef:
        apiGroup : rbac,authorization.k8s.io
        kind: ClusterRole
        name: cluster-admin 
    subjects:
    - kind: ServiceAccount
        name: admin-user
        namespace:kube-system
```

### Dashboard 비교

| 후보                                 | 주요 특징                                                                                             | 설치방식           | 클러스터지원 | 확장성 | writable | 사용언어                  | 라이선스       | 개발자         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- | -------------- | ------ | --- | -------- | --------------------- | ---------- | ----------- |
| Kubernetes Dashboard(official) | -개발자용-클라이언트에서 인증 토큰에 의한 Proxy서비스 실행 후 브라우저 사용-Service를 Nodeport로 노출하여 직접 접근 가능-제한된 기능 | 클러스터 배포        | Mono   | O   | O        | Go,TypeScript/Angular | Apache 2.0 | CNCF        |
| Headlamp                           | -사용성 높고 UI 직관적임-사용자 권한별로 제어 가능Cross-cluster search는 불가능(예정)                               | 서버 호스팅/데스크탑    | Multi  | O   | O        | Go, TypeScript/React  | Apache 2.0 | Kinvolk     |
| Kubenav                            | 모바일 서비스 제공이 장점이나, 이로 인한 제약 발생(UI 사용성 한계)                                                          | 서버호스팅/데스크탑/모바일 | Multi  | X   | O        | Typescript,Go         | MIT        | Rico Berger |
| K8dash                             | -클러스터 admin full 권한으로만 설정 가능-Search 기능 부족                                                     | 클러스터 배포        | Mono   | X   | O        | TypeScript/React      | Apache 2.0 | Indeed      |

- 그 외 Kubevious, Octant, Lens, Kubernetes Web View.. Konstellate, Kubeman, Kubricks, Kubernator, Kubenetic 
- 독립 서비스가 아닌것 - Rancher Dashboard UI, Gardener UI, Linkerd UI

# 4. APIM Policy
1. 기본 규칙 : Product 단위로 policy
2. 유형 
	1. 외부기관 (레거시) Whitelist IP 제어
	2. OPEN API : Token 발급기관, authentication 
	3. 태블릿,모바일 호출 : Header에 발급된 subscription Key 적용

