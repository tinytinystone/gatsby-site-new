---
path: '/redux-5'
date: '2019-02-15'
title: 'TIL: Redux 5'
tags: ['redux', 'react', 'TIL']
excerpt: '리덕스 공부'
---

# 19. Updating the State with the Fetched Data

## BEFORE (src/reducers/todos.js)

```js
import { combineReducers } from 'redux';
import todo from './todo';

const byId = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
    case 'TOGGLE_TODO':
      return {
        ...state,
        [action.id]: todo(state[action.id], action),
      };
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.id];
    default:
      return state;
  }
};

const todos = combineReducers({
  byId,
  allIds,
});

export default todos;

const getAllTodos = state => state.allIds.map(id => state.byId[id]);

export const getVisibleTodos = (state, filter) => {
  const allTodos = getAllTodos(state);
  switch (filter) {
    case 'all':
      return allTodos;
    case 'completed':
      return allTodos.filter(t => t.completed);
    case 'active':
      return allTodos.filter(t => !t.completed);
    default:
      throw new Error(`Unknown filter: ${filter}.`);
  }
};
```

문제점: 서버의 데이터가 클라이언트 쪽에서 이미 사용가능한 경우에만 잘 작동. 만약 수천 개의 todos 가 있다고 하면, 서버에서 다 불러온 후 클라이언트에서 filter 하는 것은 실용적이지 않다.

해결책: ID 를 담아둔 큰 리스트(allIds)를 가지고 있기보다, 모든 탭(all, active, completed)마다 ID 리스트를 가져서 각각 따로 저장/관리한다.

## AFTER (src/reducers/todos.js)

```js
import { combineReducers } from 'redux';

const byId = (state = {}, action) => {
  switch (action.type) {
    // 8. 마찬가지로 데이터를 서버에서 가져오는 내용을 먼저 다루기 때문에
    // 'ADD_TODO'와 'TOGGLE_TODO'는 삭제.
    case 'RECEIVE_TODOS':
      // 9. 얕은 복사를 해서 순수함수 유지하고, 응답을 받아온 todos 배열을
      // key는 todo.id로, value는 todo로 하는 새로운 객체를 생성한다.
      // todo 리듀서도 이제 사용하지 않으므로 삭제.
      const nextState = { ...state };
      action.response.forEach(todo => {
        nextState[todo.id] = todo;
      });
      return nextState;
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  // 7. action.filter와 reducer의 filter가 동일한지 비교.
  // 동일하지 않으면 mutation 없이 state만 반환하고 종료.
  if (action.filter !== 'all') {
    return state;
  }
  switch (action.type) {
    // 5. 'ADD_TODO' 액션은 추후에 다룰 예정. 지금은 데이터를 가져오는 부분을 다룸.
    // 'RECEIVE_TODOS' 액션에서는 서버 응답에 따른 새로운 todos 배열을 가져온다.
    // todo에서 해당하는 id값만을 map 메소드를 사용하여 새 배열 생성.
    case 'RECEIVE_TODOS':
      return action.response.map(todo => todo.id);
    default:
      return state;
  }
};

// 6. allIds와 동일한 방식으로 생성
const activeIds = (state = [], action) => {
  if (action.filter !== 'active') {
    return state;
  }
  switch (action.type) {
    case 'RECEIVE_TODOS':
      return action.response.map(todo => todo.id);
    default:
      return state;
  }
};

// 6. allIds와 동일한 방식으로 생성
const completedIds = (state = [], action) => {
  if (action.filter !== 'completed') {
    return state;
  }
  switch (action.type) {
    case 'RECEIVE_TODOS':
      return action.response.map(todo => todo.id);
    default:
      return state;
  }
};

// 4. ID부분의 reducer를 대체하려는 목적으로, filter에 해당하는 ID list 생성.
const idsByFilter = combineReducers({
  all: allIds,
  active: activeIds,
  completed: completedIds,
});

const todos = combineReducers({
  byId,
  idsByFilter,
  // allIds
});

export default todos;

// 1. getAllTodos 삭제
// const getAllTodos = (state) =>
//   state.allIds.map(id => state.byId[id]);

export const getVisibleTodos = (state, filter) => {
  // 2. filter하는 부분 삭제: 서버에서 제공받은 todos의 list를 사용할 것이기 때문.
  // const allTodos = getAllTodos(state);
  // switch (filter) {
  //   case 'all':
  //     return allTodos;
  //   case 'completed':
  //     return allTodos.filter(t => t.completed);
  //   case 'active':
  //     return allTodos.filter(t => !t.completed);
  //   default:
  //     throw new Error(`Unknown filter: ${filter}.`);
  // }

  // 3. state로부터 모든 id를 읽어오지 않고 해당 filter에 따른 id만 가져온다.
  const ids = state.idsByFilter[filter];
  return ids.map(id => state.byId[id]);
};
```

