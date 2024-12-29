---
sidebar_position: 6
---

# 06. AWS , Azure 
# 1. Cloud Gevernance
- 리소스, 사용자 권한 등을 관리하기 위한 표준 등을 크게 4 가지로 구분할 수 있으며, 각 CSP에서 제공하는 서비스는 다음과 같다. 

| 구분        | Azure                                                     | AWS                                 |
| --------- | --------------------------------------------------------- | ----------------------------------- |
| 리소스 계층 표준 | - Management Group \- Subscription\- Resource Group | - AWS Organization\- AWS Account |
| 리소스 관리 표준 | Azure Policy                                              | AWS Config                          |
| 사용자 역할 표준 | Azure User, Group\Azure RBAC                           | AWS IAM Role, Policy                |
| 표준 명명 규칙  | Naming Convention\Resource Tag                         | AWS Tag                             |

# 2. Hierarchy 비교
| 구분     | Azure                                                                                         | AWS                                     |
| ------ | --------------------------------------------------------------------------------------------- | --------------------------------------- |
| 공통관리   | 공통영역(보안/전용선, 서비스 공통)은 Hub-Spoke 구조에서 Hub, Shared subscription을 활용하여 서비스 subscription에 연결되는 형태 | 전체 공유 서비스 및 통합 관리 용도의 common Account 구성 |
| 서비스 확장 | 서비스 확장 시 성격에 따라 subscription 추가하는 형태                                                          | 각 서비스 환경 별로 사용하는 용도의 Service Account 구성 |
# 3. CSP 별 관리 구조
## 3-1. Azure
### 3-1-1. 개요
- 공통 외 서비스 성격에 따른 관리그룹(Management Group) 구분 후, 관리 그룹별 관련 subscription을 포함하여 접근 및 정책 제어
	- 관리 그룹에 속한 하위 구독은 관리 그룹에 적용되는 조건을 상속함 
	- 관리 그룹은 공통 외 서비스 성격 별로 추가 구분함
	- 보안, 네트워크 공통 영역와 서비스 공통 영역을 각각 Hub 와 Shared 구독으로 구분함
	- spoke 구독은 서비스별, 환경별(prd, stg, dev)로 구분함
	- 서비스 단위 별로 리소스 그룹을 구분 함
### 3-1-2. 세부 내용
##### 사용자 역할 별 구분 
- 리소스에 대한 RBAC(Role Based Access Control) 권한을 ~~Azure AD Group~~ MS Entra ID 생성 및 Owner를 지정하여 멤버 관리
##### 자원 Naming Convention
`<service-name> - <env> - <azure service name> <##>`

1. 명명은 모두 소문자 활용
2. `-` 을 제외한 특수 문자나 스페이스는 허용되지 않음 
	1. Azure 리소스의 명명 규칙은 리소스마다 다르기 때문에 그 특성에 맞게 규칙을 사용 \
		a. 대부분의 리소스는 영문 대소문자, 하이픈이 허용되는 경우이며, 아래와 같은 패턴을 기본 규칙으로 한다. \
		   `<서비스명>-<환경>-<Azure 서비스명><##>` \
		b. Subscription과 같이 _글로벌 서비스인 경우_ 아래와 같은 패턴을 기본 규칙으로 한다. \
	       `<회사명><서비스명>-<환경>-<Azure 서비스명><##>` (규칙 범위가 글로벌 서비스인 경우 회사명을 추가한다. ) \
	    c. Storage Account와 같이 _하이픈이 허용되지 않는 경우_  아래와 같이 하이픈을 제공하는 패턴을 기본으로 한다. \
		   `<회사명><서비스명><환경><Azure 서비스명><##>` \
		d. Virtual Machine, Load Balancer와 같이 _용도(Web, DB)등을 구분해야 하는 경우_ , 아래와 같은 패턴을 기본 규칙으로 한다. \
		   `<회사명><서비스명>-<환경>-<용도>-<Azure 서비스명><##>` \
		e. Disk, Subnet과 같이 _어느 서비스에 종속_ 되는 경우, 아래와 같은 패턴을 기본 규칙으로 한다. \
		   `종속되어 있는 서비스의 명명 규칙 + <용도> + <Azure 서비스명><##>` (Subnet 처럼 용도가 필요한 경우 용도를 추가한다. )\
3. 각 항목은 사전에 정의된 리소스 명명 혹은 약어를 사용해야 한다. 
4. Azure 리소스 명칭을 자동으로 부여하는 경우가 있기 때문에, 이 경우에는 Tagging을 활용한다. 
5. Tagging 

| 적용  | 태그 이름     | Key             | 설명        | 예제 값               |
| --- | --------- | --------------- | --------- | ------------------ |
| 필수  | 어플리케이션 이름 | ApplicationName | 어플리케이션 명  |                    |
| 필수  | 환경        | env             | 서비스 배포 환경 | prd, stg, dev, poc |
> [!tip] 리소스 태깅 시 고려사항
> - 하나의 리소스 또는 리소스 그룹은 최대 15개의 태그 정의 가능
> - 각 리소스 , 리소스 그룹에는 50개의 Tag 키/값 쌍을 구성할 수 있음 
> - 태그 이름은 대/소문자를 구분하지 않는다. 

