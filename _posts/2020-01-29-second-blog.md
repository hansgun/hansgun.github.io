---
layout: single
classes: wide
title: "Authorizer Architecuture"
date: 2020-01-28 06:38:01 -0600
author_profile: false
categories: work
tags:
  - docker-compose
  - authorizer
permlink: /categories/
toc: true
toc_label: "On This Page"
toc_icon: "cog"
#toc_position: sticky
sidebar: docs
---

> _project 구현 기반. single server에 single proxy, 2-java Oauth container를 연결한 형태임  
# 1. 기본 개념
  * 외부 통신은 단일 interface를 통하여 수행. (nginX reverse proxy 이용, port 8078[현재버전])
  * 실제 authorizer component는 이중화 구성하며, 외부에 노출되는 port는 없음
  * 위 2가지 component는 health check fail 시 자동으로 재기동. (현재는 proxy만 설정된 상태 ==> restart:always)
  * cache layer는 redis 를 활용한다.

# 2. 구축 방안
  * 개별 component는 docker container를 이용.
  * 하나의 서비스화를 위하여 docker-compose로 구성
  * 현 버전은 하나의 물리 서버에서 docker container를 여러 개 띄우는 구성이며, 물리 서버의 cluster화 할 경우 추가 solution 필요

## 2-1. implementation
  * $HOME directory 관련 파일 구조
```
├── Dockerfile ## authorizer 생성 Dockerfile
├── Dockerfile_proxy ## proxy(nginx) 생성 Dockerfile
├── docker-compose.yml ## docker-compose file
├── make_docker_compose.sh ## 전체 프로세스를 수행하기 위한 shell script
├── nginx.conf ## Dockerfile_proxy 에서 사용할 nginx config 파일
├── .env ## docker-compose 환경 변수
└── target ## authorizer jar 파일이 생성되는 위치
```
  * 설치 방법
```
sh make_docker_compose.sh <설치된 물리서버 IP address> ## IP address는 .env에서 redis에서 활용
```

## 2-2. 각 파일의 내용
### 2-2-1. shell script

`make_docker_compose.sh`

<details>
	<summary><font size=4 color="blue"> View Source </font></summary>

<div markdown="1">
```bash
#!/bin/bash

## check parameter length
if [ "$#" -gt 3 ]; then
        echo "$# is Illegal number of parameters."
        echo "Usage: $0 [authoizer1_host_ip] [authorizer2_host_ip]"
        exit 1
fi
args=("$@")

## print parameter list
for (( c=0; c<$#; c++   ))
  do
    echo "$c th parameter = ${args[$c]}";
  done

## set-up .env file
echo "APP_HOST_NAME=auth_app" > .env
if [ "$#" -eq 2 ]; then
        echo "APP_HOST_IP1=${args[0]}" >> .env
        echo "APP_HOST_IP2=${args[1]}" >> .env
elif [ "$#" -eq 1 ]; then
        echo "APP_HOST_IP1=${args[0]}" >> .env
        echo "APP_HOST_IP2=${args[0]}" >> .env
else
        echo "APP_HOST_IP1=127.0.0.1" >> .env
        echo "APP_HOST_IP2=127.0.0.1" >> .env
fi

## build jar file for authorizer
mvn -e -DskipTests=true clean install

## docker-compose up
docker-compose up --build -d

```
</div>
</details>

### 2-2-2. docker-compose 관련 파일
  * docker-compose.yml : service 전체 내용 및 dependency 실행 순서 등 container 제어
  * .env : docker-compose.yml 에서 사용할 환경 변수 정의
  * Dockerfile : authorizer(springboot OAuth2 server) container image
  * Dockerfile_proxy : nginx 설치 이미지로 다음 절(2-2-3에서 설명)

`docker-compose.yml`
* 순서대로 redis, authorizer1, authorizer2, proxy 4개의 이미지를 생성
* proxy service 구성 중 links 부분은 명명된 service를 ip가 아닌 name으로 접근 가능하도록 설정함 

