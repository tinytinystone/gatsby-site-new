---
path: '/flux-to-redux'
date: '2020-09-06'
title: 'Flux -> Redux 마이그레이션, 꼭 해야 할까?'
tags: ['redux', 'migration']
excerpt: 'Flux에서 Redux로 마이그레이션을 하기 위해서, 리서치를 진행 했습니다.'
---

최근 Flux에서 Redux로 마이그레이션을 하기 위해서, 리서치를 진행 했습니다.

## Redux 소개

Redux는 상태 관리 라이브러리입니다. 여기서 상태(state)란, **변할 수 있는 것**을 의미합니다. **데이터**로 바꿔 말할 수도 있을 것 같습니다.

원래 react에서는 상태가 변하면 UI가 변하게 됩니다. 즉, 상위 컴포넌트의 state가 변하면, 그 아래 포함된 컴포넌트를 포함해 전부 re-rendering이 일어납니다.

흔히 Redux는 상태가 복잡해질 때 사용하는 라이브러리라고 하는데요. 프로젝트가 복잡해지면서 여러 개의 상태가 여러 개의 view를 바꾸게 됩니다. 이에 따라 컴포넌트가 깊어지는가 하면, 복잡도가 높아집니다. 전역 상태가 필요해지기도 하고, 상태 관리 로직을 따로 분리하고자 하는 필요성이 생기게 됩니다.

이러한 역할을 Redux만이 하는 것은 아닙니다. **Context API**를 사용하면, 일일이 prop을 넘겨줘야만 컴포넌트 트리 전체에 데이터 전달이 가능합니다. 지금 프로젝트에서 단순히 prop을 넘겨주는 목적만 가지고 있다면, redux를 사용할 필요 없이 context API만을 사용할 수도 있습니다. Redux는 프로젝트의 규모가 커서 상태관리 로직을 분리해야 하는 필요성이 있거나, 비동기 작업이 많을 경우에 유용합니다.

## flux와 redux

회사 프로젝트는 4-5년 전에 처음 만들어졌고, 복잡한 로직을 담고 있고 꽤 규모가 큰 대시보드로, 상태관리는 Flux로 하고 있습니다. 당시 Flux는 꽤 획기적인 선택지였습니다. Context API는 react 16 버전부터 사용 가능해졌기 때문에, 그 전에 만들어진 프로젝트에서는 context API를 활용할 수 없었고요. Redux 또한 탄생하기 전이었습니다.

Flux는 일종의 디자인 패턴으로, react에서의 복잡한 상태를 관리하고자 하는 목적에서 생겨났습니다. Flux가 생기고 나서 Flux의 불편한 점을 해소하고자 flux에 사용할 수 있는 생태계가 조성되기 시작했습니다.

Redux의 창시자인 댄 아브라모프(Dan Abramov)도 그런 일환으로 아래와 같은 기능을 만들어 발표하기도 했습니다.

- hot loader: flux에서는 코드 수정 후 새로고침을 하지 않으면 상태끼리 충돌이 나는데, 입력된 상태를 그대로 두고 코드를 수정할 수 있도록 하는 기능
- time travel debugging: 상태 변경의 redo/undo 가 가능

이후 댄 아브라모프는 `reducer`라는 개념을 가져와서, flux를 대체하는 redux를 발표했습니다.

- flux는 store가 여러 개이고, callback 함수로 store를 업데이트 한다.
- redux는 store가 1개이고, store를 변경하는 reducer를 여러 개 둔다. 이때, reducer 간에 합성이 가능해서 공통로직을 재사용하기가 좋다.

- flux에 비해, reducer는 개발자의 편의성이 향상 되었다. (hot loader, time travel debugging...)
- flux에 비해, 미들웨어 생태계가 구축 되었다. (redux-thunk, redux-saga, 로깅...)

그렇게 시간이 지나, flux는 더 이상 facebook 팀에서 관리하지 않는, deprecated된 라이브러리가 되었고, react 상태관리 라이브러리의 세계는 redux로 옮겨 갔습니다. 사내 대시보드는 계속 기능이 추가되고, 사용자도 늘어나고 있으며, 앞으로도 오랫동안 사용해야 할 서비스입니다. flux를 redux로 바꾸는 것이 좋을지에 대해 pros와 cons를 정리해 보았습니다.

### Redux로 바꿔야 하는 이유

**flux는 더이상 업데이트가 없고, 생태계도 발전이 없다.**

Redux 생태계는 점점 커져가는 데에 반해, flux는 유지보수도 이뤄지지 않고 있습니다.

**프론트엔드 개발자 풀을 생각하면, flux보다 redux에 익숙한 사람이 훨씬 많을 것이다.**

Flux를 사용하는 회사보다는 Redux를 사용하는 회사가 미래의 구직자에게 훨씬 더 매력적으로 보일 것이라 생각합니다. 또, 새로 입사해서 해당 프로젝트를 수정하게 될 동료들을 생각해도 Redux에 더 적응을 잘할 것이라고 생각이 됩니다.

