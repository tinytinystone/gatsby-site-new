---
path: '/redux-4'
date: '2019-02-12'
title: 'TIL: Redux 4'
tags: ['redux', 'react', 'TIL']
excerpt: '리덕스 공부'
---

# Building React Applications with Idiomatic Redux

## 15. 페치된 데이터를 가지고 액션 디스패치 하기

데이터를 가져온 후에 Redux 액션을 전달하는 방법을 배우고, 라우터가 변경될 때는 어떻게 하면 좋은지를 다시 설명합니다.

라이프사이클 훅 사이에 공통된 코드를 별도의 메서드로 추출 할 수 있습니다. 이를 fetchData 라고 부릅시다. 여기서 가져올 데이터는 filter 에만 의존합니다.

초기 데이터를 가져 오기 위해, componentDidMount() 훅에서 이 메소드를 호출합니다. 또한 filter 가 componentDidUpdate() 훅 내에서 변경 될 때마다 호출합니다.

**VisibleTodoList.js**

```js
class VisibleTodoList extends Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      this.fetchData();
    }
  }

  fetchData() {
    fetchTodos(this.props.filter).then(todos =>
      console.log(this.props.filter, todos)
    );
  }
  .
  .
  .
```

### fetchData() 업데이트 하기

가져온 todos 가 Redux store 의 상태가 되기를 원합니다. 어떤 것을 상태로 가져 오는 유일한 방법은 액션을 전달하는 것입니다.

우리는 방금 가져온 todos 를 콜백 prop 인 receiveTodos 라고 부릅니다.

```js
fetchData() {
  fetchTodos(this.props.filter).then(todos =>
    this.props.receiveTodos(todos)
  );
}
```

컴포넌트 내에서 사용할 수 있게 하려면, receiveTodos 라는 함수를 전달해야 합니다. 이 함수는 `connect`의 두 번째 인수 안에서 액션 크리에이터가 됩니다. 함수의 이름이 콜백 prop 의 이름과 일치하기 때문에, ES6 Object 속성 표기법을 사용해서 더 짧게 작성할 수 있습니다.

다른 모든 액션 크리에이터가 정의된 파일에서 receiveTodos 를 import 해옵니다.

```js
// At the top of `VisibleTodoList.js`
import { toggleTodo, receiveTodos } from '../actions'

...

// At the bottom of `VisibleTodoList.js`
VisibleTodoList = withRouter(connect(
  mapStateToProps,
  { onTodoClick: toggleTodo, receiveTodos }
)(VisibleTodoList))
```

### receiveTodos 구현하기

이제 실제로 receiveTodos 를 구현해야 합니다.

액션 크리에이터 파일 (src/actions/index.js) 안에는 서버 `response`를 인수로 하고, 'RECEIVE_TODOS'의 `type`과 및 `response`를 필드로 가지는 객체를 반환하는 `receiveTodos` 함수의 새 export 를 만듭니다.

**src/actions/index.js 내부**

```js
export const receiveTodos = response => ({
  type: 'RECEIVE_TODOS',
  response,
});
```

이 액션을 처리하는 리듀서는 응답과 같은 것이 어떤 filter 인지를 알아야 하므로, `receiveTodos` 액션 크리에이터에 인수로 `filter`를 추가하고 이를 액션 객체의 일부로 전달합니다.

```js
export const receiveTodos = (filter, response) => ({
  type: 'RECEIVE_TODOS',
  filter,
  response,
});
```

### `filter`를 사용하여 VisibleTodoList 컴포넌트 업데이트 하기

`VisibleTodoList`로 돌아가서, `fetchData`를 업데이트하여 액션 크리에이터를 통해 필터를 전달합니다.

ES6 분해대입 구문을 사용하면 `prop`으로부터 `filter`와 `receiveTodos`를 바로 가져올 수 있습니다. `filter`를 바로 분해대입할 수 있는 것은 매우 중요한데, 콜백이 실행되었을 때 사용자가 페이지를 닫아서 `this.props.filter`가 아마도 변경되었을 수 있기 때문입니다.