<details>
  <summary><font size=4 color="blue"> View Source </font></summary>

  <div markdown="1">
```yaml
# VERSION 1.0.0
# AUTHOR: project
# DESCRIPTION: project Authorizer
# BUILD: docker-compose -p <name> -d up -build
# SOURCE: https://github.com/

version: '2.1'

services:
#  redis:
#    image: redis:3.2.12
#    ports:
#      - "6379:6379"

  authorizer1:
    #hostname: authorizer1
    #container_name: authorizer1
    build:
      context: .
    environment:
      - REDIS_HOST=redis
      - TZ=Asia/Seoul
    extra_hosts:
      - ${APP_HOST_NAME}:${APP_HOST_IP1} ## .env 에 정의된 변수 사용
    #ports: ## port expose test.. authorizer container 외부로 open 되는 port 없음
    #  - "8085:8081"
#    depends_on:
#      - redis

  authorizer2:
    build:
      context: .
    environment:
      - REDIS_HOST=redis
      - TZ=Asia/Seoul
    extra_hosts:
      - ${APP_HOST_NAME}:${APP_HOST_IP2}
    #ports:
    #  - "8086:8081"
#    depends_on:
#      - redis

  proxy:
    restart: always
    build:
      context: .
      dockerfile: Dockerfile_proxy
#    ports:
#      - "8084:80" ## nginX 80 port를 외부 8084 port로 expose
    depends_on:
      - authorizer1
      - authorizer2
    links: ## docker 내부 네트워크에서 접근하기 위하여 hostname 정의
      - authorizer1:authorizer1
      - authorizer2:authorizer2
    #extra_hosts:
    #  - "authorizer1:${APP_HOST_IP1}"
    #  - "authorizer2:${APP_HOST_IP2}"
    healthcheck:
      test: "curl --fail http://localhost:8084/ || exit 1"
      interval: 1m
      timeout: 1s
      retries: 5
```
</div>
</details>

### 2-2-3. NginX 관련
  * Dockerfile_proxy : nginx image를 생성하는 dockerfile
  * nginx.conf : nginx 에서 사용할 config 를 미리 정의한 내용

`Dockerfile_proxy`
<details>
  <summary><font size=4 color="blue"> View Source </font></summary>

  <div markdown="1">

```
# VERSION v.1.0.0
# AUTHOR: hansgun
# DESCRIPTION: project authorizer proxy
# BUILD: docker build --rm -t project/proxy .
# SOURCE: https://github.com/

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/ ## current directory 에서 conf 파일 복사
```
</div>
</details>

`nginx.conf`

* ** 특이점은 nginx 에서 authorizer1,2 docker 접근 시 IP가 아닌 hostname으로 접근하여, container 내부의 port를 직접 접근 함

<details>
  <summary><font size=4 color="blue"> View Source </font></summary>

  <div markdown="1">
```
# /etc/nginx/nginx.conf

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}

http {
    include mime.types;

    upstream myapp1 {
        least_conn;
        server authorizer1:8081 max_fails=1 fail_timeout=2s; # authorizer1,2 에 대한 load balancing 설정
        server authorizer2:8081 max_fails=1 fail_timeout=2s; # docker네트워크에서 hostname으로 접근. IP, port 불필요
    }

    server {
        listen 8078;
        access_log /var/log/nginx/tomcat_access.log;
        location /spring-security-oauth-server { ## authorizer application.yml 의 spring.servlet.context-path
            proxy_pass http://myapp1;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_set_header Host $host:$server_port;
                proxy_redirect off;
        }
    }
}
```
</div>
</details>

## 3. 실행결과

`sh make_docker_compose.sh 192.168.1.168 <-- IP는 환경에 맞게 변경 필요`

<details>
  <summary><font size=4 color="blue"> View results  </font></summary>

  <div markdown="1">
