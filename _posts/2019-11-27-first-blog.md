---
layout: single
##classes: wide
title:  "Setup CI/CD [Jenkins+Nexus for Spring, Docker, R]"
date:   2015-11-17 16:16:01 -0600
categories: jekyll update
toc: true
toc_label: "Setup CI/CD"
toc_icon: "cog"
toc_position: sticky
---

## 0. 구성요소
* jenkins
* nexus OSS
* ansible
* docker

## 1. Jenkins 설치 
### 1-1. 다운로드 및 실행

```bash
wget http://mirrors.jenkins.io/war-stable/latest/jenkins.war
#java -jar jenkins.war --httpPort=8080 --prefix=/jenkins
```
### 1-2. 접속
```
http://<hostname>:8080/jenkins
```

### 1-3. slave 설정
> `UI 에서 Jenkins 관리 > 노드관리 로 옮긴후 신규노드 를 열어봅니다:`    
> `1. 노드명을 입력: 예를들어 slave-01`    
> `2. Permanent Agent 를 선택`    
> `설정 Page 에서:`    
> `1. Remote root directory 에 입력, 예를들어, /opt/jenkins.`    
> `2. Launch method 는 Launch Slave Agents via SSH 를 선택, host 명 입력후 credential 추가`   
> `2.1 Credential 추가시 Slave node user, jenkins 와 그 password 를 등록함`    
> `2.2 혹은 SSH Username with private key 선택, From the jenkins master ~/.ssh  선택`   
`2.2.1 master 에서`    

```bash
sudo su - jenkins;

# generate key.
ssh-keygen -t rsa;

# copy master public key to slave.
ssh-copy-id -i ~/.ssh/id_rsa.pub <hostname>; # 혹은 cat ~/.ssh/id_pub.rsa > authorized_keys

# add config to ~/.ssh
vi ~/.ssh/config;
StrictHostKeyChecking no

# chmod.
chmod 600 ~/.ssh/config

# check connection to slave.
ssh emb-a01;
```

## 2. nexus 설치

