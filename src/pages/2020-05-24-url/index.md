---
path: '/debug-lambda'
date: '2020-05-27'
title: 'URL은 대소문자 구분을 할까'
tags: ['url', 'web']
excerpt: '정답: 하기도 하고 안하기도 한다'
---

URL은 대소문자를 구분할까?

https://username:password@sub.example.com:8080/p/a/t/h?query=string#hash
이라는 URL이 있다고 할 때, 이 URL의 구성을 살펴보면 다음과 같다.

`https:`: protocol.
`username:password`: auth.
`sub.example.com:8080`: host. 
`sub.example.com`: hostname
`/p/a/t/h`: path. 서버 내에서 리소스 경로를 나타낸다.
`8080`: port
`?query=string`: search

이때, URL에서 프로토콜과 호스트 주소는 대소문자를 구분하지 않는다. 

리소스 경로 부분은 웹서버의 운영체제 등에 따라 구분하는 경우가 있다. 윈도 기반의 운영체제라면 디렉터리 명 혹은 파일명에서 대소문자를 구분하지 않으나, 리눅스 혹은 유닉스 계열의 서버라면 대소문자를 구분한다. 

쿼리스트링 부분은 사용된 프로그래밍 언어의 문법에 따라 구분할 수도 있고, 구분하지 않을 수도 있다.

최근 host 영역에서 대소문자를 구분하지 않는 것 때문에 에러를 낸 적이 있다.

```
const a = 'https://www.DaBLE.Io/ads/ABcdEFG?service=chosun'
const b = new URL(a).toString()
```

a와 b는 같지 않다. 왜냐면 host 부분은 소문자로 변경되기 때문이다. (즉, 'https://www.dable.io/ads/ABcdEFG?service=chosun'로 변한다.)

브라우저에서 대문자로 도메인 주소명을 치더라도 소문자로 바뀐다.