```
0 th parameter = 192.168.1.168
[INFO] Error stacktraces are turned on.
[INFO] Scanning for projects...
[INFO]
[INFO] -------------< kr.co.project.feedernet:projectAuthorizer >--------------
[INFO] Building projectAuthorizer 1.0.0-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
... 중간 생략 ...
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  5.199 s
[INFO] Finished at: 2020-01-03T09:43:27+09:00
[INFO] ------------------------------------------------------------------------
Building authorizer1
Step 1/12 : FROM java:8-jre
 ---> e44d62cf8862
Step 2/12 : ENV APP_HOME /usr/lib/authorizer
 ---> Using cache
 ---> 4da19107a7c2
Step 3/12 : RUN echo "Asia/Seoul" > /etc/timezone
 ---> Using cache
 ---> d6d7ac7e2220
Step 4/12 : RUN dpkg-reconfigure -f noninteractive tzdata
 ---> Using cache
 ---> 3b9bc1f0b6aa
Step 5/12 : RUN useradd -ms /bin/bash -d ${APP_HOME} authorizer
 ---> Using cache
 ---> 2bad24c3166b
Step 6/12 : ARG JAR_FILE="target/*.jar"
 ---> Using cache
 ---> 5f886986b5a2
Step 7/12 : COPY ${JAR_FILE} ${APP_HOME}/authorizer.jar
 ---> 76556a94980a
Step 8/12 : RUN chown authorizer: -R ${APP_HOME}
 ---> Running in 6f4cc39bc255
Removing intermediate container 6f4cc39bc255
 ---> a16310494008
Step 9/12 : EXPOSE 8081
 ---> Running in 74d861e17a9f
Removing intermediate container 74d861e17a9f
 ---> f0a15efc2613
Step 10/12 : USER authorizer
 ---> Running in f9b2f072847a
Removing intermediate container f9b2f072847a
 ---> 13821a47ae94
Step 11/12 : WORKDIR ${APP_HOME}
 ---> Running in 6a1cc49da232
Removing intermediate container 6a1cc49da232
 ---> 8f3abf8226fe
Step 12/12 : ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Xms256m","-Xmx512m","-server","-XX:+UseNUMA","-XX:+UseParallelGC","-XX:+AggressiveOpts","-XX:+UseFastAccessorMethods","-jar","authorizer.jar"]
 ---> Running in ce9aa6573758
Removing intermediate container ce9aa6573758
 ---> 759031b1bfd8
Successfully built 759031b1bfd8
Successfully tagged projectauthorizer_authorizer1:latest
Building authorizer2
Step 1/12 : FROM java:8-jre
 ---> e44d62cf8862
Step 2/12 : ENV APP_HOME /usr/lib/authorizer
 ---> Using cache
 ---> 4da19107a7c2
Step 3/12 : RUN echo "Asia/Seoul" > /etc/timezone
 ---> Using cache
 ---> d6d7ac7e2220
Step 4/12 : RUN dpkg-reconfigure -f noninteractive tzdata
 ---> Using cache
 ---> 3b9bc1f0b6aa
Step 5/12 : RUN useradd -ms /bin/bash -d ${APP_HOME} authorizer
 ---> Using cache
 ---> 2bad24c3166b
Step 6/12 : ARG JAR_FILE="target/*.jar"
 ---> Using cache
 ---> 5f886986b5a2
Step 7/12 : COPY ${JAR_FILE} ${APP_HOME}/authorizer.jar
 ---> Using cache
 ---> 76556a94980a
Step 8/12 : RUN chown authorizer: -R ${APP_HOME}
 ---> Using cache
 ---> a16310494008
Step 9/12 : EXPOSE 8081
 ---> Using cache
 ---> f0a15efc2613
Step 10/12 : USER authorizer
 ---> Using cache
 ---> 13821a47ae94
Step 11/12 : WORKDIR ${APP_HOME}
 ---> Using cache
 ---> 8f3abf8226fe
Step 12/12 : ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Xms256m","-Xmx512m","-server","-XX:+UseNUMA","-XX:+UseParallelGC","-XX:+AggressiveOpts","-XX:+UseFastAccessorMethods","-jar","authorizer.jar"]
 ---> Using cache
 ---> 759031b1bfd8
Successfully built 759031b1bfd8
Successfully tagged projectauthorizer_authorizer2:latest
Building proxy
Step 1/2 : FROM nginx:latest
 ---> f949e7d76d63
Step 2/2 : COPY ./nginx.conf /etc/nginx/
 ---> Using cache
 ---> de0942485c9f
Successfully built de0942485c9f
Successfully tagged projectauthorizer_proxy:latest
Recreating projectauthorizer_redis_1 ... done
Recreating projectauthorizer_authorizer2_1 ... done
Recreating projectauthorizer_authorizer1_1 ... done
Recreating projectauthorizer_proxy_1       ... done
```
</div>
</details>

