---
path: '/redux-1'
date: '2018-12-10'
title: 'TIL: Redux 1'
tags: ['redux', 'react', 'TIL']
excerpt: '리덕스 공부'
image: './redux_structure_1.png'
---

# 요약

## Redux 소개

- **Redux** 는 상태관리 라이브러리로, context 기능과 고급 상태관리 기법 두 가지로 이뤄져 있다.
  - 과거 context API 가 라이브러리 사용자만을 위해 비공개 설정 되어 있던 시기, context 기능을 사용하기 위해서는 무조건 Redux 를 사용했어야 했다.
    - 지금은 context API 가 일반 사용자도 사용할 수 있으므로, 해당 기능을 사용한다는 목적으로 새로 시작하는 프로젝트에 굳이 Redux 를 써야할 필요는 없다.
    - 다만, 기존 프로젝트에는 많이 적용되어 있으므로 학습해두는 편이 좋다.
  - 무언가를 값으로 다루면 조합성이 좋아지는데 (ex. Generator, Promise...) Redux 는 **상태 변화** 를 값으로 만들었다. 상태가 변화하는 것을 값으로 만들었으므로, 상태 변화 로깅이나 undo/redo, 시간여행 등 기존 state 에서 상상하기 힘들었던 기능이 가능해진다.

## Redux 의 구성

Redux 를 이해하기 위해서는 `store`, `action`, `dispatch`, `subscribe`, `reduce`에 대한 이해가 필요하다.

![redux 구조](./redux_structure_1.png)

- store: 여러 기능을 갖추고 있는 **상태 저장소**
- action: 투입되는 상태 변화를 나타내는 값(객체)
  - store 에 action(객체)을 넣으면 state 가 변한다.
- dispatch: action 을 store 에 보내는 행위
- subscribe: 상태가 바뀔 때마다 실행할 함수를 등록하는 절차. action 이 dispatch 될 때 setState 를 호출한다.
  - 말하자면 이벤트 리스너를 등록하는 것과 같다.
- reducer: action 과 state 의 관계를 알려주는 함수. 이전 state 와 action 을 매개변수로 받아서 다음 상태를 반환한다.
  - reducer 는 store 의 상태 변화를 실제로 처리한다.

## redux 사용하기

1. 처음 store 를 만들 때 reducer 를 넣는다.
1. action 이 dispatch 되면 store 는 자기가 가진 state 와 action 을 reducer 에 넣어 다음 state 를 계산한다.
1. subscribe 를 통해 react 의 state 를 바꾼다.

## 코드

- [Reduce Exercise 1(repl.it)](https://repl.it/@tinytinystone/redux-exercise-1)

[Reduce Exercise 2(repl.it)](https://repl.it/@tinytinystone/redux-exercise-2)