**Inside VisibleTodoList**

```js
fetchData() {
  const { filter, receiveTodos } = this.props;
  fetchTodos(filter).then(todos =>
    receiveTodos(filter, todos)
  );
}
```

### 보일러플레이트 덜 사용하기

앱을 사용하면서, 컴포넌트는 데이터가 준비되면 라이프사이클 훅에서 데이터를 가져 와서 Redux 액션을 디스패치합니다. 이제 보일러플레이트를 더 적게 작성해 보겠습니다.

named import 를 namespace import 로 바꿀 수 있습니다. 즉, 액션이 있는 파일에서 내보낸 모든 함수는 actions 라는 객체에 있으며, 이 객체는 `connect`의 두 번째 인수로 전달됩니다.

```js
// At the top of `VisibleTodoList`

// Before: import { toggleTodo, receiveTodos } from '../actions'
import * as actions from '../actions' // After
.
.
.
// At the bottom of `VisibleTodoList`
VisibleTodoList = withRouter(connect(
  mapStateToProps,
  // Before: { onTodoClick: toggleTodo, receiveTodos}
  actions // After
)(VisibleTodoList))
```

VisibleTodoList 의 render() 함수 내부에서 prop 을 분해대입합니다. toggleTodo 액션 크리에이터가 onTodoClick prop 이름을 전달하되, 나머지 prop 은 그대로 전달 될 수 있기 때문입니다.

...rest 객체는 이제 toggleTodo 이외의 모든 prop 이 들어 있으므로, 그대로 내려보낼 것입니다. TodoList 컴포넌트가 기대하는 바에 따라 toggleTodo 를 onTodoClick prop 으로 전달합니다.

```js
// Inside of `VisibleTodoList`
  render() {
    const { toggleTodo, ...rest } = this.props;
    return (
      <TodoList
        {...rest}
        onTodoClick={toggleTodo}
      />
    );
  }
}
```

## 16. Promise 알아보기 위해 `dispatch` 감싸기

`receiveTodos` 액션 크리에이터 그 자체로는 그다지 유용하지 않습니다. 우리가 호출할 때마다, 원하는 것은 todos 를 먼저 가지고 오는 것이기 때문입니다. `fetchTodos`와 `receiveTodos`는 동일한 인수를 받아들이므로, 이 코드를 하나의 액션 크리에이터로 그룹화 할 수 있다면 좋을 것입니다.

**VisibleTodoList 내의 기존 fetchData()**

```js
fetchData() {
  const { filter, receiveTodos } = this.props;
  fetchTodos(filter).then(todos =>
    receiveTodos(filter, todos)
  );
}
```

### 액션 크리에이터 리팩토링 하기

가짜 API 를 액션 크리에이터 파일 (src/actions/index.js)에 가져 와서 시작하겠습니다.

`import * as api from '../api'`

이제 우리는 fetchTodos 라는 비동기 액션 크리에이터를 추가 할 것입니다. 인수로 `filter` 를 받은 다음, 그것으로 API 의 fetchTodos 메서드를 호출합니다.

Promise 의 `then` 메서드를 사용하여 `response`의 Promise 의 결과를 `filter`와 `response`가 주어진 receiveTodos 에 의해 생성된 액션 객체로 바꿉니다.

**src / actions / index.js 내부**

```js
export const fetchTodos = filter =>
  api.fetchTodos(filter).then(response => receiveTodos(filter, response));
```

receiveTodos 는 동기적으로 액션 객체를 환하지만, fetchTodos 는 액션 객체를 통해 resolve 되는 Promise 를 반환합니다.

이제 우리는 액션 크리에이터로부터 receiveTodos 를 내보내는 것을 멈출 수 있습니다. 왜냐하면 우리는 컴포넌트를 변경하여 fetchTodos 를 직접 사용할 수 있기 때문입니다.

