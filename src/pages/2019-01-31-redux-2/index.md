---
path: '/redux-2'
date: '2019-01-31'
title: 'TIL: Redux 2'
tags: ['redux', 'react', 'TIL']
excerpt: '리덕스 공부'
---

## Props 를 사용해 스토어 명시적으로 내리기

지금까지 우리는 결합된 todoApp 리듀서를 Redux 의 createStore() 함수에 전달하여 store 라는 변수를 작성했습니다.

```js
const { combineReducers, createStore } = Redux;

const todoApp = combineReducers({
  todos,
  visibilityFilter,
});

const store = createStore(todoApp);
```

스토어가 만들어지면, 컨테이너 컴포넌트는 store.getState()를 호출함으로써 데이터를 가져오고, store.subscribe()를 호출하여 변경 내용을 구독(subscribe)하며, store.dispatch()를 호출하여 액션을 디스패치 합니다.

모든 코드를 하나의 파일로 묶는 것은 간단한 예제에서는 잘 작동하지만, 크기가 커지면 잘 작동하지 않습니다.

첫째, 테스트에서 별도의 임시 스토어를 제공하고 싶을 수도 있는데, 컴포넌트들은 하나의 특정 스토어를 참조하고자 합니다. 이 때문에 컴포넌트를 테스트하기 더 어려워집니다.

둘째, 서버에서 렌더링되는 일반적인 결과물을 구현하기가 어렵습니다. 서버에서는 요청이 다르면 데이터도 달리 가지기 때문에 모든 요청 시에 서로 다른 스토어 인스턴스를 보내주기를 원하기 때문입니다.

이 문제를 해결하기 위해, 스토어 생성과 관련된 코드를 파일의 맨 아래로 이동하고, 우리가 TodoApp 의 prop 으로 보낼 스토어를 내립니다.

```js
// before
const store = createStore(todoApp);

ReactDOM.render(<TodoApp />, document.getElementById('root'));

// after
ReactDOM.render(
  <TodoApp store={createStore(todoApp)} />,
  document.getElementById('root')
);
```

스토어는 이제 TodoApp 에 적용되었습니다.

### TodoApp 이 스토어를 받아들이도록 리팩토링 하기

모든 컨테이너 컴포넌트는 스토어에 대한 참조가 필요합니다. 불행히도 (현재) 이 작업을 수행하는 유일한 방법은 모든 컴포넌트에 Prop 으로 전달하는 것입니다. 그러나 이는 모든 컴포넌트에 다른 데이터를 전달하는 것보다 노력이 적게 들지만 이후에 수행할 작업만큼 좋지는 않습니다.

```js
const TodoApp = ({ store }) => (
  <div>
    <AddTodo store={store} />
    <VisibleTodoList store={store} />
    <Footer store={store} />
  </div>
);
```

이런 식으로 했을 때 생기는 문제는 컨테이너 컴포넌트 또한 상태를 가져오고, 액션을 디스패치하고, 변경사항을 구독 할 스토어 인스턴스가 필요하다는 것입니다.

이제 TodoApp 내부의 각 컴포넌트 내부에 있는 componentDidMount() 및 render() 모두에서 Prop 으로부터 스토어를 가져오도록 컨테이너 컴포넌트를 수정해야 합니다.

```js
class VisibleTodoList extends Component {
  componentDidMount() {
    const { store } = this.props;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  .
  . // Rest of component as before to `render()` method
  .

  render() {
    const props = this.props;
    const { store } = props;
    const state = store.getState();
    .
    .
    .
  }
}
const AddTodo = ({ store }) => {
  .
  . // Rest of component as before
  .
}
```

Footer 컴포넌트 그 자체는 스토어가 필요 없지만, Footer 에 prop 을 넘겨야 FilterLink 에 전달이 가능합니다.