## 바뀐 코드에 따라 상태 확인하기

(코드 실행해 보기)

서버에 필터와 로직이 있기 때문에, 처음 탭을 바꿀 때는 시간이 조금 소요된다. 하지만 다음 번 스위치에서는 곧바로 채워지는데, 가져온 ID 데이터 배열이 캐시된 상태이기 때문이다. 다시 새로고침을 해도, UI 가 이전 버전의 배열을 가지고 있기 때문에 그 배열을 가지고 렌더링을 한다.

# 20. Refactoring the Reducers

## BEFORE

1. src/reducers/index.js

```js
import { combineReducers } from 'redux';
import todos, * as fromTodos from './todos';

const todoApp = combineReducers({
  todos,
});

export default todoApp;

export const getVisibleTodos = (state, filter) =>
  fromTodos.getVisibleTodos(state.todos, filter);
```

1. src/reducers/todos.js

(상동)

## AFTER

1. src/reducers/index.js

삭제

- 일전에 visibilityFilter 리듀서를 없애면서, index.js 에는 todos 리듀서만 combineReducers 메소드 안에 들어 있었다. todo 리듀서가 대신하는 역할을 할 수 있으므로, index.js 는 삭제한다.

1. src/reducers/todos.js => src/reducers/index.js

이름 변경 => index.js

1. src/reducers/byId.js

```js
const byId = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_TODOS':
      const nextState = { ...state };
      action.response.forEach(todo => {
        nextState[todo.id] = todo;
      });
      return nextState;
    default:
      return state;
  }
};

export default byId;

// state, id를 인자로 받는 셀렉터 함수를 생성
export const getTodo = (state, id) => state[id];
```

1. src/reducers/createList.js

allIds, activeIds, completedIds 가 action.filter 를 거르는 부분을 제외하고는 동일하다. 따라서, filter 를 인수로 받고 reducer 함수를 반환하는 createList 함수를 만든다.

```js
const createList = filter => {
  return (state = [], action) => {
    if (action.filter !== filter) {
      return state;
    }
    switch (action.type) {
      case 'RECEIVE_TODOS':
        return action.response.map(todo => todo.id);
      default:
        return state;
    }
  };
};

export default createList;

// 셀렉터의 형태로 상태에 액세스 하기 위한 퍼블릭 API를 추가. getId는 일단 state를 입력받아 반환하지만, 추후 변경될 예정.
export const getIds = state => state;
```

1. src/reducers/index.js

```js
import { combineReducers } from 'redux';
import byId, * as fromById from './byId';
import createList, * as fromList from './createList';

// filter 인수 자리에 all, active, completed를 넣어 새로운 reducer를 생성.
const listByFilter = combineReducers({
  all: createList('all'),
  active: createList('active'),
  completed: createList('completed'),
});

const todos = combineReducers({
  byId,
  listByFilter,
});

export default todos;

export const getVisibleTodos = (state, filter) => {
  // 별도 파일에 관리하므로 상태에 id가 들어있는지는 불분명하므로
  // 리듀서의 이름을 listByFilter로 바꾸고 getIds라는 이름의 셀렉터를 사용.
  const ids = fromList.getIds(state.listByFilter[filter]);
  // 마찬가지로 byId 리듀서가 lookup table임을 드러낼 필요는 없으므로
  // fromById.getTodo 셀렉터를 통하여 state, id를 입력 받는다.
  return ids.map(id => fromById.getTodo(state.byId, id));
};
```
