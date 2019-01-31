---
path: '/redux-1'
date: '2018-12-10'
title: 'TIL: Redux 1'
tags: ['redux', 'react', 'TIL']
excerpt: '리덕스 공부'
---

([egghead.io Redux 기초강의](https://egghead.io/courses/getting-started-with-redux) 및 패스캠퍼스 프론트엔드 개발 스쿨 강의 내용을 바탕으로 정리한 내용입니다.)

## 1. Redux 소개

Redux 는 상태관리 라이브러리로, **1. context 기능**과 **고급 상태관리 기법** 두 가지로 이뤄져 있다.

### 1-1. context 기능

과거 context API 가 라이브러리 사용자만을 위해 비공개 설정 되어 있던 시기, context 기능을 사용하기 위해서는 무조건 Redux 를 사용했어야 했다. 지금은 context API 가 일반 사용자도 사용할 수 있으므로, 해당 기능을 사용한다는 목적으로 새로 시작하는 프로젝트에 굳이 Redux 를 써야할 필요는 없다.

다만, 기존 프로젝트에는 많이 적용되어 있으므로 학습해두는 편이 좋다.

### 1-2. 고급 상태관리 기법

무언가를 값으로 다루면 조합성이 좋아지는데 (ex. Generator, Promise...) Redux 는 **상태 변화** 를 값으로 만들었다. 상태가 변화하는 것을 값으로 만들었으므로, 상태 변화 로깅이나 undo/redo, 시간여행 등 기존 state 에서 상상하기 힘들었던 기능이 가능해진다.

### 1-3. Redux 의 세 가지 원칙

#### 1-3-1. single immutable state tree

정말 간단한 카운터 예제든 UI 가 엄청 많은 복잡한 애플리케이션이든 상관 없이, 모든 상태는 하나의 자바스크립트 객체로 표현해야 한다. 모든 상태가 하나의 객체에서 이뤄지기 때문에 시간의 흐름에 따라 변경사항을 추적할 수 있다.

#### 1-3-2. the state is read only

상태는 읽기 전용이다. 상태(트리) 객체를 변경하거나 삭제하는 것은 불가능하다. 상태를 변경하길 원한다면, 액션을 디스패치하는 방법 밖에는 없다.

- 액션 Action

  - 무슨 일이 벌어지는지를 묘사한 자바스크립트 객체로, 투입되는 상태의 변화를 나타낸다. 상태가 최소한의 데이터 표현을 의미하는 것과 비슷하게, 액션 또한 데이터에서 일어나는 변경사항을 최소한으로 나타낸 것이다. 액션 객체는 타입 속성을 가져야한다는 점을 제외하면 구조 등은 얼마든지 자유롭게 사용할 수 있다.
  - 액션을 사용하는 접근은 규모가 복잡하거나 큰 경우에도 잘 적용될 수 있다. 컴포넌트는 어떤 식으로 변경이 이뤄지는지 알 수 없다. 컴포넌트가 알아야 하는 것은 변경이 일어날 때 타입이 있는 액션을 디스패치해야 한다는 점이다.

- 디스패치 Dispatch
  - 액션을 스토어에 보내는 행위.

#### 1-3-3. Changes are made with pure functions

참고. Pure and Impure Functions

**순수 함수**

```js
function square(x) {
  return x * x;
}
function squareAll(items) {
  return items.map(square);
}

// 같은 인수가 들어오면 무조건 리턴값이 같아야 한다.
// 순수함수는 네트워크나 데이터베이스 등에 부수효과를 일으켜서는 안된다.
// 위 예제를 보면, 전달받은 인자를 변경하는 것이 아니라 새 배열을 반환한다.
```

**비순수 함수**

```js
function square(x) {
  updateXInDatabase(x);
  return x * x;
}
function squareAll(items) {
  for (let i = 0; i < items.length; i++) {
    items[i] = square(items[i]);
  }
}
// 전달받은 인자값이 덮어씌어지거나, 데이터베이스가 호출되는 등 부수효과가 일어난다.
```

리듀서는 이전 상태와 액션을 매개변수로 받아 다음 상태를 반환하는 순수 함수다. 리듀서는 이전 상태를 변경하는 대신, 새로운 상태 객체를 생성해서 반환해야 한다.

UI 혹은 뷰단에서 상태가 순수함수일 때 가장 예측가능한 상태라는 점에 대해 들어본 적이 있을 것이다. (e.g. React) 리덕스는 이전 상태와 디스패치된 액션을 받아 다음 상태를 반환하는 순수함수로 상태를 변경해야 한다는 또다른 아이디어를 통하여 위와 같은 접근을 보충한다. 전달받은 상태를 변경하지 않고 새로운 객체를 반환하는 것이 매우 중요하다. 규모가 큰 애플리케이션에서도 다음 상태가 이전 상태와 디스패치된 액션에 따라 어떻게 계산되어야 하는지를 관리하는 오로지 하나의 함수만이 있을 뿐이다. 이를 통하여 상태의 이전 참조를 계속 유지할 수 있고, 상태를 바꾸는 게 아니기 때문에 리덕스는 속도가 빠르다.

### 1-4. Redux 의 구성

#### 1-4-1. redux 용어

- store: 여러 기능을 갖추고 있는 상태 저장소.
- action: 투입되는 상태 변화를 나타내는 값(객체). store 에 action(객체)을 넣으면 state 가 변한다.
  - dispatch: action 을 store 에 보내는 행위
- reducer: action 과 state 의 관계를 알려주는 함수. 이전 state 와 action 을 매개변수로 받아서 다음 상태를 반환한다. reducer 는 store 의 상태 변화를 실제로 처리하며, 상태를 어떻게 바꿔야 하는지를 알려준다.
- subscribe: 상태가 바뀔 때마다 실행할 함수를 등록하는 절차. action 이 dispatch 될 때 React 세계에서 setState 를 호출한다. (말하자면 이벤트 리스너를 등록하는 것과 같다.)

#### 1-4-2. redux 사용하기

1. 처음 store 를 만들 때 reducer 를 넣는다.
1. store 에서 상태와 dispatch 를 react 에 내려준다.
1. action 이 dispatch 되면 store 는 자기가 가진 state 와 action 을 reducer 에 넣어 다음 state 를 계산한다.
1. subscribe 를 통해 react 의 state 를 바꾼다.

---

## 2. 예제 통해 Redux 살펴보기: Counter

### 2-1. Reducer

```js
const counter = (state = 0, action) => {
  // state가 undefined라면 초기값을 내려주는 것이 관례.
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
    // 정의되지 않은 액션이 내려왔을 때를 대비하여 default 값을 지정해준다.
  }
};
```

e.g. React 와 결합한 reducer 예제

```js
const { combineReducers, createStore } = require('redux');

// reducer에 action 과 previous state 를 넣어 next state를 계산해 보자!

// Counter 상태 저장소
// '증가'를 나타내는 action이 dispatch되었을 때, Counter 상태를 1 증가 시키고 싶다.

// INCREASE action
// const increaseAction = {
//   type: 'INCREASE'
// }
// action 대신 action creator를 만드는 것이 관례!

// INCREASE action creator
// action을 반환하는 함수
function increase(amount) {
  return {
    type: 'INCREASE',
    amount,
  };
}

// const decreaseAction = {
//   type: 'DECREASE'
// }
function decrease(amount) {
  return {
    type: 'DECREASE',
    amount,
  };
}

function zero() {
  return {
    type: 'ZERO',
  };
}

// let state = {
//   counter: 0
// }
// store에서 관리할 예정. 이렇게도 쓸 수 있다는 것을 알아두자!

// Redux에서 초기 상태를 지정해주는 방법
// 1. state 매개변수 기본값에 초기 상태를 지정해 준다.
// 2. case 중 default 에서 초기값을 반환한다.
// redux store는 초기 상태를 계산하기 위해
// state에 undefined, action에 빈 객체를 넣는다.

const initialState = {
  counter: 0,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREASE':
      return {
        counter: state.counter + action.amount,
      };
    case 'DECREASE':
      return {
        counter: state.counter - action.amount,
      };
    case 'ZERO':
      return {
        counter: 0,
      };
    default:
      return state;
    // reducer 안에서는 default case를 빠트려서는 안 된다.
    // why? =>
    // 1. 초기 상태 계산을 위해
    // 2. 알 수 없는 타입의 action이 들어와도 다음 상태를 잘 반환하기 위해
  }
}

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));
```

### 2-2. Store

```js
import { createStore } from 'redux'; // npm module syntax
// const { createStore } = Redux; // Redux CDN import syntax

const store = createStore(counter);
```

createStore 는 Redux 의 함수이며, 매개변수로는 리듀서를 받는다. 1 에서 언급한 리덕스의 세 가지 원칙을 함께 묶어주는 역할을 한다. (상태 객체를 가지고 있고, 액션을 디스패치할 수 있으며, 상태가 어떻게 업데이트 되어야 하는지를 말해주는 리듀서를 가진다.)

store 는 아래와 같은 역할을 한다.

1. 애플리케이션의 상태를 저장;
1. getState()를 통해 상태에 접근;
1. dispatch(action)를 통해 상태를 수정;
1. subscribe(listener)를 통해 콜백을 등록하여 액션이 디스패치될 때마다 UI 를 업데이트할 수 있도록 앱의 상태에 반영;

```js
const store = createStore(counter);

// getState()
console.log(store.getState()); // 0

// dispatch()
store.dispatch({ type: 'INCREMENT' });
console.log(store.getState()); // 1

// subscribe()
const render = () => {
  document.body.innerText = store.getState();
};
store.subscribe(render);
render();
// calling once to render the initial state (0),
// then the subscribe will update subsequently

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});
```

#### 2-2-1. 바닥부터 Store 구현하기

```js
const createStore = reducer => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };
  // 액션을 디스패치하는 것이 내부 상태를 바꾸는 유일한 방법이므로,
  // 현재 상태와 디스패치된 상태를 reducer에 넣은 결과를 통해 새로운 상태를 계산할 수 있다.
  // 상태가 업데이트되면 모든 변경 리스너를 호출해서 알림을 보낸다.

  const subscribe = listener => {
    listeners.push(listener);
    // subscribe() 함수는 여러 번 호출될 수 있으므로 모든 변경 리스너를 추적할 수 있어야 한다.
    // 따라서 리스너 배열을 생성해서 subscribe가 호출될 때마다 새로운 리스너를 배열에 넣는다.
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
    // 이벤트 리스너 구독을 취소(unsubscribe)하려면
    // 리스너 배열에서 해당 리스너를 삭제하는 함수를 subcribe 메소드에서 반환한다.
  };

  dispatch({});
  // dummy dispatch. (리듀서가 초기값을 반환할 수 있도록 더미 액션을 디스패치한다.)

  return { getState, dispatch, subscribe };
};
```

### 2-3. redux react binding 안하고 Counter 구현하기

```js
// reducer
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

// counter component는 어떤 비즈니스 로직도 포함하지 않음.
const Counter = ({ value, onIncrement, onDecrement }) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

// store (React CDN 사용)
const { createStore } = Redux;
const store = createStore(counter);

const render = () => {
  ReactDOM.render(
    // render 함수는 store의 state가 변경될 때마다 호출(subscribe)되므로
    // store의 현재 상태를 prop으로 내려줘도 안전함.
    <Counter
      value={store.getState()}
      // action & dispatch (callback 등록)
      onIncrement={() =>
        store.dispatch({
          type: 'INCREMENT',
        })
      }
      // action & dispatch (callback 등록)
      onDecrement={() =>
        store.dispatch({
          type: 'DECREMENT',
        })
      }
    />,
    document.getElementById('root')
  );
};

// subscribe
store.subscribe(render);
render();
```

### 3. Avoiding Array/Object Mutations

#### 3-1. 배열 불변성 유지하기: concat(), slice(), and ...spread

Reducer 를 만들 때 `push`, `splice`, `증가/감소 연산자(++, --)` 등 원 배열을 변경하는 배열 메소드 대신, 복사된 배열을 반환할 수 있는 `concat`, `slice`, `[...spread]`를 사용해야 한다.

```js
// push 대신 concat
const addCounter = list => {
  // return list.concat([0]) (ES5 이전)
  return [...list, 0];
};

// splice 대신 slice ([0, 10, 20] 입력받아 [0, 20] 반환하고 싶을 때)
const removeCounter = (list, index) => {
  // return list
  //  .slice(0, index)
  //  .concat(list.slice(index + 1)); (ES5 이전)
  return [...list.slice(0, index), ...list.slice(index + 1)];
};

// [0, 10, 20] 을 입력받았을 때 결과값은 [0, 11, 20] 이도록 만들고 싶을 때
const incrementCounter = (list, index) => {
  // return list
  //  .slice(0, index)
  //  .concat([list[index] + 1])
  //  .concat(list.slice(index + 1)); (ES5 이전)
  return [...list.slice(0, index), list[index] + 1, ...list.slice(index + 1)];
};
```

참고 링크

[Inserting and Removing Items in Arrays](https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns#inserting-and-removing-items-in-arrays)

#### 3-2. 객체 불변성 유지하기: Object.assign(), ...spread

```js
const toggleTodo = todo => {
  // 방법 1.
  // return {
  //     id: todo.id,
  //     text: todo.text,
  //     completed: !todo.completed
  // };
  // 새로운 요소가 추가되었을 때 수정/추가하는 것을 잊을 수 있음.

  // 방법 2. Object.assign() 사용하기
  // return Object.assign({}, todo, {
  //   completed: !todo.completed,
  // });
  // 겹치는 것이 있으면 가장 마지막에 들어온 값이 덮어쓴다.

  // 방법 3. object spread operator
  return {
    ...todo,
    completed: !todo.completed,
  };
};
```

## 4. 예제 통해 Redux 살펴보기: TO DO App

### 4-1. TO DO App reducer 작성하기 (add, toggle)

```js
// reducer
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false,
        },
      ];
    case 'TOGGLE_TODO':
      return state.map(todo => {
        if (action.id === todo.id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        } else {
          return todo;
        }
      });
    default:
      return state;
  }
};

// test
const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux',
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false,
    },
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(todos(stateBefore, action)).toEqual(stateAfter);
};

const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false,
    },
    {
      id: 1,
      text: 'Go Shopping',
      completed: false,
    },
  ];
  const action = {
    type: 'TOGGLE_TODO',
    id: 1,
  };

  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false,
    },
    {
      id: 1,
      text: 'Go Shopping',
      completed: true,
    },
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(todos(stateBefore, action)).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
console.log('All tests passed.');
```

[repl.it 링크](https://repl.it/@tinytinystone/redux-todo-app1)

### 4-1. reducer 조합하기

#### 4-1-1. reducer 조합하기: 배열

리듀서 합성(reducer composition)은 유지보수가 쉬운 기본 패턴이다. 위에 작성한 리듀서 `todos`는 개별 객체인 `todo`와 함께 있어서 한 눈에 들어오지 않는다. 배열을 이용하여 합성할 수 있다.

```js
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case 'TOGGLE_TODO':
      if (action.id === state.id) {
        return {
          ...todo,
          completed: !action.completed,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, todo(undefined, action)];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};
```

#### 4-1-2. reducer 조합하기: 객체

더 많은 정보를 저장하기를 원하는 경우에도 또 다른 reducer 를 생성하여 합성할 수 있다. 가령, To do app 에서는 완료된 일이나 아직 진행 중인 일 등 사용자가 어떤 할 일 목록을 보고 싶은지를 선택하고 싶을 수 있다. 이러한 정보를 저장하기 위해서, 기존의 리듀서를 수정할 필요는 없다. 상태의 일부분을 관리하는 기존 리듀서를 호출하고, 결과값을 단일 상태 객체로 합치는 새로운 리듀서를 만들면 된다.

```js
// 추가된 reducer
const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};
// `visibilityFilter`에서의 상태는 현재 선택된 필터를 나타내는 단순한 문자열이다.
// 이 상태는 action인 `SET_VISIBILITY_FILTER`로 변경된다.

// reducer 합성
const todoApp = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
  };
};
```

`todoApp`이 실행되면, 먼저 자식 리듀서 상태에 `undefined`가 전달된다. 그러면 자식 리듀서는 초기 상태 트리를 반환하고 처음으로 상태 객체가 채워지게 된다. 그리고 액션이 들어오면 리듀서를 호출해서 상태와 액션을 다시 전달하게 하고 새로운 상태 객체로 그 결과값이 합쳐진다.

`createStore` 함수는 여러 개의 리듀서를 하나로 합쳐서 스토어를 생성한다.

합쳐진 리듀서의 초기 상태는 이제 독립적인 리듀서들의 초기 상태를 포함하게 된다. 액션이 들어올 때마다 이 리듀서는 액션을 독립적으로 처리한다. 즉, `SET_VISIBILITY_FILTER` 액션을 디스패치 하더라도 `todos`에는 변경이 없다.

이 패턴은 리덕스 개발의 규모를 키워나가는 데 도움이 된다. 여러 다른 사람들이 각각의 리듀서를 가지고 일하면서도 병합 이슈 없이 같은 액션을 다룰 수 있기 때문이다.

#### 4-1-3. combineReducers()

리덕스는 4-1-3 에서 언급한 리듀서 합성을 쉽게 해주는 함수를 이미 가지고 있다. combineReducers()가 그 함수다. 4-1-3 의 todoApp 과 아래 코드는 동일하게 동작한다.

```js
import { combineReducers } from 'redux';

const todoApp = combineReducers({
  // 상태의 필드 이름: 리듀서 형태
  todos: todos,
  visibilityFilter: visibilityFilter,
});
```

[React Todo List Example (Adding a Todo, codesandbox)](https://codesandbox.io/s/rm5j9v2p3q)

##### 4-1-3-1. combineReducers() 바닥부터 구현하기

```js
const combineReducers = reducers => {
  return (state = {}, action) => {
    // Reduce all the keys for reducers from `todos` and `visibilityFilter`
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        // Call the corresponding reducer function for a given key
        nextState[key] = reducers[key](state[key], action);
        return nextState;
      },
      {} // The `reduce` on our keys gradually fills this empty object until it is returned.
    );
  };
};
```

combineReducers()의 유일한 인수는 상태의 키와 값을 중괄호로 둘러싼 것이므로, `reducers`라는 이름의 매개변수를 받는 함수를 적는 것으로 시작한다.

combineReducers()는 reducer 함수를 반환하기 때문에, reducer 함수의 특징(상태, 액션)을 가져야 한다. 반환되는 reducer 내부에는, Object.keys() 함수를 호출해서 `reducers` 객체로부터 키를 가져온다. (우리 예제에서 생각해보면 todo 와 visibilityFilter 다.)

그리고 키값에 대하여 reduce() 메소드를 실행해서 다음 상태를 나타내는 하나의 누적값을 생성하도록 한다. 모든 키를 누적하고 해당 리듀서를 실행한다.

combineReducers()에서 실행되는 각각의 리듀서는 애플리케이션 전체 상태의 일부분만을 책임지고 있기 때문에, 주어진 키에 해당하는 다음 상태는 관련한 리듀서를 현재 상태와 액션이라는 주어진 키로 호출해서 계산해야 한다.

배열 메소드 reduce 는 콜백(nextState)으로부터 다음 누적값을 반환하길 원한다. 또한 초기값으로 빈 객체를 명시해주어야 한다.

- 참고 링크
  - [JS reduce 메소드](https://devdocs.io/javascript/global_objects/array/reduce)

```js
array.reduce((accumulation, item, index, array) => {
  // 함수
}, initialValue);
// return 값은 accumulation
```

## 5. Redux 장점 및 단점

### 5-1. 장점

1. 사용자가 어떤 액션을 했고, 어떤 데이터가 어떻게 변경되었는지 쉽게 관찰할 수 있다. 이 모든 내용은 기록되고, 개발자는 이전의 특정 상태로 돌아가볼 수 있다. (시간 여행이 가능하고, 버그가 나기 이전 상태로 돌아가서 테스트해볼 수 있다.)
1. 데이터를 localStorage 에 저장할 수 있다. 사용자는 브라우저를 종료하고 다시 들어와도 완전 동일한 시점부터 다시 진행할 수 있다.
1. 많은 사용자들이 동시에 다양한 작업을 하는 서비스 (e.g. 페이스북) 에서 힘을 발휘한다. 다른 기기의 다른 사용자의 액션을 받아, 로컬의 작업과 합쳐서 보여줄 수 있다.

### 5-2. 단점

1. 수많은 전역 상태가 생겨나서 관리가 어렵다.
1. 큰 상태트리가 생겨서 부하가 발생할 수 있다.
1. 코드량이 많고 (보일러 플레이트) Redux 외에 수많은 라이브러리와 결합하여 사용해야 하므로 난이도가 높아진다.