```js
const Footer = ({ store }) => (
  <p>
    <FilterLink
      filter='SHOW_ALL'
      store={store}
    >
      All
    </FilterLink>
    .
    . // Follow this pattern for the other `FilterLink` component references
    .
)
class FilterLink extends Component {
  componentDidMount() {
    const { store } = this.props;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  .
  . // Rest of component as before down to `render()`
  .
  render() {
    const props = this.props;
    const { store } = props
    const state = store.getState()
    .
    . // Rest of component as before
    .
  }
}
```

이제 모든 컴포넌트가 최상위 변수에 의존하는 대신 Prop 을 통해 상태를 수신합니다.

이 변경으로 인해 애플리케이션의 데이터 흐름이 변경되지는 않았다는 점을 참고하세요. 컨테이너 컴포넌트들은 이전처럼 스토어를 구독하고 업데이트합니다. 바뀐 점은 스토어를 어떻게 얻는가입니다.

곧 컨테이너 컴포넌트에 암시적으로 스토어를 내리는 방법을 배울 것입니다.

## Context 를 통해 스토어를 암시적으로 내리기

마지막 섹션에서는 스토어를 Prop 으로 전달하기 위해 코드를 리팩터링했습니다. 이렇게 하려면 보일러플레이트 코드가 많이 필요합니다.

- 보일러플레이트 코드: 상용구 코드. 수정하지 않거나 최소한의 수정만을 거쳐 여러 곳에 필수적으로 사용되는 코드를 말한다. 이와 같은 코드는 최소한의 작업을 하기 위해 많은 분량의 코드를 작성해야 하는 언어에서 자주 사용된다.

그러나 쉬운 방법이 있습니다 : React 의 컨텍스트 함수을 사용하십시오.

설명하기 위해 새로운 Provider 컴포넌트를 만드는 것으로 시작하겠습니다. Provider 컴포넌트의 render() 메소드에서 그냥 자식 요소를 반환합니다. 즉, Provider 는 어떤 컴포넌트든 감쌀 수 있으며, 해당 컴포넌트를 렌더링합니다.

```
class Provider extends Component {
  render() {
    return this.props.children;
  }
}
```

이제 새로운 Provider 내부에서 TodoApp 를 렌더링하기 위해 ReactDOM.render() 호출을 변경해야 합니다. 우리는 또한 TodoApp 이 아니라, Provider 의 Prop 으로 상태를 전달합니다.

```js
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);
```

이제 React 의 컨텍스트 함수을 사용하기 위해 Provider 컴포넌트를 업데이트 합니다. 이것이 렌더링하는 모든 컴포넌트에서 스토어를 사용할 수 있게 하는 방법입니다. 이제 스토어는 Provider 가 렌더링하는 컴포넌트의 자식과 손자요소라면 무엇이든 적용이 가능합니다. (이 예에서 보자면, TodoApp 및 TodoApp 내부에 있는 모든 컴포넌트와 컨테이너 컴포넌트를 의미합니다).

작동시키기 위해 추가해야 하는 중요한 조건이 있습니다. 자식 컨텍스트를 제공하는 컴포넌트에 `childContextTypes`를 제공해야 합니다. 이는 React 의 PropType 정의와 유사합니다.

```js
class Provider extends Component {
  getChildContext() {
    return {
      store: this.props.store, // This corresponds to the `store` passed in as a prop
    };
  }
  render() {
    return this.props.children;
  }
}

Provider.childContextTypes = {
  store: React.PropTypes.object,
};
```

### Prop 대신 컨텍스트에서 스토어를 얻기 위해 컴포넌트 리팩터링 하기

각 컴포넌트에서 상태를 받는 방식을 변경해야 합니다.

```js
class VisibleTodoList extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  .
  . // Rest of component as before to `render()` method
  .

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();
    .
    .
    .
  }
}
```

참고 : 컨텍스트는 모든 컴포넌트에 적용되므로, `contextTypes`를 지정해주어야 합니다. 그렇지 않으면 컴포넌트는 관련된 콘텍스트를 받을 수 없기 때문에, 이를 선언하는 것이 필수적입니다.

```js
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object,
};
```

### 컨텍스트를 위한 함수 컴포넌트 업데이트 하기

우리의 함수 컴포넌트에는 `this`가 없는데, 어떻게 컨텍스트를 보낼 수 있을까요?

