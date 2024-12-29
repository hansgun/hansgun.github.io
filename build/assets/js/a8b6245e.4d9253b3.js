"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[3728],{7477:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>t,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>r,toc:()=>c});var r=n(8843),l=n(4848),s=n(8453);const a={layout:"post",title:"Set up project dev environments",date:"2019-01-29 00:16:01 -0600",toc:!0,toc_label:"On This Page",toc_icon:"cog",toc_position:"sticky",authors:["hansgun"]},i="1. [Project] \uac1c\ubc1c \ud658\uacbd \uc124\uc815",t={authorsImageUrls:[void 0]},c=[{value:"1.1 Host Naming Convention",id:"11-host-naming-convention",level:2},{value:"1.2 Hosts File \ub4f1\ub85d",id:"12-hosts-file-\ub4f1\ub85d",level:2},{value:"1.3 \uac1c\ubc1c Server \uc811\uc18d",id:"13-\uac1c\ubc1c-server-\uc811\uc18d",level:2},{value:"1.4 \uc124\uce58\ub41c Components",id:"14-\uc124\uce58\ub41c-components",level:2},{value:"1.5 PostgreSQL DB \uc5f0\uacb0",id:"15-postgresql-db-\uc5f0\uacb0",level:2},{value:"1.7 Airflow Docker \uc124\uce58 \ubc29\ubc95 v.2 (using docker-compose)",id:"17-airflow-docker-\uc124\uce58-\ubc29\ubc95-v2-using-docker-compose",level:2},{value:"1.7.1 \uc124\uce58\uacfc\uc815",id:"171-\uc124\uce58\uacfc\uc815",level:3},{value:"1.7.2 \uc2e4\ud589\uacb0\uacfc",id:"172-\uc2e4\ud589\uacb0\uacfc",level:3},{value:"1.7.3 scale-out test",id:"173-scale-out-test",level:3},{value:"1.8 R Package \uc124\uce58 \ubc29\ubc95",id:"18-r-package-\uc124\uce58-\ubc29\ubc95",level:2}];function _(e){const o={blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)(o.blockquote,{children:["\n",(0,l.jsx)(o.p,{children:"summary"}),"\n"]}),"\n",(0,l.jsx)(o.hr,{}),"\n",(0,l.jsxs)(o.blockquote,{children:["\n",(0,l.jsxs)(o.p,{children:["\ud504\ub85c\uc81d\ud2b8 \uc218\ud589 \uacb0\uacfc\ub85c \ubbfc\uac10\ud55c \uc815\ubcf4\ub294 [] \ud639\uc740 ",(0,l.jsx)(o.code,{children:"<>"})," \uc73c\ub85c \ub0b4\uc6a9\uc744 \ub300\uce58\ud568"]}),"\n"]}),"\n",(0,l.jsx)(o.hr,{}),"\n",(0,l.jsx)(o.h2,{id:"11-host-naming-convention",children:"1.1 Host Naming Convention"}),"\n",(0,l.jsx)(o.p,{children:(0,l.jsx)(o.code,{children:"[Project]-<flag><node-number>[-<env>].io"})}),"\n",(0,l.jsxs)(o.p,{children:[(0,l.jsx)(o.code,{children:"<flag>"}),":"]}),"\n",(0,l.jsxs)(o.ul,{children:["\n",(0,l.jsx)(o.li,{children:"s: Service Node."}),"\n",(0,l.jsx)(o.li,{children:"t: Streaming Node."}),"\n",(0,l.jsx)(o.li,{children:"g: Gateway Node."}),"\n"]}),"\n",(0,l.jsxs)(o.p,{children:[(0,l.jsx)(o.code,{children:"<node-number>"}),": Node Numbering \uc73c\ub85c \uc608\ub97c\ub4e4\uc5b4, '01', '02',etc."]}),"\n",(0,l.jsxs)(o.p,{children:[(0,l.jsx)(o.code,{children:"<env>"}),": Deploy \ud658\uacbd\uc73c\ub85c, \uc608\ub97c\ub4e4\uc5b4, \uac1c\ubc1c \ud658\uacbd\uc77c \uacbd\uc6b0, 'dev'. \uc0c1\uc6a9 \ud658\uacbd\uc740 \uc5c6\uc74c."]}),"\n",(0,l.jsx)(o.h2,{id:"12-hosts-file-\ub4f1\ub85d",children:"1.2 Hosts File \ub4f1\ub85d"}),"\n",(0,l.jsx)(o.p,{children:"Local \uac1c\ubc1c Machine \uc758 hosts file \uc5d0 \ub2e4\uc74c\uacfc \uac19\uc774 \ub4f1\ub85d\ud569\ub2c8\ub2e4:"}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{className:"language-bash",children:"<\uc11c\ubc84IP>    [Project]-s01-dev    [Project]-s01-dev.<full_name>\n"})}),"\n",(0,l.jsx)(o.h2,{id:"13-\uac1c\ubc1c-server-\uc811\uc18d",children:"1.3 \uac1c\ubc1c Server \uc811\uc18d"}),"\n",(0,l.jsx)(o.p,{children:"\uac1c\ubc1c Server \uc811\uc18d \ubc29\ubc95\uc740 \ub2e4\uc74c\uacfc \uac19\uc2b5\ub2c8\ub2e4:"}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{className:"language-bash",children:"ssh -i <aws-pem> cento-s01-dev.io\n"})}),"\n",(0,l.jsxs)(o.p,{children:["\uc811\uc18d\ud6c4 \uc0ac\uc6a9\uc790\ub97c ",(0,l.jsx)(o.code,{children:"<UserID>"})," \ub85c \uc804\ud658\ud569\ub2c8\ub2e4:"]}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{className:"language-bash",children:"sudo su - <UserID>;\n"})}),"\n",(0,l.jsx)(o.h2,{id:"14-\uc124\uce58\ub41c-components",children:"1.4 \uc124\uce58\ub41c Components"}),"\n",(0,l.jsx)(o.p,{children:"\uac1c\ubc1c Server \uc5d0 \uc124\uce58\ub41c \uc911\uc694 Component \ub4e4\uc740 \ub2e4\uc74c\uacfc \uac19\uc2b5\ub2c8\ub2e4."}),"\n",(0,l.jsxs)(o.ul,{children:["\n",(0,l.jsx)(o.li,{children:"JDK 1.8"}),"\n",(0,l.jsx)(o.li,{children:"Maven 3.x"}),"\n",(0,l.jsx)(o.li,{children:"Docker"}),"\n",(0,l.jsx)(o.li,{children:"Redis"}),"\n",(0,l.jsx)(o.li,{children:"PostgreSQL"}),"\n"]}),"\n",(0,l.jsx)(o.h2,{id:"15-postgresql-db-\uc5f0\uacb0",children:"1.5 PostgreSQL DB \uc5f0\uacb0"}),"\n",(0,l.jsx)(o.p,{children:"PostgreSQL Client \ub85c PostgreSQL Server \uc5d0 \ub2e4\uc74c\uacfc \uac19\uc774 \uc5f0\uacb0\ud560\uc218 \uc788\uc2b5\ub2c8\ub2e4."}),"\n",(0,l.jsx)(o.p,{children:"Airflow DB:"}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{className:"language-bash",children:"psql -h[Project]-s01-dev  -p 5432 -U airflow -W -d airflow;\n"})}),"\n",(0,l.jsx)(o.p,{children:"User sample DB:"}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{className:"language-bash",children:"psql -h[Project]-s01-dev -p 5432 -U <userschema> -W -d <userDB_name>;\n"})}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{children:"~~## 1.6 Airflow Components ( Old Version. See 1.7 section)~~\n\n~~\uc124\uce58\ub41c Airflow Component \ub4e4\uc740 Docker Container \ub85c\uc11c \uc2e4\ud589\ub418\uace0 \uc788\uc2b5\ub2c8\ub2e4.~~\n\n~~\uc124\uce58\ub41c Airflow Component \ub4e4\uc740 \ub2e4\uc74c\uacfc \uac19\uc2b5\ub2c8\ub2e4.~~\n\n~~WebServer: [http:<\uc11c\ubc84IP>:8080]~~\n~~Worker~~\n~~Scheduler~~\n~~Flower: [http:<\uc11c\ubc84IP>:5555]~~\n\n### ~~1.6.1 Airflow Docker \uc124\uce58 \ubc29\ubc95 v.1 (Old Version.)~~\n\n~~Docker Container \ud615\ud0dc\ub85c Airflow \ub97c \uc124\uce58\ud558\ub294 \ubc29\ubc95\uc744 \uc124\uba85\ud558\uaca0\uc2b5\ub2c8\ub2e4.~~\n"})}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{className:"language-bash",children:'# add user to docker group.\nsudo su <userID>;\nsudo usermod -aG docker $(whoami);\n\n# airflow docker build.\n## NOTE: docker airflow is originated from https://github.com/puckel/docker-airflow\n\ngit clone https://github.com/[Project].git;\ncd [Project];\ngit fetch origin;\ngit checkout dev;\ncd workflow/docker-airflow;\n\n------ R \uad00\ub828 \ucd94\uac00 \uc0ac\ud56d\n# R\uc774 \ud3ec\ud568\ub41c \uc774\ubbf8\uc9c0\ub294 workflow/docker-airflow/docker_with_R \uc5d0 \uc788\uc74c..\n# customized R package tar \uc0dd\uc131\ncd workflow/docker-airflow/docker_with_R\nsh make_skytale_tar.sh\ndocker build --rm -t <project_name>/docker-airflow-withR .\n# \uc544\ub798\uc758 docker build \uc0dd\ub7b5\n------- R \uad00\ub828 \ucd94\uac00 \uc0ac\ud56d(\ub05d)\n\ndocker build --rm -t <project_name>/docker-airflow .\n\n# create directories for volumes:\nsudo mkdir -p /data01/airflow/docker-airflow-volumes;\nsudo mkdir -p /data01/airflow/docker-airflow-volumes/{logs,plugins,dags};\nsudo chmod 777 -R /data01/airflow/docker-airflow-volumes;\n\n# add python deps into requirements.txt.\nsudo vi /data01/airflow/docker-airflow-volumes/requirements.txt;\nFlask==1.0.4\npsycopg2-binary\n\n# install rest api plugin to the directory of plugins volume.\nwget https://github.com/teamclairvoyant/airflow-rest-api-plugin/archive/v1.0.5.tar.gz\n\n## copy all the files to \'/data01/airflow/docker-airflow-volumes/plugins\' dir.\n\n\nsudo su <userID>;\n## webserver, worker ::: -e LD_LIBRARY_PATH=/usr/lib/jvm/java-11-openjdk-amd64/lib/server/ \\ \ucd94\uac00\n# Dockerfile \uc790\uccb4\uc5d0 JAVA_HOME \ucd94\uac00\ud574\uc11c \ud558\ub294 \ubc29\ubc95 \ud655\uc778 \ud544\uc694\n# run airflow webserver.\ndocker run -d \\\n    --add-host <\uc11c\ubc84\uc774\ub984>:<\uc11c\ubc84IP> \\\n    -v /data01/airflow/docker-airflow-volumes/plugins/:/usr/local/airflow/plugins \\\n    -v /data01/airflow/docker-airflow-volumes/dags/:/usr/local/airflow/dags \\\n    -v /data01/airflow/docker-airflow-volumes/logs/:/usr/local/airflow/logs \\\n    -v /data01/airflow/docker-airflow-volumes/requirements.txt:/requirements.txt \\\n    -v /data01/airflow/docker-airflow-volumes/temp/:/usr/local/airflow/temp \\\n    -e REDIS_HOST <\uc11c\ubc84IP> \\\n    -e POSTGRES_HOST <\uc11c\ubc84IP> \\\n    -e POSTGRES_USER=airflow \\\n    -e POSTGRES_PASSWORD=<password> \\\n    -e POSTGRES_DB=airflow \\\n    -e AIRFLOW__CORE__EXECUTOR=CeleryExecutor \\\n    -e AIRFLOW__CORE__SQL_ALCHEMY_CONN="postgresql+psycopg2://airflow:<password> <\uc11c\ubc84IP>:5432/airflow" \\\n        -e AIRFLOW__CELERY__RESULT_BACKEND="db+postgresql://airflow:<password> <\uc11c\ubc84IP>:5432/airflow" \\\n    -e AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION=False \\\n    -e AIRFLOW__CORE__DEFAULT_TIMEZONE=Asia/Seoul \\\n    -e LD_LIBRARY_PATH=/usr/lib/jvm/java-11-openjdk-amd64/lib/server/ \\\n    -v /etc/localtime:/etc/localtime:ro \\\n    -e TZ=Asia/Seoul \\\n    -p 8080:8080 \\\n    --name airflow-webserver \\\n    <project_name>/docker-airflow webserver\n\n\n# view docker logs: airflow webserver.\ndocker logs -f airflow-webserver;\n\n\n# run airflow worker.\ndocker run -d \\\n    --add-hosT <\uc11c\ubc84\uc774\ub984>:<\uc11c\ubc84IP> \\\n    -v /data01/airflow/docker-airflow-volumes/plugins/:/usr/local/airflow/plugins \\\n    -v /data01/airflow/docker-airflow-volumes/dags/:/usr/local/airflow/dags \\\n    -v /data01/airflow/docker-airflow-volumes/logs/:/usr/local/airflow/logs \\\n    -v /data01/airflow/docker-airflow-volumes/requirements.txt:/requirements.txt \\\n    -v /data01/airflow/docker-airflow-volumes/temp/:/usr/local/airflow/temp \\\n    -e REDIS_HOST <\uc11c\ubc84IP> \\\n    -e POSTGRES_HOST <\uc11c\ubc84IP> \\\n    -e POSTGRES_USER=airflow \\\n    -e POSTGRES_PASSWORD=<password> \\\n    -e POSTGRES_DB=airflow \\\n    -e AIRFLOW__CORE__EXECUTOR=CeleryExecutor \\\n    -e AIRFLOW__CORE__SQL_ALCHEMY_CONN="postgresql+psycopg2://airflow:<password> <\uc11c\ubc84IP>:5432/airflow" \\\n        -e AIRFLOW__CELERY__RESULT_BACKEND="db+postgresql://airflow:<password> <\uc11c\ubc84IP>:5432/airflow" \\\n    -e AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION=False \\\n    -e AIRFLOW__CORE__DEFAULT_TIMEZONE=Asia/Seoul \\\n    -e LD_LIBRARY_PATH=/usr/lib/jvm/java-11-openjdk-amd64/lib/server/ \\\n    -v /etc/localtime:/etc/localtime:ro \\\n    -e TZ=Asia/Seoul \\\n    -p 8793:8793 \\\n    --name airflow-worker \\\n    <project_name>/docker-airflow worker\n\n\n# view docker logs: airflow worker.\ndocker logs -f airflow-worker;\n\n\n# run airflow scheduler.\ndocker run -d \\\n    --add-host <\uc11c\ubc84\uc774\ub984>:<\uc11c\ubc84IP> \\\n    -v /data01/airflow/docker-airflow-volumes/plugins/:/usr/local/airflow/plugins \\\n    -v /data01/airflow/docker-airflow-volumes/dags/:/usr/local/airflow/dags \\\n    -v /data01/airflow/docker-airflow-volumes/logs/:/usr/local/airflow/logs \\\n    -v /data01/airflow/docker-airflow-volumes/requirements.txt:/requirements.txt \\\n    -v /data01/airflow/docker-airflow-volumes/temp/:/usr/local/airflow/temp \\\n    -e REDIS_HOST=<\uc11c\ubc84IP> \\\n    -e POSTGRES_HOST=<\uc11c\ubc84IP> \\\n    -e POSTGRES_USER=airflow \\\n    -e POSTGRES_PASSWORD=<password> \\\n    -e POSTGRES_DB=airflow \\\n        -e AIRFLOW__SCHEDULER__DAG_DIR_LIST_INTERVAL=2 \\\n    -e AIRFLOW__CORE__EXECUTOR=CeleryExecutor \\\n    -e AIRFLOW__CORE__SQL_ALCHEMY_CONN="postgresql+psycopg2://airflow:<password>@<\uc11c\ubc84IP>:5432/airflow" \\\n        -e AIRFLOW__CELERY__RESULT_BACKEND="db+postgresql://airflow:<password>@<\uc11c\ubc84IP>:5432/airflow" \\\n    -e AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION=False \\\n    -e AIRFLOW__CORE__DEFAULT_TIMEZONE=Asia/Seoul \\\n    -v /etc/localtime:/etc/localtime:ro \\\n    -e TZ=Asia/Seoul \\\n    --name airflow-scheduler \\\n    <project_name>/docker-airflow scheduler\n\n\n# view docker logs: airflow scheduler.\ndocker logs -f airflow-scheduler;\n\n\n# run airflow flower.\ndocker run -d \\\n    --add-host <\uc11c\ubc84\uc774\ub984>:<\uc11c\ubc84IP> \\\n    -v /data01/airflow/docker-airflow-volumes/plugins/:/usr/local/airflow/plugins \\\n    -v /data01/airflow/docker-airflow-volumes/dags/:/usr/local/airflow/dags \\\n    -v /data01/airflow/docker-airflow-volumes/logs/:/usr/local/airflow/logs \\\n    -v /data01/airflow/docker-airflow-volumes/requirements.txt:/requirements.txt \\\n    -v /data01/airflow/docker-airflow-volumes/temp/:/usr/local/airflow/temp \\\n    -e REDIS_HOST=<\uc11c\ubc84IP> \\\n    -e POSTGRES_HOST=<\uc11c\ubc84IP> \\\n    -e POSTGRES_USER=airflow \\\n    -e POSTGRES_PASSWORD=<password> \\\n    -e POSTGRES_DB=airflow \\\n    -e AIRFLOW__CORE__EXECUTOR=CeleryExecutor \\\n    -e AIRFLOW__CORE__SQL_ALCHEMY_CONN="postgresql+psycopg2://airflow:<password>@<\uc11c\ubc84IP>:5432/airflow" \\\n        -e AIRFLOW__CELERY__RESULT_BACKEND="db+postgresql://airflow:<password>@<\uc11c\ubc84IP>:5432/airflow" \\\n    -e AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION=False \\\n    -e AIRFLOW__CORE__DEFAULT_TIMEZONE=Asia/Seoul \\\n    -v /etc/localtime:/etc/localtime:ro \\\n    -e TZ=Asia/Seoul \\\n    -p 5555:5555 \\\n    --name airflow-flower \\\n    <project_name>/docker-airflow flower\n\n\n# view docker logs: airflow flower.\ndocker logs -f airflow-flower;\n\n\n# check rest api.\ncurl --header "rest_api_plugin_http_token: changeme" http://<\uc11c\ubc84IP>:8080/admin/rest_api/api?api=version\n\n# deploy dag.\ncurl -X POST --header "rest_api_plugin_http_token: changeme" -H \'Content-Type: multipart/form-data\' -F \'dag_file=@<project_name>-test-dag8.py\' -F \'force=on\' http://<\uc11c\ubc84IP>:8080/admin/rest_api/api?api=deploy_dag\n\n# trigger dag.\ncurl --header "rest_api_plugin_http_token: changeme" http://<\uc11c\ubc84IP>:8080/admin/rest_api/api?api=trigger_dag&dag_id=tutorial-<project_name>7\n'})}),"\n",(0,l.jsx)(o.h2,{id:"17-airflow-docker-\uc124\uce58-\ubc29\ubc95-v2-using-docker-compose",children:"1.7 Airflow Docker \uc124\uce58 \ubc29\ubc95 v.2 (using docker-compose)"}),"\n",(0,l.jsxs)(o.ul,{children:["\n",(0,l.jsx)(o.li,{children:"docker compose\ub97c \ud1b5\ud558\uc5ec component dependency\ub97c \uace0\ub824\ud558\uc5ec single command\ub85c \uc2e4\ud589"}),"\n",(0,l.jsx)(o.li,{children:"\uc2e4\uc81c \uc218\ud589 \ub0b4\uc6a9\uc740 v.1 \uacfc \ub3d9\uc77c."}),"\n"]}),"\n",(0,l.jsx)(o.h3,{id:"171-\uc124\uce58\uacfc\uc815",children:"1.7.1 \uc124\uce58\uacfc\uc815"}),"\n",(0,l.jsxs)(o.p,{children:["\ud30c\uc77c \uc704\uce58 : ",(0,l.jsx)(o.code,{children:"[Project]/workflow/docker-airflow"}),"\n\uad00\ub828 \ud30c\uc77c :"]}),"\n",(0,l.jsxs)(o.ul,{children:["\n",(0,l.jsx)(o.li,{children:(0,l.jsx)(o.code,{children:"docker-compose.yml"})}),"\n",(0,l.jsxs)(o.li,{children:[(0,l.jsx)(o.code,{children:".env"})," [ .env\ub294 \ud604\uc7ac local \uc124\uc815, \uac1c\ubc1c\uae30\uc5d0\uc11c\ub294 .env_dev\uc640 \uad50\uccb4 \ud544\uc694.. ]"]}),"\n",(0,l.jsxs)(o.li,{children:["\uc2e4\ud589 \uba85\ub839 : ",(0,l.jsx)(o.code,{children:"docker-compose -p [Project] up -d --build"})," \uc2e4\ud589 \uc2dc container\uc774\ub984\uc740 ",(0,l.jsx)(o.code,{children:"[Project]_<container \uc774\ub984>_<\uc778\uc2a4\ud134\uc2a4 \ubc88\ud638>"})," \ud615\ud0dc"]}),"\n"]}),"\n",(0,l.jsxs)(o.p,{children:[(0,l.jsx)(o.code,{children:".env"})," \ud30c\uc77c \ub0b4\uc6a9 : \ud658\uacbd\uc5d0 \ub9de\uac8c \ubcc0\uacbd \ud544\uc694"]}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{children:"###### section 1. postgre\nPOSTGRES_HOST=192.168.3.108\necho ${POSTGRES_HOST}\nPOSTGRES_USER=airflow\nPOSTGRES_PASSWORD=***** # \uc2e4\uc81c \ud328\uc2a4\uc6cc\ub4dc\n\n###### section 2. redis\nREDIS_HOST=192.168.3.108\n\n###### section 3. APP\nAPP_HOST_NAME=[Project]-app.name\nAPP_HOST_IP=192.168.3.108\nAPP_VOLUMN_DIR=/Users/han/data01/airflow/docker-airflowvolumns\n\n"})}),"\n",(0,l.jsxs)(o.p,{children:[(0,l.jsx)(o.code,{children:"docker-compose.yml"})," \ud30c\uc77c \ub0b4\uc6a9 (\uc8fc\uc11d \ub0b4\uc6a9\uc740 \ud604\uc7ac \ud658\uacbd\uc5d0 \uc774\ubbf8 \uc124\uce58\ub418\uc5b4 \uc788\ub2e4\uace0 \uac00\uc815\ud558\uc600\uc744 \ub54c)"]}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{className:"language-yaml",children:'version: \'2.1\'\n\n services:\n #  postgre:\n #    image: postgres:10.10\n #    environment:\n #      - POSTGRES_DB=airflow\n #      - POSTGRES_USER=${POSTGRES_USER}\n #      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}\n #      - POSTGRES_INITDB_ARGS=--encoding=UTF-8\n #    ports:\n #      - "5432:5432"\n #    healthcheck:\n #      test: "pg_isready -h localhost -p 5432 -q -U postgres"\n #      interval: 3s\n #      timeout: 1s\n #      retries: 10\n #\n #  redis:\n #    image: redis:3.2.12\n #    ports:\n #      - "6379:6379"\n   airflow-webserver:\n     build:\n       context: .\n     command: webserver\n     environment:\n       - REDIS_HOST=${APP_HOST_NAME}\n       - POSTGRES_HOST=${POSTGRES_HOST}\n       - POSTGRES_USER=${POSTGRES_USER}\n       - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}\n       - POSTGRES_DB=airflow\n       - AIRFLOW__CORE__EXECUTOR=CeleryExecutor\n       - AIRFLOW__CORE__SQL_ALCHEMY_CONN="postgresql+psycopg2://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/airflow"\n       - AIRFLOW__CELERY__RESULT_BACKEND="db+postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/airflow"\n       - AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION=False\n       - AIRFLOW__CORE__DEFAULT_TIMEZONE=Asia/Seoul\n       - TZ=Asia/Seoul\n     extra_hosts:\n       - ${APP_HOST_NAME}:${APP_HOST_IP}\n     volumes:\n       - ${APP_VOLUMN_DIR}/plugins/:/usr/local/airflow/plugins\n       - ${APP_VOLUMN_DIR}/dags/:/usr/local/airflow/dags\n       - ${APP_VOLUMN_DIR}/logs/:/usr/local/airflow/logs\n         #- ${APP_VOLUMN_DIR}/requirements.txt:/requirements.txt\n       - ${APP_VOLUMN_DIR}/temp/:/usr/local/airflow/temp\n       - /etc/localtime:/etc/localtime:ro\n     ports:\n       - "8080:8080"\n         #depends_on:\n         #- postgre\n         #- redis\n\n   airflow-scheduler:\n     build:\n       context: .\n     command: scheduler\n     environment:\n       - REDIS_HOST=${APP_HOST_NAME}\n       - POSTGRES_HOST=${POSTGRES_HOST}\n       - POSTGRES_USER=${POSTGRES_USER}\n       - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}\n       - POSTGRES_DB=airflow\n       - AIRFLOW__CORE__EXECUTOR=CeleryExecutor\n       - AIRFLOW__CORE__SQL_ALCHEMY_CONN="postgresql+psycopg2://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/airflow"\n       - AIRFLOW__CELERY__RESULT_BACKEND="db+postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/airflow"\n       - AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION=False\n       - AIRFLOW__CORE__DEFAULT_TIMEZONE=Asia/Seoul\n       - TZ=Asia/Seoul\n     extra_hosts:\n       - ${APP_HOST_NAME}:${APP_HOST_IP}\n     volumes:\n       - ${APP_VOLUMN_DIR}/plugins/:/usr/local/airflow/plugins\n       - ${APP_VOLUMN_DIR}/dags/:/usr/local/airflow/dags\n       - ${APP_VOLUMN_DIR}/logs/:/usr/local/airflow/logs\n         #- ${APP_VOLUMN_DIR}/requirements.txt:/requirements.txt\n       - ${APP_VOLUMN_DIR}/temp/:/usr/local/airflow/temp\n       - /etc/localtime:/etc/localtime:ro\n     depends_on:\n       - airflow-webserver\n\n\n   airflow-flower:\n     build:\n       context: .\n     command: flower\n     environment:\n       - REDIS_HOST=${APP_HOST_NAME}\n       - POSTGRES_HOST=${POSTGRES_HOST}\n       - POSTGRES_USER=${POSTGRES_USER}\n       - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}\n       - POSTGRES_DB=airflow\n       - AIRFLOW__CORE__EXECUTOR=CeleryExecutor\n       - AIRFLOW__CORE__SQL_ALCHEMY_CONN="postgresql+psycopg2://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/airflow"\n       - AIRFLOW__CELERY__RESULT_BACKEND="db+postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/airflow"\n       - AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION=False\n       - AIRFLOW__CORE__DEFAULT_TIMEZONE=Asia/Seoul\n       - TZ=Asia/Seoul\n     extra_hosts:\n       - ${APP_HOST_NAME}:${APP_HOST_IP}\n     volumes:\n       - ${APP_VOLUMN_DIR}/plugins/:/usr/local/airflow/plugins\n       - ${APP_VOLUMN_DIR}/dags/:/usr/local/airflow/dags\n       - ${APP_VOLUMN_DIR}/logs/:/usr/local/airflow/logs\n         #- ${APP_VOLUMN_DIR}/requirements.txt:/requirements.txt\n       - ${APP_VOLUMN_DIR}/temp/:/usr/local/airflow/temp\n       - /etc/localtime:/etc/localtime:ro\n     ports:\n       - "5555:5555"\n         #depends_on:\n         #- redis\n\n   airflow-worker:\n     build:\n       context: ./docker_with_R/\n     command: worker\n     environment:\n       - REDIS_HOST=${APP_HOST_NAME}\n       - POSTGRES_HOST=${POSTGRES_HOST}\n       - POSTGRES_USER=${POSTGRES_USER}\n       - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}\n       - POSTGRES_DB=airflow\n       - AIRFLOW__CORE__EXECUTOR=CeleryExecutor\n       - AIRFLOW__CORE__SQL_ALCHEMY_CONN="postgresql+psycopg2://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/airflow"\n       - AIRFLOW__CELERY__RESULT_BACKEND="db+postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/airflow"\n       - AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION=False\n       - AIRFLOW__CORE__DEFAULT_TIMEZONE=Asia/Seoul\n       - TZ=Asia/Seoul\n     extra_hosts:\n       - ${APP_HOST_NAME}:${APP_HOST_IP}\n     volumes:\n       - ${APP_VOLUMN_DIR}/plugins/:/usr/local/airflow/plugins\n       - ${APP_VOLUMN_DIR}/dags/:/usr/local/airflow/dags\n       - ${APP_VOLUMN_DIR}/logs/:/usr/local/airflow/logs\n         #- ${APP_VOLUMN_DIR}/requirements.txt:/requirements.txt\n       - ${APP_VOLUMN_DIR}/temp/:/usr/local/airflow/temp\n       - /etc/localtime:/etc/localtime:ro\n     ports:\n       - "8793:8793"\n     depends_on:\n       - airflow-scheduler\n'})}),"\n",(0,l.jsx)(o.h3,{id:"172-\uc2e4\ud589\uacb0\uacfc",children:"1.7.2 \uc2e4\ud589\uacb0\uacfc"}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{className:"language-bash",children:'> docker-compose -p [Project] up -d\nRemoving [Project]_airflow-webserver_1\nRecreating [Project]_airflow-flower_1                 ... done\nRecreating b415085d2612_[Project]_airflow-webserver_1 ... done\nCreating [Project]_airflow-scheduler_1                ... done\nCreating [Project]_airflow-worker_1                   ... done\n> docker ps\nCONTAINER ID        IMAGE                      COMMAND                  CREATED             STATUS              PORTS                                            NAMES\n3a82d6c17ee0        [Project]_airflow-worker      "/entrypoint.sh work\u2026"   5 seconds ago       Up 4 seconds        5555/tcp, 8080/tcp, 0.0.0.0:8793->8793/tcp       [Project]_airflow-worker_1\n87e87e660969        [Project]_airflow-scheduler   "/entrypoint.sh sche\u2026"   6 seconds ago       Up 5 seconds        5555/tcp, 8080/tcp, 8793/tcp                     [Project]_airflow-scheduler_1\nc70230f8b1d3        [Project]_airflow-flower      "/entrypoint.sh flow\u2026"   7 seconds ago       Up 6 seconds        8080/tcp, 0.0.0.0:5555->5555/tcp, 8793/tcp       [Project]_airflow-flower_1\nc726e9fdfbc2        [Project]_airflow-webserver   "/entrypoint.sh webs\u2026"   7 seconds ago       Up 6 seconds        5555/tcp, 8793/tcp, 0.0.0.0:8080->8080/tcp       [Project]_airflow-webserver_1\n>\n\n'})}),"\n",(0,l.jsx)(o.h3,{id:"173-scale-out-test",children:"1.7.3 scale-out test"}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{className:"language-bash",children:'> docker ps                                                                                                                        CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                        NAMES\n32b99476f0ab        airflow_worker      "/entrypoint.sh work\u2026"   26 seconds ago      Up 26 seconds       5555/tcp, 8080/tcp, 8793/tcp                 airflow_worker_1\nac788e72dd21        airflow_scheduler   "/entrypoint.sh sche\u2026"   27 seconds ago      Up 27 seconds       5555/tcp, 8080/tcp, 8793/tcp                 airflow_scheduler_1\n0cb6456b4869        airflow_flower      "/entrypoint.sh flow\u2026"   29 seconds ago      Up 27 seconds       8080/tcp, 0.0.0.0:5555->5555/tcp, 8793/tcp   airflow_flower_1\n4483b48d0078        airflow_webserver   "/entrypoint.sh webs\u2026"   29 seconds ago      Up 28 seconds       5555/tcp, 8793/tcp, 0.0.0.0:8080->8080/tcp   airflow_webserver_1\n> docker-compose -p airflow scale worker=2\nWARNING: The scale command is deprecated. Use the up command with the --scale flag instead.\nStarting airflow_worker_1 ... done\nCreating airflow_worker_2 ... done\n> docker ps\nCONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                        NAMES\n71e9fce448f2        airflow_worker      "/entrypoint.sh work\u2026"   4 seconds ago       Up 2 seconds        5555/tcp, 8080/tcp, 8793/tcp                 airflow_worker_2\n32b99476f0ab        airflow_worker      "/entrypoint.sh work\u2026"   44 seconds ago      Up 43 seconds       5555/tcp, 8080/tcp, 8793/tcp                 airflow_worker_1\nac788e72dd21        airflow_scheduler   "/entrypoint.sh sche\u2026"   45 seconds ago      Up 44 seconds       5555/tcp, 8080/tcp, 8793/tcp                 airflow_scheduler_1\n0cb6456b4869        airflow_flower      "/entrypoint.sh flow\u2026"   47 seconds ago      Up 45 seconds       8080/tcp, 0.0.0.0:5555->5555/tcp, 8793/tcp   airflow_flower_1\n4483b48d0078        airflow_webserver   "/entrypoint.sh webs\u2026"   47 seconds ago      Up 45 seconds       5555/tcp, 8793/tcp, 0.0.0.0:8080->8080/tcp   airflow_webserver_1\n>\n'})}),"\n",(0,l.jsx)(o.h2,{id:"18-r-package-\uc124\uce58-\ubc29\ubc95",children:"1.8 R Package \uc124\uce58 \ubc29\ubc95"}),"\n",(0,l.jsx)(o.pre,{children:(0,l.jsx)(o.code,{className:"language-bash",children:"cd ${[Project]_ROOT_DIR}/workflow/job-runner/skytale\n\nR -e \"install.packages('devtools', repos='https://cloud.r-project.org'); library(devtools); devtools::install('./')\"\n"})})]})}function d(e={}){const{wrapper:o}={...(0,s.R)(),...e.components};return o?(0,l.jsx)(o,{...e,children:(0,l.jsx)(_,{...e})}):_(e)}},8453:(e,o,n)=>{n.d(o,{R:()=>a,x:()=>i});var r=n(6540);const l={},s=r.createContext(l);function a(e){const o=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function i(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:a(e.components),r.createElement(s.Provider,{value:o},e.children)}},8843:e=>{e.exports=JSON.parse('{"permalink":"/2020/01/30/third-blog","source":"@site/blog/2020-01-30-third-blog.md","title":"Set up project dev environments","description":"summary","date":"2019-01-29T00:16:01.000Z","tags":[],"readingTime":8.615,"hasTruncateMarker":true,"authors":[{"name":"Hanbyul Cho","title":"Engineer","url":"https://github.com/hansgun","page":{"permalink":"/authors/hansgun"},"socials":{"linkedin":"https://www.linkedin.com/in/hanbyulcho1/","github":"https://github.com/hansgun"},"imageURL":"https://github.com/hansgun.png","key":"hansgun"}],"frontMatter":{"layout":"post","title":"Set up project dev environments","date":"2019-01-29 00:16:01 -0600","toc":true,"toc_label":"On This Page","toc_icon":"cog","toc_position":"sticky","authors":["hansgun"]},"unlisted":false,"prevItem":{"title":"Setup CI/CD [Jenkins+Nexus for Spring, Docker, R]","permalink":"/2019/11/17/first-blog"}}')}}]);