```bash
# download.
# https://www.sonatype.com/download-oss-sonatype

# change data directory.
# https://help.sonatype.com/repomanager3/installation/configuring-the-runtime-environment#ConfiguringtheRuntimeEnvironment-ConfiguringtheDataDirectory
cd <nexus-home>/bin;

vi nexus.vmoptions;
-Xms2703m
-Xmx2703m
-XX:MaxDirectMemorySize=2703m
-XX:+UnlockDiagnosticVMOptions
-XX:+UnsyncloadClass
-XX:+LogVMOutput
-XX:LogFile=../sonatype-work/nexus3/log/jvm.log ## 변경
-XX:-OmitStackTraceInFastThrow
-Djava.net.preferIPv4Stack=true
-Dkaraf.home=.
-Dkaraf.base=.
-Dkaraf.etc=etc/karaf
-Djava.util.logging.config.file=etc/karaf/java.util.logging.properties
-Dkaraf.data=../sonatype-work/nexus3 ## 변경
-Djava.io.tmpdir=../sonatype-work/nexus3/tmp ## 변경
-Dkaraf.startLocalConsole=false
```
## 3. nexus docker registry 설정
> Reference: [config reference](https://www.ivankrizsan.se/2016/06/09/create-a-private-docker-registry/)

## 4. nexus 설정용 pom file
### 4-1. pom.xml
```xml
    <repositories>
        <repository>
            <id>central</id>
            <url>http://localhost:8081/repository/maven-public/</url>
            <snapshots>
                <enabled>true</enabled>
                <updatePolicy>always</updatePolicy>
            </snapshots>
        </repository>
    </repositories>
    <pluginRepositories>
        <pluginRepository>
            <id>central</id>
            <url>http://localhost:8081/repository/maven-public/</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </pluginRepository>
    </pluginRepositories>
    <distributionManagement>
        <snapshotRepository>
            <id>snap</id>
            <url>http://localhost:8081/repository/maven-snapshots/</url>
        </snapshotRepository>
        <repository>
            <id>rel</id>
            <url>http://localhost:8081/repository/maven-releases/</url>
        </repository>
    </distributionManagement>
```

### 4-2. mvn setting..
```shell
# mvn -version 으로 maven_home 확인 후
cd $MAVEN_HOME.conf
vi settings.xml
```
```xml
<servers>
    <server>
        <id>central</id>
        <username>$(nexus_username)</username>
        <password>$(nexus_passwd)</password>
    </server>
    <server>
        <id>snap</id>
        <username>$(nexus_username)</username>
        <password>$(nexus_passwd)</password>
    </server>
	<server>
        <id>rel</id>
        <username>$(nexus_username)</username>
        <password>$(nexus_passwd)</password>
    </server>
</servers>
```

### 4-3. Deploy test
```console
mvn -e -DskipTests=true clean install deploy;
```

## 5. 배포 대상 서버 설정
### 5-1. docker private registry 등록
```ksh
# /etc/docker/daemon.json 파일 편집하여 secure 예외 처리 등록
{
    "insecure-registries": ["<ip>:<port>","<domain>:<port>"]
}

# 저장후 docker restart
# wheel group user
sudo systemctl stop docker
sudo systemctl start docker

# <userID> 계정(group id : docker) 에서 정보 확인
# docker info의 마지막 세션 확인
docker info
------------------------------------
....
 Insecure Registries:
  <ip or domain>:<port>
   127.0.0.0/8
 Live Restore Enabled: false
------------------------------------
```

### 5-2. private registry login
```sh
# private docker registry login
# docker login -u<userid> -p<password> <ip or domain>:<port>
docker login -uadmin -p <ip or domain>:<port>
password:
```
### 5-3. image pull & 확인
```sh
# docker image pull
docker pull <ip or domain>:<port>/app:1.0.0-SNAPSHOT

# image 확인
docker images | grep -i jenkins
------------------------------------
<ip or domain>:<port>/app   1.0.0-SNAPSHOT      ec62cef80ecf        2 hours ago         235MB
------------------------------------
```

## 6. Nexus R-plugin 설정
### 6-1. plugin 다운로드
#### requirements
* Apache Maven 3.3.3+
* OpenJDK 8
* Network access to https://repository.sonatype.org/content/groups/sonatype-public-grid
* nexus version과 호환되는 plugin 을 다운 받는다
#### nexus,R plugin version
<table>
<thead>
<tr>
<th>Plugin Version</th>
<th>Nexus Repository Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>v1.0.0</td>
<td>&lt;3.8.0-02</td>
</tr>
<tr>
<td>v1.0.1</td>
<td>&gt;=3.8.0-02</td>
</tr>
<tr>
<td>v1.0.2</td>
<td>&gt;=3.14.0-04</td>
</tr>
<tr>
<td>v1.0.3</td>
<td>&gt;=3.15.2-01</td>
</tr>
<tr>
<td>v1.0.4</td>
<td>&gt;=3.18.0-01</td>
</tr>
</tbody>
</table>

plugin [Download link](https://github.com/sonatype-nexus-community/nexus-repository-r/releases)
* nexus-repository-r-1.0.4.jar 기준으로 아래에 설명

### 6-2. R-plugin 설치
#### 아래의 3개의 파일 복사와 설정 추가 필요함
* <nexus_dir>/system/org/sonatype/nexus/plugins/nexus-repository-r/1.0.4/nexus-repository-r-1.0.4.jar
* <nexus_dir>/system/com/sonatype/nexus/assemblies/nexus-oss-feature/3.x.y/nexus-oss-feature-3.x.y-features.xml
* <nexus_dir>/system/com/sonatype/nexus/assemblies/nexus-pro-feature/3.x.y/nexus-pro-feature-3.x.y-features.xml

```xml
      <feature version="3.x.y.xy" prerequisite="false" dependency="false">nexus-repository-rubygems</feature>
+     <feature version="1.0.4" prerequisite="false" dependency="false">nexus-repository-r</feature>
      <feature version="3.x.y.xy" prerequisite="false" dependency="false">nexus-repository-yum</feature>
  </feature>
```
그리고,
```xml
+ <feature name="nexus-repository-r" description="org.sonatype.nexus.plugins:nexus-repository-r" version="1.0.3">
+     <details>org.sonatype.nexus.plugins:nexus-repository-r</details>
+     <bundle>mvn:org.sonatype.nexus.plugins/nexus-repository-r/1.0.4</bundle>
+ </feature>
 </features>
```
### 6-3. nexus repository 추가
* 정상적으로 설치되면 nexus의 create repository 메뉴에 r(proxy), r(hosted), r(group) 메뉴가 표시됨
* r(proxy),r(hosted) repository를 추가 후 r(group)으로 묶어서 repository 생성.
  자세한 내용은 링크 참조
  [nexus R repository 만들기](https://github.com/sonatype-nexus-community/nexus-repository-r/blob/master/docs/R_USER_DOCUMENTATION.md)

### 6-4. 로컬 R 설정
* R-cran을 proxy 를 거쳐가도록 repo list 설정이 필요

```sh
# OS 별 위치 상이 R home 명령어로 확인
#‘/Library/Frameworks/R.framework/Resources/etc/’ on OS X,
#‘C:Program FilesRR-***etc’ on Windows,
#‘/etc/R/’ on Debian.
R> R.home(component = "home") # 1st config. filename Rprofile.site
R> path.expand("~") # 2nd config. filename .Rprofile

# edit $HOME/etc/
## Default repo <— Rprofile.site
local({r <- getOption("repos")
       r["Nexus"] <- "http://<nexusID>:<nexusPW>@<nexus r(group repository) address>"
       options(repos=r)
})
```

R 신규 세션 연결 후 확인

```R
R> getOption('repos')
----------------------------------------------------------------
                                                    Nexus
"http://<nexusID>:<nexusPW>@<nexus r(group repository) address>"
----------------------------------------------------------------
R> 
```

### 6-5. R package download test
```R
> remove.packages('dplyr')
Removing package from ‘/Library/Frameworks/R.framework/Versions/3.5/Resources/library’
(as ‘lib’ is unspecified)
Error in remove.packages : there is no package called ‘dplyr’
> library(dplyr)
Error in library(dplyr) : there is no package called ‘dplyr’
> getOption('repos')
                                                    Nexus
"http://<nexusID>:<nexusPW>@<nexus r(group repository) address>"
> install.packages('dplyr')
trying URL 'http://<nexusID>:<nexusPW>@<nexus r(group repository) address>/bin/macosx/el-capitan/contrib/3.5/dplyr_0.8.3.tgz'
Content type 'application/x-tgz' length 6265040 bytes (6.0 MB)
==================================================
downloaded 6.0 MB


The downloaded binary packages are in
	/var/folders/98/5jh6pvh54_n1xqk_y7c66t580000gn/T//Rtmpxy9PGN/downloaded_packages
> library(dplyr)

Attaching package: ‘dplyr’

The following objects are masked from ‘package:stats’:

    filter, lag

The following objects are masked from ‘package:base’:

    intersect, setdiff, setequal, union

>
```
### 6-6. R package upload test
* upload는 curl 등으로 진행

```sh
## package의 DESCRIPTION version과 파일 명의 version 이 일치해야 함
curl -v --user '<nexusID>:<nexsusPW>' --upload-file userPackage.tar.gz http://localhost:8081/repository/r-snap/src/contrib/userPackage_0.1.0.tar.gz
```

```R
##
> install.packages('userPackage')
오로지 소스형태로만 제공되는 패키지이므로 C/C++/Fortran으로 작성된
  코드들에 대한 컴파일이 필요할 수도 있습니다.: ‘userPackage’
Do you want to attempt to install these from sources? (Yes/no/cancel) Yes
소스형태의 패키지 ‘userPackage’(들)를 설치합니다.

URL 'http://<nexusID>:<nexusPW>@<nexus r(group repository) address>/src/contrib/userPackage_0.1.0.tar.gz'을 시도합니다
Content type 'application/x-gzip' length 17215032 bytes (16.4 MB)
==================================================
downloaded 16.4 MB

* installing *source* package ‘userPackage’ ...
** R
** inst
** byte-compile and prepare package for lazy loading
** help
*** installing help indices
** building package indices
** testing if installed package can be loaded
* DONE (userPackage)

다운로드한 소스 패키지들은 다음의 위치에 있습니다
        ‘/private/var/folders/98/5jh6pvh54_n1xqk_y7c66t580000gn/T/RtmppazSJ3/downloaded_packages’
```

혹은
```r
install.packages('userPackage',repos="http://<nexusID>:<nexusPW>@<nexus r(group repository) address>");
```
### 6-7. 참고 사이트
1. [r-plugin github site](https://github.com/sonatype-nexus-community/nexus-repository-r)
2. [nexus 설정 방법](https://github.com/sonatype-nexus-community/nexus-repository-r/blob/master/docs/R_USER_DOCUMENTATION.md)
3. [Rprofile 설정 방법](https://www.r-bloggers.com/fun-with-rprofile-and-customizing-r-startup/)