함수 컴포넌트는 두번째 인자(prop 다음)로 컨텍스트를 받습니다. 또한 우리가 어떤 컨텍스트를 받고 싶은지를 (이 경우라면, Provider 로부터 store 를 받겠죠) 컴포넌트에 contextTypes 를 추가해야 합니다. 컨텍스트는 모든 레벨에 내려갈 수 있기 때문에, 어떤 컴포넌트든지 사용할 수 있다는 의미에서 '웜홀'이라고 생각해도 됩니다. contextTypes 를 선업하는 것만 잊지 않는다면 말이죠.

```js
const AddTodo = (props, { store }) => {
  .
  . // Rest of component as before
  .
}

AddTodo.contextTypes = {
  store: React.PropTypes.object
}
```

또한 FilterLink 를 변환하여 컨텍스트로부터 전달되는 스토어를 받고, contextTypes 를 제공해야 합니다.

FilterLink 업데이트 하기

```js
class FilterLink extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  .
  . // Rest of component as before down to `render()`
  .
  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();
    .
    . // Rest of component as before
    .
  }
}
FilterLink.contextTypes = {
  store: React.PropTypes.object
}
```

참고 : Footer 와 개별 <FilterLink> 요소는 Prop 으로 스토어가 필요하지 않기 때문에 내려줄 필요 없어서, prop 을 삭제해주면 됩니다.

```js
const Footer = () => {
  <p>
    <FilterLink
      filter='SHOW_ALL'
    >
      All
    </FilterLink>
    .
    . // Follow this pattern for the other `FilterLink` component references
    .
}

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)
// 여기서도 prop을 삭제하면 됩니다.
```

### 정리

이제 우리는 Prop 을 통해 명시적으로 스토어를 내려주지 않고, 컨텍스트 기능을 이용해 암시적으로 내려줍니다.

컨텍스트는 강력한 기능이지만, 어떤 면에서는 명시적인 데이터 흐름을 가진다는 React 의 철학에 위배됩니다. 컨텍스트는 기본적으로 컴포넌트 트리 전체에서 전역 변수를 허용합니다. 전역 변수는 일반적으로 좋지 않으므로 이런 식으로 컨텍스트 함수을 사용하면 안됩니다. 의존성 삽입을 위해 컨텍스트를 사용해야 하는 경우(우리 사례처럼 모든 컴포넌트에 하나의 객체가 사용가능하도록 만들어야 하는 경우)에만 컨텍스트를 사용해야 합니다.

- 의존성 주입: 프로그래밍에서 구성요소간의 의존 관계가 소스코드 내부가 아닌 외부의 설정파일 등을 통해 정의되게 하는 디자인 패턴 중의 하나이다.

## React Redux 의 Provider 를 사용해 스토어 내리기

마지막 섹션에서는 React 의 컨텍스트 기능을 사용하여 암시적으로 스토어를 전달하는 Provider 컴포넌트를 구현했습니다. 정말 편리했습니다.

사실 우리는 제공자를 직접 작성할 필요가 없기 때문에 편리했습니다. Redux 라이브러리에 React 바인딩을 제공하는 react-redux 라이브러리에서 가져올 수 있습니다.

먼저 'react-redux'에서 Provider 를 가져 와서 시작하십시오.

```js
// CDN style
const { Provider } = ReactRedux;
// npm style
import { Provider } from 'react-redux';
```

이전에 쓴 Provider 처럼, react-redux 와 함께 제공되는 Provider 는 스토어를 컨텍스트의 Prop 으로 나타냅니다.

## React Redux 에서 connect()를 사용해서 컨테이너 생성하기 (VisibleTodoList)

이전 강의에서는 ReactRedux 바인딩을 프로젝트에 추가하고 ReactRedux 의 Provider 컴포넌트를 사용하여 스토어를 컨텍스트로 전달함으로써 컨테이너 컴포넌트가 컨텍스트에서 스토어를 읽고 변경 내용을 subscribe 할 수 있게 했습니다.

