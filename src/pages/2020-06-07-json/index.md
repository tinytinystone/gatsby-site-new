---
path: '/json'
date: '2020-06-07'
title: 'JSON은 undefined를 지원하지 않습니다'
tags: ['json']
excerpt: '자바스크립트는 왜 그 모양일까를 읽으면서..'
---

요며칠 ['자바스크립트는 왜 그 모양일까?'](http://www.yes24.com/Product/Goods/90283410)를 읽고 있다. 최근 자바스크립트 객체를 JSON으로 바꾸는 과정에서 이슈가 있었는데, 이에 대한 내용이 나와서 정리해 본다.

JSON(JavaScript Object Notion)은 JavaScript 구분에 기반을 두고 있긴 하나 어떤 언어와도 독립적인 형태로, XML을 대체하는 데이터 교환 포맷이다. 그래서 JavaScript에는 존재하지만 JSON에서는 지원하지 않는 것이 존재한다. 그 중 하나가 `undefined`이다.

```js
const obj = {
  foo: undefined,
  bar: null
}
```

JavaScript에서는 `null`과 `undefined`를 구분한다. 그리고 값으로 할당도 가능하다. 그런 상황에서 위와 같은 코드는 전혀 문제가 되지 않는다. JS에서는 객체에 `undefined`를 저장할 수 있다. (물론, 조금 깊이 생각해 보면 이상한 상황이기는 하다. undefined라는 값을 가지는 속성은 undefined를 반환하겠지만 실제로 '없는 것'은 아니다... 좀 이상하다.)

헌데, JSON에서는 객체의 값으로 `undefined`가 저장될 경우 해당 속성 자체를 삭제해 버린다. 즉, `foo` 속성이 사라진다.

```js
console.log(JSON.stringify({
  foo: undefined,
  bar: null
}))
// 결과: "{"bar":null}"
```

디버깅을 할 일이 있어서 JSON 형태로 객체를 console에 찍었는데, 결과값이 제대로 전달되지 않은 채로 해당 속성 자체가 없어져서 의아했던 적이 있다. 그 이유를 이제 깨닫게 되었다.ㅎㅎ

참고로 JSON은 `NaN`, `Infinity`를 지원하지 않는다(`null`은 지원한다). 또 문자열의 작은따옴표를 금지하고 있으며, 주석 또한 지원하지 않는다. 

```js
console.log(JSON.stringify({bar: NaN}))
// "{\"bar\":null}"
console.log(JSON.stringify({bar: Infinity}))
// "{\"bar\":null}"
console.log(JSON.stringify({bar: undefined}))
// "{}"
```