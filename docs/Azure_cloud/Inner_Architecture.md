---
sidebar_position: 3
---
# 03. Inner_Architecture

# 0. 개요 
- cloud native application 개발 간 정리 / 적용한 원칙 및 시스템 구현에 관한 내용 및 체크 사항등을 나열한 문서임 

<!-- truncate -->
# 1. 어플리케이션 아키텍처 설계 원칙 



>[!quote] 
> 클라우드向 어플리케이션 설계 지향점인 **12 Factor App 설계 원칙** 준용 [12-factors](https://12factor.net)
 

| No. | 기본원칙                                                                                  | 아키텍처 적용 방안(예)                                                                                   |
| --- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | **Code Base** \: 어플리케이션은 1개의 코드 베이스를 통해 관리되어야 하며 동일한 코드로 개발 배포되어야 한다.              | Git 기반 소스코드 형상관리를 진행하며, 독립적인 어플리케이션은 독립적인 저장소에 관리한다.                                            |
| 2   | **Dependencies**\: 어플리케이션의 모든 종속성을 명시적으로 선언하여 사용한다.                                | Backend 어플리케이션은 Maven 프로젝트로 구성하며, Frontend 어플리케이션은 NPM 프로젝트로 구성한다.                              |
| 3   | **Config**\: 어플리케이션 설정 정보는 분리된 공간에 저장되고, 런타임에 따라 어플리케이션에 전달되어야 한다.                 | 어플리케이션의 Backing Services 정보는 별도의 resource 파일에 런타임에 따라 구분되어 구성하며, 민감한 정보는 환경변수를 통해 제공한다.(B/S 연계) |
| 4   | **Backing Services**\: 어플리케이션에서 필요한 Backing 서비스는 연결 가능한리소스로 관리한다.                  | 어플리케이션 외부의 DB, MQ 및 스토리지는 개발 및 배포에 영향을 받지 않도록 구성한다. (Config 연계)                                 |
| 5   | **Build, Release, Run**\: Code Base는 Build > release > Run 단계가 분리되어 배포되어야 한다.      | 빌드 및 배포 파이프라인을 분리 구성하며, 런타임에 따라 어플리케이션이 구동될 수 있도록 구성한다. (repository)                            |
| 6   | **Processes**\: 어플리케이션은 하나 이상의 인스턴스로 동작할 수 있도록 개별 트랜잭션에 대한 _stateless_ 를 유지하여야 한다. | web 서비스 세션을 포함한 상태 관련 데이터는 별도의 저장소(Redis, MQ)를 통해 관리되면 state 정보가 필요한 어플리케이션의 접근을 허용한다.          |
| 7   | **Port Binding**\: 어플리케이션의 서비스는 다른 어플리케이션에서 포트 바인딩을 통해 사용될 수 있도록 제공되어야 한다.         | 어플리케이션에서 제공되는 서비스는 REST API 방식으로 제공한다.                                                          |
| 8   | **Concurrency**\: 어플리케이션은 수평적으로 확장할 수 있어야 한다.                                      | 어플리케이션은 기능별로 분리(Micro-Service)된 프로세스로 실행되도록하고 _stateless_ 를 준수한다.                               |
| 9   | **Disposability**\: 어플리케이션의 기동과 정지로 인한 서비스의 영향을 최소화 하여야 한다.                        | 어플리케이션이 임의 종료 시 DB lock 해제 불가 등으로 다른 어플리케이션에 영향을 주지 않도록 설계되어야 한다.                               |
| 10  | **DEV/PROD Parity**\: 개발 및 운영 환경은 최대한 유사하게 유지 하여야 한다.                              |                                                                                                 |
| 11  | **Logs**\: 로그는 이벤트 스트림으로 처리하여 로컬 디스크에 저장하지 않는다.                                    | 컨테이너 내부에 저장된 로그는 인스턴스 라이프사이클과 더불어 사라지므로 스트림으로 처리하여 별도 저장소에 보관해야 한다.                             |
| 12  | **Admin Process**\어플리케이션 관리를 위한 프로세스는 독립적, 단발성으로 처리한다.                             | 어플리케이션 배포/운영을 위한 작업은 별개의 프로세스를 통해 관리한다.                                                         |


## 1-1. MSA 신규 구성 Guide
>`todo`
>1. 새로운 Biz. 영역의 MSA는 Namespace를 분리하여 구성함
>2. 로그인 화면이 다르다면 BFF의 분리를 고려하고, 그렇지 않다면 동일한 로그인 프로세스 이후 메뉴로 화면을 분리함
>3. Front 서비스는 별도의 Azure subscription(cluster)에 구분함

# 2. 데이터 아키텍처 설계 원칙
> `note` 
> 1. 서비스 Ownership에 따라 DB Instance를 분리하여 관리한다. 
> 2. 서비스의 Data Ownership에 따라 논리 DB로 분리하고, 논리적으로 분리된 DB 간 JOIN은 허용하지 않는다. 
> 3. 서비스에서 기준정보와 함께 Data가 제공되어야 하는 경우 반정규화 된 형태로 Data snapshot을 적재/조회 하도록 한다. 
> 4. Snapshot data의 기준 정보 갱신을 과거/현재 중 어떤 것이 우선할 지 업무 요구사항에 따라 별도 정의 한다. 

## 2-1. 비동기, 준실시간 Data 연동
> `note`
>1. 준 실시간 성 데이터 연동은 CDC w. Kafka Connector 서비스를 활용함
>  **상용 OGG or Debezium OSS**
>2. Micro Service 간 비동기 통신은 Kafka를 활용한 pub-sub 방식으로 Topic 처리

# 3. API 작성 가이드
## 3-1. Rest 표준 HTTP method 활용
| Method type  | 설명         | 요청 파라미터                        | 응답결과      |
| ------------ | ---------- | ------------------------------ | --------- |
| GET          | 데이터 조회     | URL encoding이 적용된 query string | API 처리 결과 |
| POST         | 새로운 데이터 생성 | Json 형태의 request body          |           |
| PUT          | 데이터 정보 변경  | Json 형태의 request body          |           |
| DELETE       | 데이터 삭제     | Json 형태의 request body          |           |

## 3-2. API 표준 URI
### 기본 API 
```{HTTP Method}/{회사명}/{시스템명}/{어플리케이션명}/api/{버전}/{대상}/{보조이벤트}```
- 보조이벤트 : Method 만으로 구분하기 어려운 API
### 목록형 API (paging)
##### API 에서 목록형 데이터를 제공할 때 페이지당 받고자 하는 데이터의 갯수와 페이지 오프셋을 지정

## 3-3. API 주요 체크 리스트
1. 파라미터의 명세서상 Mandatory/Optional 구분과 실제 API에 구현한 것이 일치하는 지 확인 한다. 
2. 자바 코드에 하드 코딩 된 것이 없는 지 확인 한다. 
3. API 명칭 및 파라미터의 Naming Rule이 표준에 맞게 명명되어 있는지 확인 한다. - 데이터 사전표준화, camelCase 등
4. API 명세서와 구현이 일치하는 지확인 한다.(현행화 점검)
5. 에러 처리가 표준에 맞게 되어 있는 지 확인 한다. 

# 4. 어플리케이션 로그 관리
- 스프링 부트의 기본 이벤트 로그(Zero Configuration Logging)
```
${TIMESTAMP_ISO8601:timestamp}s*%{LOGLEVEL:level} %{NUMBER:pid} -- [%{DATA:thread}] [%{DATA:class}] s*: *%{GREEDYDATA:logmessage}
```

- 어플리케이션 생성 표준 로그 메시지 
    - 스프링 부트의 기본 이벤트 로그 포맷을 활용하여 Grok pattern 중 JSON 문자열 형태로 생성
    - 로그 메시지는 로그생성시간, 작업자아이디, API 관련정보 
    - `호스트`, `method`, `path`, `컨트롤러`, `요청파라미터`, `응답결과:성공/실패{에러}`, `수행시간` 등을 포함
    - AOP로 작성된 `@LoggingRequired` 어노테이션을 컨트롤러의 메소드 단위로 부여 
    - 요청 파라미터에 개인정보가 포함된 경우에는 이를 남기지 않도록 show 플래그 설정 
    - PaaS 컨테이너의 로그 수집 기능을 이용하는 경우에는 시스템 표준 출력(stdout)으로 로그 생성

- ex
```java 
@LoggingRequired(show= LoggingRequired.RESPONSE)
@PostMapping(value="/user/login", produces = "application/json")
public Response login(@RequestBody Map<String, String> param) throws Exception {
    ...
    return response;
}
```

# 5. CORS 해결 방안 
## HTTP 프로토콜 Origin 개요 
- _HTTP의 프로토콜, 호스트 및 포트_ 가 동일할 때 same-origin으로 인정
- CORS(cross-origin resource sharing) 위반
	- React Application은 웹서버의 정적 파일 형태로 배포
	- Front 웹서버에서 제공된 Javascript 에서 Backend의 API를 호출할 때 브라우저는 Origin 비교를 통해 CORS 위반 인식
- 해결책 : *운영 환경의 Reverse Proxy 설정(Nginx 등)*

# 6. Git Branch 전략
## Git-flow 전략(cf. trunc.)
- 5가지 브랜치

| branch  | 설명                    |
| ------- | --------------------- |
| main    | 운영 환경에 배포할 수 있는 패키지   |
| release | QA 검증을 위한 패키지         |
| develop | 개발 환경에 배포 가능한 패키지     |
| feature | 개별 기능을 개발하는 단계의 저장소   |
| hotifx  | 운영 환경에서 발생한 버그 수정 저장소 |
# 7. 배포 프로세스
> `note`
>1. Micro Service 가 구동되는 클러스터 자원은 운영과 QA/개발의 Subscription을 분리한다. 
>2. 클러스터 자원은 QA와 개발을 분리하며, DB 자원은 효율성을 위해 Share 하여 사용한다. 
>3. 개발계의 배포는 개발자 작업 Merge후 자동 배포를 원칙으로 한다. 
>4. QA/운영 배포는 Build 까지는 자동으로 진행하며(CI), 이후 서비스 배포 단계에 승인 프로세스를 가져 간다. 