모든 컨테이너 컴포넌트는 매우 유사합니다.

컨테이너 컴포넌트들은 비슷합니다. 스토어의 상태가 변경 될 때 다시 렌더링 되어야 하며, unmount 될 때 스토어에서 subscribe 를 취소해야 하고, Redux 스토어에서 현재 상태를 가져 와서 계산이 필요한 일부 Prop 을 가지는 프레젠테이션 컴포넌트를 렌더링하는 데 사용합니다.

또한 컨텍스트에서 스토어를 가져 오려면 contextTypes 도 지정해야 합니다.

이제 VisibleTodoList 를 다른 방식으로 작성해 봅시다.

먼저 Redux 스토어의 상태를 가져오고, 프레젠테이셔널 컴포넌트 TodoList 로 전달해야 하는 Prop 을 반환하는 mapStateToProps 함수를 작성합니다.

이 경우 TodoList 는 todos 라는 단일 Prop 만 사용하므로 해당 표현식을 mapStateToProps 함수로 옮길 수 있습니다. Redux 스토어의 현재 상태에 따라 달라지는 Prop 을 반환합니다. 이 경우에는 todos 뿐입니다.

```js
const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter),
  };
};
```

유일한 인수로 dispatch()만을 허용하는 또 다른 함수 mapDispatchToProps 를 만듭니다. 이 함수는 TodoList 컴포넌트에 내려주어야 하고 dispatch() 메소드를 사용해야 하는 prop 을 반환합니다. TodoList 가 store.dispatch()를 사용해서 필요로 하는 유일한 prop 은 onTodoClick 입니다. 따라서 TodoList 에서 onTodoClick 을 제거하고 이를 mapDispatchToProps 가 반환하는 부분에 넣습니다. 이때 스토어를 더 이상 참조하지 않아도 되므로, store.dispatch()를 dispatch()로만 바꾸면 됩니다. mapDispatchToProps 의 인자로 들어갑니다.

```js
const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch({
        type: 'TOGGLE_TODO',
        id,
      });
    },
  };
};
```

### 우리가 방금 한 일 복습하기

함수 두 개를 배웠습니다.

`mapStateToProps`: 리덕스 스토어의 상태를 TodoList 컴포넌트의 prop 으로 매핑하는 함수입니다. prop 은 상태가 변할 때마다 업데이트 됩니다.
`mapDispatchToProps`: 스토어의 dispatch() 메소드를 매핑하고 액션을 디스패치하는 dispatch 메소드를 사용하는 prop 을 반환합니다. 따라서, 프레젠테이셔널 컴포넌트가 필요로 하는 콜백 prop 을 반환합니다.

### connect() 함수

이 두 개의 새로운 함수는 컨테이너 컴포넌트를 잘 구성하고 있으므로, 이렇게 작성하는 대신 react-redux 가 제공하는 connect() 함수를 사용하여 생성할 수 있습니다.

VisibleTodoList 클래스를 만드는 대신, 변수를 선언하고 connect() 메서드를 사용해 이 변수에 할당합니다. mapStateToProps 를 첫 번째 인수로, mapDispatchToProps 를 두 번째 인수로 전달합니다. 이것은 커링 함수이기 때문에 우리는 다시 호출해야 합니다. 이번에는 감싸서 prop 을 전달하고 싶은 프리젠테이셔널 컴포넌트로 파싱을 합니다.

