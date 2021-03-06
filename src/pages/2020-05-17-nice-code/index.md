---
path: '/lodash'
date: '2020-05-17'
title: 'lodash'
tags: ['library', 'lodash']
excerpt: 'lodash의 특징 및 장점'
---

회사에서 lodash를 자주 사용한다. 원래 ES6 내장 함수를 주로 사용해왔고, 외부 라이브러리에 의존하기보단 내장함수 쪽이 더 낫지 않나 하고 막연하게 생각했다. 사람들이 많이 사용하는 데에는 이유가 있는데도 그냥 그렇게 생각했다. 그런데 lodash를 접하고 생각이 꽤 많이 바뀌었다.

먼저, transpiler 버전 때문에 IE 등을 지원하지 못하는 프로젝트에서 크로스 브라우징을 신경쓰지 않아도 된다. 최근 babel 버전이 낮은 프로젝트에서 find 메소드를 써서 IE에서 동작을 하지 않은 일이 있었다. 이때, lodash의 find 함수를 사용해서 해결을 했다.

lodash에는 다양한 메소드를 가지고 있다. '이런 기능이 있을까' 싶은 내용도 검색해보면 웬만큼 구현되어 있고, 없다 하더라도 chain 메소드로 연결하면 거의 구현이 가능하다. 또, map, filter 등 기존에는 배열에만 사용할 수 있는 함수가 lodash에서는 객체에서도 사용이 가능했다.

여러 사람이 커밋하는 프로젝트여도, lodash를 사용하면 코드의 일관성과 가독성이 좋다. lodash는 함수형으로, 외부 상태를 바꾸지 않는 순수함수를 사용한다. 그래서 테스트 및 유지보수가 원활해진다. 또, 워낙 다양한 기능이 존재하는데 이는 이름만으로도 어떤 역할을 하는지 예상할 수 있고 문서도 잘 정리되어 있다.

내가 체감할 수 있는 정도는 아니지만, 성능이 좋다고 한다.

lodash에서 오늘 내가 짠 코드는, 'tt_'로 시작하는 쿼리스트링의 키와 값을 가져와서, 'tt_'을 제거한 새로운 쿼리스트링을 만드는 것이었는데, lodash를 사용하여 아래와 같이 짜보았다.

```js
const qs_value = _
  .chain(req.query)
  .map((value, key) => {
    if (key.slice(0, 3) === 'tt_') return `${key.slice(3)}=${value}`;
  })
  .compact()
  .value()
  .join('&');
```

굉장히 간편하게 코드를 작성할 수 있었다.