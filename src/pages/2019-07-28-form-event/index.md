---
path: '/form-event'
date: '2019-07-28'
title: 'form에서 일어난 이상한 동작 이해하기'
tags: ['html', 'event', 'form']
excerpt: 'input 요소에서 Enter 키를 누르면 이상한 곳으로 이동하는 현상'
---

한 대시보드의 동작이 이상하다는 버그 제보를 받아 수정하게 되었다. input 요소에서 Enter 키를 누르면 작성한 내용이 제출되는 것이 아니라 원하지 않는 페이지로 이동한다는 것이었다.

대시보드는 react로 작성되어 있었고, 여러 컴포넌트와 이벤트 메소드가 어지럽게 섞여 있어 원인을 찾는 것이 쉽지 않았다. 가장 먼저 의심했던 것은 form 요소에 따로 sumbit 이벤트가 걸려있지 않을까 했는데 없었고, keydown 같은 이벤트도 걸려있지 않았다. 

그나마 내가 발견한 건 두 가지 정도였다. 하나는 form 요소 내에 컴포넌트로 연결된 코드에서 a 요소로 둘러싼 button 요소가 해당 페이지로 연결되는 링크라서 이것과 관련이 있을 것 같다는 것이었고, 다른 하나는 form 요소를 div 같은 것으로 바꾸면 문제가 사라진다는 것이었다. 전체 내용을 저장하는 방식은 가장 아래의 button에 click 이벤트로 처리하고 있어서, form을 삭제하는 것이 가장 편리한 해결책이었지만 원인을 찾는 것이 더 낫겠다는 생각이 들었다.

며칠 고민했는데도 원인을 못 찾아서 팀에 공유했고, 동료분이 원인으로 추정되는 부분을 바로 찾아내 주셨다! form 요소 내에서 딱 한 개만 제외하고 button 요소가 `type=button`으로 지정되어 있었는데, 지정되지 않는 button이 바로 위에서 말한 녀석이었다. 그러니까 **type을 지정하지 않은 button 요소는 form 내에서 자동적으로 submit type으로 지정** 되기 때문에 발생한 문제인 것 같았다! 실제로 button의 type을 바꾸니까 문제가 사라졌다.

form의 기본 동작을 조금 더 살펴보았다. 각각의 코드에서 Enter 키를 눌렀을 때의 반응을 정리해 보았다.

```html
<!-- 한 개의 input만 있을 때, sumbit 이벤트 발생  -->
<form>
  <input type="text">
</form>

<!-- input 여러 개이면 이벤트 발생 안 함  -->
<form>
  <input type="text">
  <input type="text">
  <input type="text">
</form>

<!-- button 타입 지정 안하면, button이 type=submit으로 인식하여 sumbit 이벤트 발생 -->
<form>
  <input type="text">
  <input type="text">
  <input type="text">
  <button>버튼</button>
</form>

<!-- 반응 없음 -->
<form>
  <input type="text">
  <input type="text">
  <input type="text">
  <button type="button">버튼</button>
</form>
```

내가 겪은 상황은, 조금 더 복잡했다. button 요소를 a 태그가 둘러싸고 있는데, a 요소에 click 이벤트가 걸려 있었다. (정확히 말하자면, react-router의 Link 컴포넌트가 button을 둘러싸고 있었고, Link 컴포넌트에는 onClick 이벤트가 걸려 있다.)

```html
<form>
  <a href="/">
    <button>버튼</button>
  </a>
  <input type="text">
  <input type="text">
</form>
```

```js
const formEl = document.querySelector('form')
formEl.addEventListener('submit', e => {
  alert('form submit 이벤트!')
})
const aEl = document.querySelector('a')
aEl.addEventListener('click', e => {
  alert('a 클릭!')
})
const buttonEl = document.querySelector('button')
buttonEl.addEventListener('click', e => {
  alert('button 클릭!')
})
```

이 경우 input에서 Enter 키를 누르면, **button의 click 이벤트 -> a의 click 이벤트 -> form의 submit 이벤트** 가 차례로 발생한다. 아마도, button의 sumbit 이벤트와 click 이벤트가 같이 발생하고, click 이벤트의 버블링 현상으로 인해서 이런 일이 일어난 것 같다. [코드펜에서 확인하려면 클릭!](https://codepen.io/tinystone/pen/dxOByZ)

꽤 오랜 시간을 삽질했지만 (ㅠㅠ) 흥미로운 현상을 한번 탐구해볼 수 있는 기회(!)여서 즐거웠다.