### VisibleTodoList 업데이트 하기

컴포넌트 파일로 돌아가서, `connect`에 의해 삽입된 fetchTodos prop 을 사용할 수 있습니다. 이것은 방금 작성한 새로운 비동기 fetchTodos 액션 크리에이터에 해당합니다.

지금부터 우리는 fetchTodos 액션 크리에이터를 사용할 것이기 때문에, `import {fetchTodos} from '../api'`를 제거할 수 있습니다. 이 액션은 `connect` 에 의해 prop 으로 주입됩니다.

```js
fetchData () {
  const {filter, fetchTodos} = this.props;
  fetchTodos (filter);
}
```

### 요약

fetchTodos 액션 크리에이터는 API 에서 fetchTodos 함수를 호출하지만, 그 결과를 receiveTodos 에 의해 생성된 Redux 액션으로 변환합니다.

그러나 기본적으로 Redux 는 Promises 가 아닌 일반 객체를 디스패치하는 것만 허용합니다. 우리는 configureStore.js 내부에서 addLoggingToDispatch ()와 동일한 트릭을 사용하여 Promises 를 인식하도록 알려줄 수 있습니다. (addLoggingToDispatch 함수는 스토어에서 `dispatch`를 ​​ 가져와서 모든 액션과 상태를 기록하는 새로운 버전의 `dispatch`를 ​​ 반환한다는 점을 상기하세요).

### Promise 지원 추가

configureStore.js 내부에서 스토어를 가져와 Promise 을 지원하는 `dispatch`의 버전을 반환하는 addPromiseSupport() 함수를 생성합니다.

먼저 스토어에서 정의된 rawDispatch 함수를 가져옵니다. 디스패치 함수와 동일한 API 를 가진 함수를 반환합니다. 즉, 액션을 받습니다.

```js
const addPromiseSupportToDispatch = store => {
  const rawDispatch = store.dispatch;
  return action => {
    if (typeof action.then === 'function') {
      return action.then(rawDispatch);
    }
    return rawDispatch(action);
  };
};
```

액션이 실제 액션인지 또는 promise 인지는 알 수 없기 때문에 함수인 `then` 메소드가 있는지 확인합니다. 그렇다면 우리는 그것이 promise 이라는 것을 압니다. 액션이 promise 인 경우 `rawDispatch`를 통해 내려온 액션 객체를 resolve 할 때까지 기다립니다.

그렇지 않으면, 우리는 우리가 받은 액션 객체로 바로 `rawDispatch`를 호출할 수 있습니다.

새로운 `addPromiseSupportToDispatch` 함수를 사용하면 액션과 액션으로 resolve 할 수 있는 promise 을 모두 전달할 수 있습니다.

끝내려면 새 기능을 한 번 더 호출해야만 스토어가 App 으로 반환됩니다.

```js
//`configureStore.js`의 맨 아래에
const configureStore = () => {
  const store = createStore (todoApp);

if (process.env.NODE_ENV! == 'production') {
    store.dispatch = addLoggingToDispatch (store);
  }

store.dispatch = addPromiseSupportToDispatch (store);

return store;
};
```

지금 앱을 실행하면, 응답 준비가 되었을 때 `'RECEIVE_TODOS'` 액션이 디스패치되는 것을 확인할 수 있습니다. 그러나 컴포넌트는 비동기 액션 크리에이터에서 비동기 로직을 캡슐화하는 보다 편리한 API 를 사용합니다.

### 순서는 중요합니다

configureStore 내부의 디스패치 함수를 재정의하는 순서가 중요하다는 것을 기억하십시오.

`addLoggingToDispatch` 전에 `addPromiseSupportToDispatch` 를 호출하도록 변경하면 액션이 먼저 출력되고 promise 가 처리됩니다.

이렇게 하면 우리에게 `undefined`라는 액션 타입이 생기고 액션 대신 Promise 가 표시됩니다. 이는 그리 유용하지 않습니다.
