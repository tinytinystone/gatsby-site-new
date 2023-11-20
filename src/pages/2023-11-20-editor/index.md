---
path: '/input-event'
date: '2023-11-20'
title: 'change 이벤트와 input 이벤트 차이점'
tags: ['html']
excerpt: 'react에서 onChange가 이상한 것이었다!'
---

## change 이벤트

`<textarea>`에서 value가 입력될 때마다 감지해야 하는 경우가 생겼다. react가 아니고 vanilla JS를 써야 했는데, change 이벤트의 동작 방식이 기대한 것과 달랐다.

change 이벤트가 발생하는 시점은 아래와 같다.

- `<input type="checkbox">` 요소를 클릭/체크/해제할 때
- `<input type="radio">` 요소를 체크할 때 (해제될 때는 발생하지 않음)
- 사용자가 변경사항을 직접 반영할 때 (`<select>` 드롭다운 값 클릭, `<input type="date">` 달력에서 날짜 선택, `<input type="file">`에서 파일 선택 등)
- `<textarea>`, `<input>`에서 사용자가 타이핑한 입력값이 변경된 뒤 포커스를 잃었을 때(ex. enter 키를 누른다거나, 마우스 포커스를 변경하는 등)

## input 이벤트

만약 요소의 값이 입력받아 변경될 때마다 발생하는 이벤트가 필요하다면, 그때는 input 이벤트를 사용해야 한다.

```
The input event is fired every time the value of the element changes. This is unlike the change event, which only fires when the value is committed, such as by pressing the enter key or selecting a value from a list of options. Note that the input event is not fired when JavaScript changes an element's value programmatically.
```

react에서의 onChange 이벤트는 사실 상 input 이벤트와 같은 동작방식이다. 실제로 react에서 onChange 이벤트 대신 onInput 이벤트를 사용해도 동일한 동작을 보여준다고 하는데, onChange를 쓰기를 권장하고 있다고. (관련 [github issue](https://github.com/facebook/react/issues/3964)) 공식 웹 API 동작과 달라서 나도 헷갈렸다.

[input event(MDN)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
[change event(MDN)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)

