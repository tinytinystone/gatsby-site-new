---
path: '/algorithm-for-everyone-1'
date: '2018-12-08'
title: 'TIL: 모두를 위한 알고리즘 1'
tags: ['algorithm', 'TIL']
excerpt: '알고리즘 공부'
---

# 요약

- **알고리즘** 이란, 주어진 문제를 풀기 위한 절차나 방법이다. 문제, 입력, 출력을 잘 정의하여 알고리즘의 구조를 짜면 좋다.
- **계산복잡도** 는 알고리즘이 문제를 풀기 위해 해야 하는 계산이 얼마나 복잡한지를 나타낸 정도를 말한다.
  - 계산을 수행하는 데 걸리는 시간을 나타내는 **시간복잡도** 와 메모리/기억장소 등 필요한 공간을 나타내는 **공간복잡도** 가 있다.
  - 계산 복잡도를 표현하는 방법에는 여러 가지가 있는데, 대표적인 것은 `Big O 표기법`이다.
- **자료구조** 란 여러 자료와 정보를 컴퓨터 안에 저장하고 보관하는 방식을 말한다.
  - 알고리즘을 풀기 위해서는 주어진 자료를 효율적으로 정리하여 보관하는 것이 중요하다.

# 미로찾기 알고리즘

## 그래프

- 그래프는 꼭지점(vertex) 여러 개와 각 꼭지점 사이의 연결 관계를 선(edge)으로 표현한 것을 말한다.
- 그래프를 자료구조로 저장하는 방법에는 여러 가지가 있다. 책에서 파이썬의 리스트와 딕셔너리를 이용해 표현한 것은 아래와 같다.

```python
friend_info = {
  'Summer': ['John', 'Justin', 'Mike'],
  'John': ['Summer', 'Justin'],
  'Justin': ['Summer', 'John'],
  'Mike': ['Summer']
}
```

- 아래와 같이 연결선 리스트로도 나타낼 수 있다.

```python
friend_info = [
  ['Summer', 'John'],
  ['Summer', 'Justin'],
  ['Summer', 'Mike'],
  ['John', 'Summer'],
  ['John', 'Justin']
]
```

- 참고 링크
  - [그래프 위키백과](<https://ko.wikipedia.org/wiki/%EA%B7%B8%EB%9E%98%ED%94%84_(%EC%9E%90%EB%A3%8C_%EA%B5%AC%EC%A1%B0)>)
  - [칸 아카데미 - 그래프](https://ko.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/describing-graphs)

## 문제 분석과 모델링

- 주어진 문제를 정형화 혹은 단순화하여 컴퓨터가 알아듣기 쉽게 설명할 수 있도록 한다.
  - 미로찾기의 경우, 4x4 퍼즐로 만들어 구역마다 알파벳으로 이름을 붙인다.
  - 위치를 각각 꼭지점으로 만들고, 막히지 않아 이동할 수 있는 위치를 모두 선으로 연결하면 그래프가 만들어진다.

### 코드 (JavaScript)

```js
// 미로 정보를 객체로 저장한다.
const maze = {
  a: ['e'],
  b: ['c', 'f'],
  c: ['d'],
  d: ['c'],
  e: ['a', 'i'],
  f: ['b', 'g', 'j'],
  g: ['f', 'h'],
  h: ['g', 'l'],
  i: ['e', 'm'],
  j: ['f', 'k', 'n'],
  k: ['j', 'o'],
  l: ['h', 'p'],
  m: ['i', 'n'],
  n: ['m', 'j'],
  o: ['k'],
  p: ['l'],
};

function solveMaze(g, start, end) {
  const queue = [];
  const done = new Set();
  // queue: 앞으로 처리할 사람을 저장
  // done: 이미 큐에 추가한 사람을 저장할 집합

  queue.push(start);
  done.add(start);
  // 검색의 출발점이 될 지점을 queue와 done에 추가

  while (queue.length > 0) {
    // queue에 처리할 경로가 남아 있다면
    const route = queue.pop();
    // 처리할 경로를 queue에서 꺼내고
    const vertex = route[route.length - 1];
    // 경로의 마지막 지점을 가져온다

    if (vertex === end) {
      return route;
    }

    for (let x of maze[vertex]) {
      // vertex와 연결된 다른 vetex 중
      // 한번도 방문한 적이 없는지 set을 통해 확인하고
      if (!done.has(x)) {
        queue.push(route + x);
        done.add(x);
        // 방문한 적이 없다면 경로에 추가한다
      }
    }
  }
  return '일치하는 경로가 없습니다.';
}

solveMaze(maze, 'a', 'p');
```