##### 리소스 관리 표준(Azure Policy)
| No. | Policy 이름                                                              | 내 용                                                                                                                                                                                           | 비고                 |
| --- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 1   | inherit a tag from the resource group(Appl.)                           | 리소스 그룹에서 리소스로 태그를 자동으로 상속한다.                                                                                                                                                                  | 필수 적용 Tag : 애플리케이션 |
| 2   | inherit a tag from the resource group(Env.)                            | 리소스 그룹에서 리소스로 태그를 자동으로 상속한다.                                                                                                                                                                  | 필수 적용 Tag : 환경     |
| 3   | PublicIP Create Deny                                                   | Public IP의 생성을 막도록 강제하는 Custom Policy                                                                                                                                                         |                    |
| 4   | Audits usage of custom RBAC rules                                      | 소유자, 기여자, reader와 같은 Built-in Role 이 아닌 Custom Role을 만드는 것을 감시                                                                                                                                |                    |
| 5   | Audits VMs that do not use managed disks                               | 관리 디스크를 사용하지 않는 VM을 감시                                                                                                                                                                        |                    |
| 6   | Secure transfer to storage accounts should be enalbed                  | Storage Account의 Secure Transfer를 사용하는 지 감사 \Secure Transfer는 Storage Account가 HTTPS의 요청만 수락하도록 강제하는 옵션. HTTPS를 사용하면 서버와 서비스 간의 인증이 보장되고 중간 관리자, 도청 및 세션 하이잭킹과 같은 네트워크 계층 공격으로부터 데이터 보호 가능 |                    |
| 7   | MFA shoud be enabeld on accounts with owner permission on subscription | 계정 또는 리소스의 침해를 방지하기 위해, 소유자 권한이 있는 모든 구독 계정에 대해 MFA를 사용하는 지 감사                                                                                                                                |                    |
| 8   | A maximum of 3 owners should be designed for subscription              | 유출된 소유자에 의한 침해 가능성을 줄이기 위해 최대 3명의 구독 소유자를 지정하는 권고. Subscription Owner 의 수를 감사                                                                                                                 | 3명 초과시 비준수         |
| 9   | Allowed locations                                                      | 리소스를 배포할 때 조직에서 지정할 수 있는 위치를 제한할 수 있다.                                                                                                                                                        |                    |
| 10  | Network interfaces should not have public IPs                          | 공용 IP 주소를 사용하면 인터넷 리소스가 Azure 리소스로 인바운드 및 Azure 리소스는 인터넷으로 아웃바운드 통신할 수 있기 때문에, 공용 IP로 구성된 네트워크 인터페이스를 거부                                                                                      |                    |
##### ISMS 준수를 위한 표준 추가 
| No. | Policy이름 | 내용  | 효과  | ISMS 통제항목(기술적 관리조치) |
| --- | -------- | --- | --- | ------------------- |
|     |          |     |     |                     |
## 3-2. AWS
- 리소스 권한 관리 및 비용 관리 투명성을 위해, 추가 서비스 구축 시 Service 단위 운영/개발 Account 별도 생성
- **Common Account** : 전체 서비스와 공유하는 리소스, 통합 관리 리소스 
	- IAM 사용자 및 그룹 관리
	- TGW 연동 및 Public 트래픽 감시 통합 관리 
	- CI/CD 관리 
	- 3rd party 보안 리소스 배포 및 관리
	- 각 Acoount 의 Audit 로그 통합 관리 
- **Service Account** : 각 서비스에서 사용하는 리소스 배포 환경별 분리 
	- Prod, Dev, DW 등으로 구분 
### 3-2-1. 사용자 역할 표준(IAM Role, Policy)
- 각 Account에 적용할 IAM Group을 구분하고 Account 마다 생성된 Role 기반으로 역할 전환을 할 수 있도록 구성. Group은 조직의 역할 단위를 나누고 Access Key 사용 계정의 경우 별도 Group으로 키 생성하도록 함
- _리소스 관리 표준(AWS Config)_ : 모든 Account에 Config Rule을 적용하고, Common Account  의 Dashboard 및 알림을 통해 통합 Gorvernance 확보, ISMS 인증 준수를 위한 Rule 포함 Rule 적용 
##### Naming 표준
- Naming Convention은 AWS Resource를 체계적으로 관리하기 위한 기준으로, 표준으로 정의한 기준에 따라 수립하고 수정

##### 리소스 태그(Tagging)
- 필수 Tag 항목

| 필수항목         | Tag Key    | Tag value(예시)         | Tag 활용 목적                                           |
| ------------ | ---------- | --------------------- | --------------------------------------------------- |
| 리소스명         | cz-name    | datalake-p-vpc-       | 리소스 식별 목적으로 사용 \태그 그룹 기능은 지원하지 않되, Asset 태그정보 제공 |
| 프로젝트         | cz-project | datalake, 프로젝트 코드     | 자원을 소유하는 프로젝트 식별                                    |
| 팀/조직명        | cz-org     | ops_tf, 운영_tf         | 자원을 소유/운영하는 조직 식별                                   |
| 운영환경         | cz-stage   | product, staging, dev | 해당 리소스의 서비스 환경을 특성으로 구분                             |
| 운영소유자        | cz-owner   | 홍길동                   | 자원을 운영 또는 Ownership을 가진 사용자명                        |
| Application명 | cz-msp     | hr, mis, portal       | 사용 목적에 따라 자유롭게 정의할 수 있는 태그\                      |
| 사용자 정의 태그1   | cz-owner2  |                       |                                                     |
| 사용자 정의 태그2   |            |                       |                                                     |
| 사용자 정의 태그3   |            |                       |                                                     |
|              |            |                       |                                                     |
- 허용 문자 : 영문 소문자, 한글, 숫자 
- 허용 특수 문자: `_`, `-`
- Tag key, value 문자 길이 : 최대 63글자 


### 3-2-1. Openstack 관련기능
| 컴포넌트          | 기능                               |
| ------------- | -------------------------------- |
| Horizon       | 서비스 포털                           |
| Nova          | 컴퓨팅 리소스 관리                       |
| Neutron       | 가상 네트워크 기능                       |
| Cinder, Swift | 가상 스토리지 기능(BLOB, Object Storage) |
| Keystone      | 통합 인증 기능                         |