- 커링 함수: 함수가 함수를 만드는 기법. 커링은 n 개의 인자를 가진 함수를 변형하여 하나의 인자를 받는 n 개의 함수로 만드는 것이다. ([링크](http://sujinlee.me/currying-in-functional-javascript/))
  - [커링 함수 강의](https://egghead.io/lessons/javascript-what-is-javascript-function-currying)

connect 함수를 호출한 결과는 프레젠테이션 컴포넌트를 렌더링할 컨테이너 컴포넌트입니다. mapStateToProps, mapDispatchToProps 및 자체 Prop 에서 반환된 객체를 병합해 프리젠테이션 컴포넌트로 전달할 Prop 을 계산합니다.

```js
const { connect } = ReactRedux;
// import { connect } from 'react-redux';

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
```

connect() 함수는 우리가 직접 작성한 것과 같은 컴포넌트를 생성하므로, 스토어를 subscribe 하거나 컨텍스트 타입을 수동으로 지정하는 코드를 작성할 필요가 없습니다.

## React Redux 에서 connect()를 사용해서 컨테이너 생성하기 (AddTodo)

마지막 섹션에서는 connect()를 사용하여 VisibleTodoList 컴포넌트를 설정했습니다.

이 예제들은 하나의 파일 안에 작성되어 있기 때문에, mapStateToProps 및 mapDispatchToProps 함수의 이름을 보다 구체적으로 변경해야 합니다. 별도 파일에 컴포넌트를 작성하는 경우에는 이렇게 할 필요가 없습니다.

AddTodo 컴포넌트가 프리젠테이션 또는 컨테이너 컴포넌트 한 쪽으로 분명하게 정의되지 않았다 것을 상기하십시오. 다만 dispatch() 함수를 사용해야 해서 스토어에 의존성을 가집니다.

컨텍스트에서 스토어를 읽는 대신, AddTodo 를 리팩토링하여 prop 에서 디스패치 함수를 ​​ 읽어 보겠습니다. AddTodo 가 전체 스토어가 아니고, dispatch() 만 필요하기 때문입니다.

우리는 connect()를 사용하여 dispatch 함수를 prop 으로 주입할 컨테이너 컴포넌트를 생성하려고 합니다. AddTodo.contextTypes 는 제거하겠습니다.

```js
// Before:
const AddTodo = (props, { store }) => {
  .
  . // inside `return`
  .
    <button onClick={() => {
      store.dispatch({
      .
      .
      .

}
AddTodo.contextTypes = {
  store: React.PropTypes.object
}
// After:
let AddTodo = ({ dispatch }) => {
  .
  . // inside `return`
  .
    <button onClick={() => {
      dispatch({
      .
      .
      .
}
// No more `AddTodo.contextTypes`
```

AddTodo 컴포넌트 선언이 const 에서 let 으로 바뀐 것을 확인하세요. **이렇게 하면 AddTodo 를 재할당 할 수 있으므로 comsuming 컴포넌트가 디스패치 prop 을 명시할 필요가 없습니다.** connect() 함수를 호출해서 생성된 컴포넌트에 의해 주입되기 때문에 디스패치 메서드를 prop 으로 명시하지 않아도됩니다.

connect()의 첫 번째 인수는 mapStateToProps 이지만, AddTodo 컴포넌트가 현재 상태에 의존하고 있는 prop 을 가지고 있지 않습니다. 이 때문에 첫 번째 매개변수는 빈 객체를 반환하게 됩니다.

connect ()의 두 번째 인수는 mapDispatchToProps 이지만, AddTodo 에는 콜백 prop 이 필요하지 않습니다. 이 때문에 디스패치 함수 자체를 동일한 이름의 prop 으로 반환합니다.

우리가 감싸고 싶은 컴포넌트 (이 경우에는 AddTodo 그 자체입니다) 를 명시해주기 위하여, 이 함수를 두 번째로 호출해 줍니다.

```js
AddTodo = connect(
  state => {
    return {};
  },
  dispatch => {
    return { dispatch };
  }
)(AddTodo);
```

이제 AddTodo 는 상태 의존적인 어떤 prop 도 내려주지 않지만, dispatch() 자체를 함수로 전달하여 컴포넌트가 prop 에서 읽고 사용할 수 있습니다. 컨텍스트에 대해 걱정하거나 ContextTypes 를 지정할 필요가 없습니다.

### 하지만 이렇게 하는 것은 시간낭비입니다...

상태에서 prop 을 계산하지 않으면 스토어를 subscribe 해야하는 이유는 무엇입니까? 스토어를 구독할 필요가 없기 때문에, mapStateToProps 를 인수로 사용하지 않고 connect()를 호출하고 대신 null 을 전달할 수 있습니다. 이것은 스토어를 구독할 필요가 없다는 것을 알려줍니다.

디스패치 함수만 주입하는 것이 일반적인 패턴이므로, connect()가 두 번째 인수가 null (또는 falsy 값)이라고 판단하면 dispatch 를 prop 로 주입합니다.

이것이 의미하는 것은 connect 함수에서 인수를 제거함으로써 위의 코드와 동일한 효과를 얻을 수 있다는 것입니다.

```js
AddTodo = connect()(AddTodo);
```

이제는 스토어를 subscribe 하지 dispatch 를 prop 으로 삽입하는 것이 기본 동작입니다.

## React Redux 에서 connect()를 사용해서 컨테이너 생성하기 (FooterLink)

이제 FooterLink 컴포넌트에 connect()를 사용합시다.

FilterLink 컴포넌트는 `active` prop 과 `onClick` 핸들러가 있는 링크를 렌더링한다는 점을 다시 생각해 보세요.

### mapStateToProps

모든 것이 단일 파일에 있기 때문에 mapStateToProps 의 이름을 바꾸는 것부터 시작하겠습니다.

Link 의 유일한 prop 이 active 입니다. active 는 visibilityFilter 컴포넌트에 기반해 스타일링을 결정합니다. Link 에서 active prop 을 삭제하고 mapStateToLinkProps 로 옮깁니다.

```js
const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter,
  };
};
```

이제 active 가 FilterLink 컴포넌트의 prop filter 를 참조하고 있다는 점을 확인하세요. Link 컴포넌트가 acitve 한 상태인지 아닌지를 알기 위해서는 해당 prop 을 Redux 저장소의 상태에 있는 visibilityFilter 와 비교해야 합니다.

자식 prop 을 계산할 때 컨테이너의 prop 을 사용하는 것이 일반적이므로, props 를 mapStateToProps 의 두 번째 인수로 전달합니다. prop 를 `ownerProps`로 이름을 변경하여 자식 컴포넌트로 전달되는 prop 이 아니라 이 함수가 반환하는 컨테이너 컴포넌트가 가지게 될 prop 임을 명확하게 해 줍니다.

```js
const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter,
  };
};
```

### mapDispatchToProps

이름 충돌을 피하기 위해 이 함수의 이름을 mapDispatchToLinkProps 로 바꿉니다.

먼저, 첫 번째 인자가 dispatch() 함수라는 것을 알고 있습니다. 우리가 필요로 하는 다른 인수를 알아보기 위해, 컨테이너 컴포넌트를 관찰하여 어떤 porp 이 dispatch 함수에 의존적인지를 확인합니다.

이 경우에는 filter 타입과 'SET_VISIBILITY_FILTER' 타입의 액션을 디스패치하는 onClick() 만 있습니다. props 에 대한 또 다른 참조가 있으므로 mapDispatchToLinkProps 의 두 번째 인수로 ownProps 를 추가합니다.

```js
const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter,
      });
    },
  };
};
```

### connect() 하기

```js
const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);
```

react-redux 의 connect()를 사용했으므로, contextTypes 를 포함하여 이전의 FilterLink 구현을 제거할 수 있습니다.

### 요약

Footer 컴포넌트는 3 개의 FilterLink 컴포넌트를 렌더링하며, 각각의 FilterLink 컴포넌트는 다른 filter prop 을 가집니다. filter prop 은 어떤 filter 와 일치하는지를 명시해주고 있습니다.

```js
const Footer = () => {
  <p>
    Show: <FilterLink filter="SHOW_ALL">All</FilterLink>
    ...
  </p>;
};
```

이 prop 은 mapDispatchToLinkProps 와 mapStateToProps 가 두 번째 인자로 받는 ownProps 객체에서도 사용이 가능합니다.

```js
const mapStateToLinkProps = (
  state,
  ownProps
) => {...};
const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {...}
```

이 두 개의 함수를 connect 를 호출함으로써 내려줍니다. connect 함수는 FilterLink 라는 이름의 컨테이너 컴포넌트를 반환합니다.

FilterLink 컴포넌트는 mapDispatchToProps 와 mapStateToProps 로부터 반환하는 prop 을 가져와서 Link 컴포넌트에 prop 으로 내려줍니다.

FilterLink 컴포넌트에 filter 값을 사용할 수 있습니다만, 그 아래에 있는 Link 컴포넌트는 계산된 active 및 onClick 값을 받습니다.

## action creator 추출하기

지금까지 컨테이너 컴포넌트, 프리젠테이션 컴포넌트, 리듀서 및 스토어를 다루었지만 액션 작성자(action creator)는 다루지 않았습니다.

현재 AddTodo 컴포넌트에서 "Add Todo" 버튼을 클릭하면 'ADD_TODO' 타입의 액션을 디스패치 합니다. 그러나 컴포넌트 옆에 선언된 nextTodoId 변수를 참조하고 있습니다. 일반적으로 지역변수여야 하지만, 다른 컴포넌트가 'ADD_TODO'를 디스패치할 수 있게 하려면 어떻게 해야 할까요? 그렇다면 그 컴포넌트는 nextTodoId 에 액세스할 수 있어야합니다.

```js
// 기존 AddTodo 코드
let nextTodoId = 0;
let AddTodo = ({ dispatch }) => {
  let input;

  return (
    <div>
      <input
        ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: input.value,
          });
          input.value = '';
        }}
      >
        Add Todo
      </button>
    </div>
  );
};
```

다른 컴포넌트가 'ADD_TODO' 액션을 디스패치 할 수 있게 하려면, 'ADD_TODO'가 ID 를 지정하는 일과는 관련될 필요가 없는 것이 가장 좋습니다. 실제로 전달되는 유일한 정보는 추가되는 todo 의 `text`입니다. 리듀서 내부에 ID 를 생성하고 싶지는 않습니다. 왜냐하면 리듀서가 비결정적(non-deterministic)이 될 수 있기 때문입니다.

- 비결정론적 알고리즘: 어떤 함수 f 가 있을 때 a -> b 가 아니라 a -> [b] 처럼 여러 개의 결과를 내놓는 경우를 말한다. [링크](https://medium.com/@jooyunghan/non-deterministic-c8c8d4fc4424)

### 액션 크리에이터

첫 번째 액션 작성자는 addTodo 가 될 것입니다. 액션 작성자는 todo 의 text 를 받아서 'ADD_TODO' 액션을 나타내는 액션 객체를 구성하는 함수입니다.

addTodo 컴포넌트 내부의 dispatch() 호출 안의 코드를 addTodo()를 호출하여 바꿉니다.

```js
// inside `AddTodo` component
<button onClick={() => {
  dispatch(addTodo(input.value))
  input.value = '';
}}>
.
.
.
```

addTodo 액션 작성자를 구현하면 아래와 같습니다.

```js
let nextTodoId = 0;
const addTodo = text => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text,
  };
};
```

액션 작성자는 일반적으로 유지보수성을 위해 컴포넌트 및 리듀서와 분리되어 있습니다. 이번에는 모든 액션 제작자를 파일 상단에 모으겠습니다.

다른 액션 작성자도 만들어 보겠습니다.

### mapDispatchToLinkProps 내부의 'SET_VISIBILITY_FILTER'

```js
// Before:

const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
}

// After:

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
};

.
. // Further down the file...
.
const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch(
        setVisibilityFilter(ownProps.filter)
      );
    }
  };
}
```

### mapDispatchToTodoListProps 내부의 'TOGGLE_TODO'

```js
After:

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  };
};
.
. // Further down the file...
.
const mapDispatchToTodoListProps = (
  dispatch
) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id));
    }
  };
}
```

### 요약

모든 액션 작성자를 한 곳에 모으는 것은 어떤 액션이 일어날 가능성이 있을지를 알기 위해 코드를 보는 다른 사람들에게 도움이 됩니다. 또한 다양한 컴포넌트와 테스트에서 사용할 수 있습니다.

액션 크리에이터의 사용 여부와 관계없이 데이터 흐름은 동일합니다.
