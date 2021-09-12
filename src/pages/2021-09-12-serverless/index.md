---
path: '/serverless'
date: '2021-09-12'
title: 'AWS Lambda + AWS API Gateway + Serverless 쓰기'
tags: ['serverless']
excerpt: '서버 없는 서버 만들기'
---

## 배경

특정한 목적 (e.g. 특정 이벤트에 따른 슬랙 알림...) 으로 API를 한두 개 만들 일이 생겼는데, 서버를 새로 띄우자니 너무 거하고 기존 서버에 붙이려니 어떤 서버에 붙일지 결정하기 마땅치 않을 때 간단하게 API를 만들 수 있다.

- serverless?
  - architecture: 인프라를 관리할 필요 없이 애플리케이션과 서비스를 구축하고 실행하는 방식. 실제로 물리적 서버가 없는 건 아니고, 이미 구축된 BaaS(Backend as-a-Service, e.g. `Firebase`) 혹은 Faas(Function-as-a-Service, e.g. `AWS Lambda`)에 의존하여 처리한다.
  - framework: 설정 파일 하나로 AWS, Azure, Google Cloud 등 서버리스 앱을 쉽게 빌드, 배포, 테스트 등을 할 수 있게 해주는 오픈소스 서비스. serverless가 제공하는 CLI 명령어를 통해 AWS 대시보드에서 다른 설정할 필요 없이 코드 관리, 배포, 유지보수가 가능하다.
- API Gateway?
  - 개발자가 API를 손쉽게 생성, 게시, 유지 관리, 모니터링 및 보안 유지할 수 있도록 하는 완전관리형 서비스. API Gateway를 통해 접근할 수 있는 도메인이 생성되므로 내, 외부에서 서버리스 앱을 호출하는 것이 가능하다.
  - RESTful API 방식, Websocket 방식, private REST 방식 등을 지원한다. 
  - Lambda와 마찬가지로 호출 양에 따라 과금된다.
  custom 도메인 설정도 가능하다.

  ![https://d1.awsstatic.com/serverless/New-API-GW-Diagram.c9fc9835d2a9aa00ef90d0ddc4c6402a2536de0d.png](https://d1.awsstatic.com/serverless/New-API-GW-Diagram.c9fc9835d2a9aa00ef90d0ddc4c6402a2536de0d.png)

## 그래서 어떻게 하면 되나요?

### 1. 포맷 설정
1. `$ npm i -g serverless` serverless를 글로벌에 설치하고, `$ serverless` 를 실행해서 적당한 템플릿을 선택
  1. starter 혹은 REST API: 함수, serverless.yml 파일 껍데기를 생성해 줌. `$ npm init` 도 해줘야 함.
  2. express API: express 형태로 코드 작성 가능. serverless-http 모듈이 AWS 서버리스 용도로 코드를 래핑해 줘서, HTTP 서버나 port 등 설정 없어도 됨.
2. 혹은 [node-lambda-jobs/src/api](https://github.com/teamdable/node-lambda-jobs/tree/master/src/api/) 내에 job을 참고해 작성

### 2. `serverless.yml` 설정
- 서버리스 service 선언, 함수, 서비스가 배포될 provider, 플러그인, event 등 정의되어 있다. JSON으로도 작성이 가능하다.

```yaml
service: serviceName

provider:
  name: aws
  stage: live # default 'dev'
  apiName: my-custom-api-gateway-name # 설정 안하면 `${stage}-${서비스명}`이 된다.
  runtime: nodejs12.x
  region: ap-northeast-2 # default 'us-east-1'
  deploymentBucket:
    name: kr-dable-workspace
  environment:
    NODE_ENV: production
    CONFIG_BUCKET: 'kr-dable-config'
  tags:
    function: api
    stage: live
    service: ad

functions:
  hello:
    handler: handler.hello
    role: arn:aws:iam::xxxxxx:role:role # 함수 실행에 필요한 role. role 생성 권한 없는 경우가 많아서, 적절한 role로 선택해 사용하면 됨.
    events: # 함수를 트리거하는 이벤트 정의. API Gateway 생성에 필요.
      - http:
          path: pause
          method: GET
      - http:
          path: alert
          method: POST
    vpc:
      securityGroupIds:
        - securityGroupId1
        - securityGroupId2
      subnetIds:
      - subnetId1
      - subnetId2
    tags:
      Name: lambda:value

plugins:
  - serverless-prune-plugin
# lambda는 배포별로 버전을 생성하고 저장해둔다.
# 과거 버전의 코드를 자동으로 삭제해주는 플러그인. 코드 관리가 편해진다.
# package.json의 devDependency에 추가되어 있어야 한다.
```

- 배포 시점에 serverless.yml → CloudFormation template으로 번역됨 → zip으로 압축되어 S3 bucket에 업로드 → CloudFormation stack 업데이트
  - CloudFormation
      AWS 및 서드파티 리소스를 모델링, 프로비저닝. 수명주기 전반을 관리하며, 리소스의 종속성을 설명해준다. stack으로 구성되어 있으며, EB 배포과정 등에서 사용된다.
- 주의사항: 들여쓰기가 잘못되면 에러가 남. 잘 확인해야 한다.

### 3. 코드 작성
- Lambda 코드에서 쓰는 패키지는 반드시 해당 디렉토리에서 설치하여 package.json에 설정되어야 한다.
- express API 형태가 아닌 경우 lambda 함수 핸들러는 차례로 `event`, `context`, `callback` 세 개의 인자를 받는다.
  - `event`: body가 포함된 객체. 서비스 별로 다르므로 확인이 필요.
  - `context`: 호출, 함수 및 실행 환경에 대한 정보가 포함.
  - `callback`: 작업이 끝날 때 호출하며, 오류가 발생한다면 첫번째 인자로 Error 객체와 응답이 전달된다.

### 4. 배포
- (aws 설정 다 되어 있다는 가정 하에) `$ serverless deploy`
- CloudFormation 권한(Required), API Gateway 권한 (optional, serverless로 배포할 경우 API Gateway 대시보드에서 직접 생성할 필요가 없음) 필요. Lambda, role 생성 권한은 없어도 됨.
- 배포

```
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service pagescreenAlertToSlack.zip file to S3 (889.42 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..............
Serverless: Stack update finished...
Service Information
service: pagescreenAlertToSlack
stage: live
region: ap-northeast-2
stack: pagescreenAlertToSlack-live
resources: 10
api keys:
  None
endpoints:
  GET - https://ufriu6h0vb.execute-api.ap-northeast-2.amazonaws.com/live/pause
  POST - https://ufriu6h0vb.execute-api.ap-northeast-2.amazonaws.com/live/alert
functions:
  pagescreenAlertToSlack: pagescreenAlertToSlack
layers:
  None
Serverless: Removing old service artifacts from S3...
```

- API Gateway → API 선택 → Stages → 도메인 확인 가능

### 5. 테스트
- error code
    - 403 No Authentication: 해당 라우트가 존재하지 않거나 정말 권한이 없음.
    - 404 not found: 해당 라우트가 존재하지 않음.
    - 500: 서버 에러. lambda의 cloudwatch를 확인해본다.

## 참고 링크

- [API Gateway tutorials](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-with-lambda-integration.html)
- [serverless user guide docs](https://www.serverless.com/framework/docs/providers/aws/guide/quick-start/)