`docker-compose ps`
```
             Name                            Command                       State                   Ports
-----------------------------------------------------------------------------------------------------------------
projectauthorizer_authorizer1_1   java -Djava.security.egd=f ...   Up                      8081/tcp
projectauthorizer_authorizer2_1   java -Djava.security.egd=f ...   Up                      8081/tcp
projectauthorizer_proxy_1         nginx -g daemon off;             Up (health: starting)   0.0.0.0:8084->8078/tcp
projectauthorizer_redis_1         docker-entrypoint.sh redis ...   Up                      0.0.0.0:6379->6379/tcp

```
`docker network inspect projectauthorizer_default`
<details>
  <summary><font size=4 color="blue"> View docker inspect </font></summary>

  <div markdown="1">
```js
[
    {
        "Name": "projectauthorizer_default",
        "Id": "ab7956cbd8e787be575c050acd842854ed18906bf89c9566b929b818a90fe006",
        "Created": "2020-01-02T08:28:09.400768103Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": null,
            "Config": [
                {
                    "Subnet": "172.29.0.0/16",
                    "Gateway": "172.29.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": true,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "13dba477f3abd8b6d346b956a2787561a7affc29eca268234d463231db0e4d16": {
                "Name": "projectauthorizer_proxy_1",
                "EndpointID": "16cd689ed587cb92b19813337a3944cccf7d5685c080ddbc6c25f1a7fbe93b91",
                "MacAddress": "02:42:ac:1d:00:05",
                "IPv4Address": "172.29.0.5/16",
                "IPv6Address": ""
            },
            "591a74c933dd05b9dccb29b2b56dd58dc5d42e1f1e6a0c3fdb54e7b384f103b2": {
                "Name": "projectauthorizer_authorizer1_1",
                "EndpointID": "13633a2221edf6874fecb11b1a7dea0c0ddbdf5ac80cacb27c59ffd06225784c",
                "MacAddress": "02:42:ac:1d:00:03",
                "IPv4Address": "172.29.0.3/16",
                "IPv6Address": ""
            },
            "6702531cb6602b36086c570dd12f830ba76a7279426d7a523056b77b902d17b4": {
                "Name": "projectauthorizer_redis_1",
                "EndpointID": "2fcaa3885607fdee1f46ea95f97ec534f71d38945fc347663a78c599bfdd7146",
                "MacAddress": "02:42:ac:1d:00:02",
                "IPv4Address": "172.29.0.2/16",
                "IPv6Address": ""
            },
            "a42280ac856a5778395a34dab634e3e511ff1fd45b98cd68e0946640193d3bd6": {
                "Name": "projectauthorizer_authorizer2_1",
                "EndpointID": "a9c34a66279c465706351d252745055037d5f0c819670e9a7fd10de3b0709179",
                "MacAddress": "02:42:ac:1d:00:04",
                "IPv4Address": "172.29.0.4/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {
            "com.docker.compose.network": "default",
            "com.docker.compose.project": "projectauthorizer",
            "com.docker.compose.version": "1.24.1"
        }
    }
]
```
</div>
</details>

## 4. 접근 테스트
` http://<서버 IP>:8078/spring-security-oauth-server/ `

