---
path: '/default-parameter'
date: '2023-11-06'
title: '기본 매개변수와 null/undefined'
tags: ['default_parameter']
excerpt: '기본 매개변수가 왜 제대로 동작하지 않은걸까!'
---
JS에서는 대응하는 인자가 없는 매개변수는 에러를 내지 않고 undefined 값이 된다. ES6 이후 함수 매개변수의 기본값을 정의할 수 있다. 기본 매개변수(default parameter)는 매개변수가 생략되었거나 `undefined`가 전달될 때 사용할 기본값을 매개변수 이름 뒤 등호(=)로 표시하여 정의한다. 

그런데 기본 매개변수를 사용하다가 에러를 내는 경우를 몇 번 목격했다. 대표적으로 undefined가 아니라 null이 넘어오는 경우다. DB의 특정 컬럼에 `null` 값이 들어가 있는 경우가 대표적이다. 그 외에도 해당 함수를 다른 곳에서도 사용하게 되는 경우 작성자의 의도와 다르게 null이나 falsy 값이 들어가는 경우가 생길 수 있다.

```js
const fetchTags = (options = {}) => {
    return options.tags
}
// fetchTags() -> undefined
// fetchTags(null) -> Cannot read property 'tag' of null

const multiplyTenfold = (array = []) => {
    return array.map(i => i * 10)
}
// multiplyTenfold() -> []
// multiplyTenfold(null) -> Cannot read property 'map' of null
```

사실 코드리뷰를 해도 한눈에 안들어온다. JS에서 null과 undefined를 엄격히 구분해야 하는 경우가 많지 않아서 인지되지 않는 것 같다. 그리고 처음 작성자의 의도와 다르게 이후 코드가 덧붙여지면서 호출부에서 문제가 생기는 경우도 있다.

이런 문제를 미연에 방지하는 방법 몇 가지를 생각해본다.

**TypeScript `strictNullCheck`**

TS를 사용할 수 있다면, `strictNullCheck` 옵션을 enable 해둔다.
```ts
const fetchTags = (options?: {tags: string[]}) => {
    return options.tags // 'options' is possibly 'undefined'.
}
fetchTags(null) // Argument of type 'null' is not assignable to parameter of type '{ tags: string[]; } | undefined'.
```

**테스트 케이스 추가하기**

null이 인자로 들어가는 테스트 케이스를 추가하는 것이 필수적이다. null이 들어가서 에러를 일으키는 경우가 생기기 때문이다. 테스트 케이스를 추가할 때 함수를 아래와 같이 바꿔줄 수 있을 것이다.

**Optional Chaining**
```js
const fetchTags = (options) => {
    return options?.tags
}
```

**Nullish coalescing operator**
```js
const fetchTags = (options) => {
    return (options ?? {}).tags
    // 혹은 return options?.tags ?? []
}
```

**매개변수가 생략될 수 있는 경우에만 기본값 사용하기**
마지막으로 기본 매개변수는 매개변수가 생략될 수 있는 경우, 그러니까 선택사항으로 들어가는 경우에만 사용하는 것이 의도에 맞는 것 같다. 물론, 꼭 마지막 매개변수만 기본값을 사용할 수 있는 건 아니다. 하지만 통상적으로 undefined가 나타내는 것은 아무 것도 들어오지 않았다는 뜻, 그러니까 생략했다는 의미다.