---
sidebar_position: 1
---

# 01. Introduction

# 1. 프로세스
## 1. 개발 환경 준비
- 1.1 Cloud 환경 구성
- 1.2 개발 환경 세팅
- 1.3 Git 작업 가이드 - branch 전략 
- 1.4 CI/CD 파이프라인 구성
- 1.5 방화벽 설정 - domain, k8s service IP
- 1.6 개발자 협업 환경 구성
## 2. 개발 수행
- 2.1 Application Arch. 표준 가이드
- 2.2 개발 표준 가이드
- 2.3 API 표준 가이드
- 2.4 IF 표준 가이드
## 3. 테스트
- 3.1 정적 소스 분석
- 3.2 테스트 자동화 
## 4. 배포 모니터링
- 4.1 통합 모니터링 가이드

# 참고
- WSDL(Web Services Description Language)
	- service
	- port
	- binding : 인터페이스를 규정하고 SOAP

| WSDL 1.1 용어 | WSDL 2.0 용어 | 설명                                                                                                                                                                                       |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Service     | Service     | 웹 기반 프로토콜에 노출되는 시스템 함수의 집합을 포함한다.                                                                                                                                                        |
| Port        | Endpoint    | 웹 서비스로의 주소 또는 연결 지점을 정의한다. 단순 HTTP URL 문자열로 표현하는 것이 보통이다.                                                                                                                                |
| Binding     | Binding     | 인터페이스를 규정하고 [SOAP](https://ko.wikipedia.org/wiki/SOAP "SOAP") 바인딩 스타일(RPC/Document)과 트랜스포트([SOAP](https://ko.wikipedia.org/wiki/SOAP "SOAP") 프로토콜)을 정의한다. binding 섹션 또한 operation을 정의한다. |
| PortType    | Interface   | 웹 서비스를 정의한다.                                                                                                                                                                             |
| Operation   | Operation   | SOAP의 동작 및 메시지 인코딩 방식을 정의한다.                                                                                                                                                             |
| Message     | 없음          | 보통 message는 operation에 상응한다.                                                                                                                                                             |
| Types       | Types       | 데이터를 기술한다.                                                                                                                                                                               |

- Azure 
	- Landing Zone 
		- ER
		- VNet, Subnet
		- AppGW
		- WAF
		- Firewall
	- Gov.
		- Management Group
		- Policy
		- RBAC
	- Resource 
		- AKS
		- DB
		- PaaS
		- Network NSG
		- VM , etc

# stack
# Outer Architecture 
# Inner Architecture 
# DevOps
요