**redux에는 개발자 편의를 고려한 기능이 많다.**

위에서 언급한 hot reloading, time-travel debugging은 개발을 하는 데 있어 매우 편리합니다. 

**redux의 미들웨어를 사용하면, 현재 프로젝트에서 꼬여 있는 비동기 처리를 해결할 수도 있다.**

redux의 미들웨어를 사용하면 아래와 같은 동작이 가능합니다.

- 특정 조건에 따라 action을 무시하도록 할 수 있다
- action을 로깅할 수 있다
- dispatch된 action을 수정해서, reducer에 전달할 수 있다
- 특정 action으로 다른 action을 발생시킬 수 있다
- 특정 action으로 특정 자바스크립트를 실행시킬 수 있다
- action을 모니터링 할 수 있다

**react가 hook으로 업데이트 되면서, redux를 편하게 쓸 수 있는 redux hook이 생겼다.**

react hook이 발표되고, redux는 이에 맞춰 hook에 대응하는 여러 업데이트를 진행했습니다. 새로 작성하는 코드가 hook으로 쓰여진다면, 코드량을 획기적으로 줄이고 이해하기 쉬운 코드를 쓸 수 있게 되었습니다. 새로 만드는 컴포넌트는 앞으로 hook으로 작성하게 될텐데, 이를 고려하면 결국 redux로 가는 것이 옳다고 생각합니다.

### Flux를 유지해야 하는 이유

**flux나 redux 간에 엄청난 차이가 있는 것은 아니다. redux를 이해한다면 flux도 쉽게 이해할 수 있다.**

구직자 및 미래의 개발자들을 생각할 때 flux보다는 redux가 더 나을 것이라 말했지만, 사실 그 두 개가 크게 다르지는 않습니다. 물론 이 말은 바꿔 말하면, flux에서 redux로 바꾸는 것 자체가 그렇게 어려운 과제는 아니라는 의미도 됩니다.

**잘 돌아가는 코드를 바꾸는 것은 비효율적인 일일 수 있다.**

이미 돌아가고 있는 코드를 리팩토링 하는 것에 대해서는 많은 논쟁이 있습니다. (물론 문제는 존재하지만) 지금 대시보드는 잘 돌아가고 있고, 문제가 있다 하더라도 그것이 꼭 flux여서 생긴 문제는 아닙니다. 이런 상황에서 괜히 긁어 부스럼을 만드는 것일 수도 있습니다.

**그럼에도 flux를 redux로 갈아치우려면 굉장히 오랜 시간이 필요하고, 당분간은 코드 중복이 필연적으로 발생한다.**

6개월을 잡고 코드를 고친다면, 꽤 많은 리소스가 필요할 것입니다. 또, 그 기간 동안 안전하게 마이그레이션을 하려면 상태 중복 및 코드 중복이 있을 수밖에 없습니다.

---

내부적으로 논의를 이어나가기 위해서, flux에서 redux로 옮겨가는 일이 얼마만큼의 품이 들 것인지를 확인하고자 코드를 직접 마이그레이션 해보았습니다.

### Flux → Redux migration Test의 목표

- flux → redux 마이그레이션을 어떻게 할 수 있을지 확인
- redux로의 마이그레이션이 어렵지 않은지, 고치고 나서의 모양이 기존 flux 구조와 유사하여 추가 학습이 많이 필요하지 않을지를 사전 조사해 보기

### 전제 조건

- 기존 구조를 건드리지 않는 선에서 side effect를 가장 적게 만들기
- 구조 개선, 코드 상 문제가 있는 부분 등은 향후 진행

### 작업 순서

**1. Redux 관련 dependency 설치**

- redux, redux-thunk, react-redux

**2. Reducer 생성**

- reducer는 flux store 파일 내에서 액션을 인자로 받아 actionType에 따라 작업을 처리하는 부분의 로직과 동일하게 작성합니다.
- 이때, reducer는 `순수함수`, 즉 동일한 인자가 들어갈 경우 항상 같은 값이 나와야 합니다. 그리고 불변성을 지켜주어야 합니다. (ex. 매번 새로운 객체를 생성해야 하며 참조값이 변경되어야 한다.)

```js
export default function todoReducer(state = [], action) {
    switch (action.type) {
  case 'ADD_TODO':
    return [
      ...state,
      action.payload
    ;
  default:
    return state;
  }
}
```

**3. reducer를 인자로 받는 `createFluxStore` 함수 생성**

