---
path: '/debug-lambda'
date: '2020-05-11'
title: 'AWS Lambda에서 timeout이 발생할 때'
tags: ['retrospective', 'debug', 'lambda']
excerpt: '코드에는 문제가 없는 것 같은데, 왜 timeout이 발생했을까'
---

AWS Lambda로 기존에 있던 잡에 redis에 캐싱을 하는 기능을 새롭게 추가했다. 그런데 자꾸 timeout이 발생하는 문제가 생겼다. 

내 경우에는 두 가지 문제가 있었다. 하나는 security group 이슈였다. 해당 함수에 redis를 새롭게 추가했기 때문에, 보안 그룹에서 redis와 관련한 그룹도 추가를 해주어야 했다. 이때문에 로컬에서 돌렸을 때는 문제가 없었는데, VPC에 연결하니 timeout 오류가 발생한 것이다. 꼭 labmda가 아니더라도, AWS에서 서버에 접속이 안되거나 timeout 에러를 겪게 된다면 보안 그룹 미설정인지를 가장 먼저 의심해봐야 한다.

다른 하나는, redis connection을 종료하지 않아서 Lambda 함수의 실행이 종료되지 않아 생기는 문제였다. Lambda는 이벤트 루프가 비워질 때까지 기다린 다음에 응답 혹은 오류를 호출자에게 반환한다. 즉, 프로세스를 종료하거나 redis connection을 끊지 않아 이벤트 루프가 남아 있었기 때문에 지속적으로 timeout이 발생했다.

- [참고 링크1 - VPC에서 Lambda 함수의 제한 시간 문제를 해결하려면 어떻게 해야 합니까?](https://aws.amazon.com/ko/premiumsupport/knowledge-center/lambda-vpc-troubleshoot-timeout/)
- [참고 링크2 - AWS Lambda 함수 핸들러(Node.js)](https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/nodejs-handler.html)