- flux store와 redux reducer는 독립적으로 운영되는 상태이므로, reducer를 인자로 받아 flux의 `createStore` 함수와 동일하게 동작하도록 store를 생성해서 두 세계를 연결해 줍니다.
- action에서 수정이 없어도 사용이 가능합니다.
- 다만, flux에서도 redux의 상태를 사용하는 상태가 되므로 상태 객체의 중복이 일어날 수밖에 없습니다.
- `createFluxStore` 는 이미 만들어져 있는 것을 가져와서 사용. ([링크](https://github.com/vivek3003/flux-redux-migration))

**4. store가 redux에서 state를 읽어올 수 있도록 코드 수정**

- flux의 `createStore` 가 아니라, `EventEmitter` 의 instance로 변경합니다.
- store의 메서드를 좀 더 쉽게 다룰 수 있도록 하기 위한 목적입니다.

```jsx

// 변경 후
const TodoStore = Object.assign({}, EventEmitter.prototype, {
  get(id) {
    return _todos[id];
  },
  emit(arg) {
    this.emit(arg);
  },
  on(arg, cb) {
    this.on(arg, cb);
  },
  removeListener(arg, cb) {
    this.removeListener(arg, cb);
  },
  dispatcherIndex: AppDispatcher.register( function(payload) {
    const action = {
      ...payload,
      type: payload.actionType
    };
    todoStore.dispatch(action);
  } )
});
```

**5. side-effect가 없는 것부터 action 마이그레이션 하기 & 6. 비동기 action 마이그레이션 하기**

- 외부 API 통신, 비동기작업 등 side effect 발생하지 않는 action부터 redux 스타일의 action으로 새롭게 추가합니다.
- 그리고, thunk 스타일로 비동기 작업 action을 변경합니다.

```js
let _todos = null;

const init = (payload) => {
  _todos = payload.todos;
};

const fetch = () => (dispatch) => {
  let url = `/api/todos`;

  superagent.get(url).send().end( (err, res) => {
    if (err) {
      handleError(err);
    } else {
      const info = res.body.result;
      return dispatch( {
        type: 'ADD_TODOS',
        data: info.data,
      } );
    }
  });
};
```

**7. react app의 entry point에 redux 및 미들웨어 연결**

```js
import { Provider } from 'react-redux';
import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import TodoReducer from "./reducers/TodoReducer";

// Make the redux-dev-tools browser extension work with the app if available
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// The app store with all middlewares and reducers available
const store = createStore(
  combineReducers({
    statInsightReducer
  }
  ),
  composeEnhancers(applyMiddleware(thunkMiddleware))
);
```

**8. 컴포넌트와 redux 연결**

- react-redux에서 `connect` 메서드를 사용하고, `mapDispatchToProps` , `mapStateToProps` 등을 추가해서 redux store로부터 state와 prop을 가져옵니다.
- 기존 state에 저장되었던 값을 prop에서 가져오는 것으로 바꿉니다.
- module을 잘 가져오고 있는지 (ex. import할 때 전체 객체를 읽어오는지 등) 잘 살펴봐야 합니다.

**9. flux와 관련한 핸들러 및 store를 삭제**

### 리서치 결과

redux로 마이그레이션을 해보니, 생각보다 할만하고 어렵지 않았습니다. 처음에 어떻게 하는지를 파악하는 데는 조금 오래 걸렸는데, 막상 잘 연결되고 문제 없이 작동하는 걸 보니 향후 나머지 store 및 action을 수정하는 데는 큰 품이 들 것 같지는 않다고 판단했습니다.

수정한 결과를 팀내에 공유했고, flux에서 redux로 마이그레이션 하는 데에 공감대를 형성할 수 있었습니다.

그래서 현재는 Redux 스터디 중입니다. flux와 redux가 거의 유사하다고 하더라도, redux를 도입하는 목적이 '프로젝트의 state를 잘 관리하기 위함'도 있기 때문에, 내부 스터디를 하는 것이 좋을 것 같다고 생각했습니다. 업무 시간 중, 주 3회 시간을 내어 redux, react hook을 스터디하고 있습니다. 아예 redux 지식이 없는 사람을 기준으로 해서 2-4주 정도 진행하는 것을 목표로 하고 있습니다.

앞으로 리서치한 결과를 넘어서, 실제 마이그레이션을 하면서 부딪히는 문제에 대해서도 정리해보도록 하겠습니다.

## 참고한 글

- [stackoverflow: why-use-redux-over-facebook-flux (by Dan Abramov)](https://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux)
- [stackoverflow: what-could-be-the-downsides-of-using-redux-instead-of-flux (by Dan Abramov)](https://stackoverflow.com/questions/32021763/what-could-be-the-downsides-of-using-redux-instead-of-flux/32916602#32916602)
- [React 문서: context API](https://ko.reactjs.org/docs/context.html)
- [redux 공식문서](https://redux.js.org/)
- [redux-saga 공식문서](https://redux-saga.js.org/)
- [redux-saga 공식문서(한국어)](https://mskims.github.io/redux-saga-in-korean)
- [벨로퍼트와 함께하는 모던 리액트](https://react.vlpt.us/)
- [Redux-Thunk vs Redux-Saga를 비교해 봅시다!](https://velog.io/@dongwon2/Redux-Thunk-vs-Redux-Saga%EB%A5%BC-%EB%B9%84%EA%B5%90%ED%95%B4-%EB%B4%85%EC%8B%9C%EB%8B%A4-)
