---
path: '/first-post'
date: '2018-11-11'
title: '11/20/2018 리액트 학습일지'
tags: ['TIL', 'React']
excerpt: '제어되지 않는 컴포넌트 / 성능 최적화 (Pure.Component, 불변성) / 게시판 만들기 실습'
image: ''
---

# 제어되지 않는 컴포넌트

from 을 구현할 때는 가급적이면 DOM 이 아니라 React 에서 제어되도록 컴포넌트를 만드는 것이 좋다. 하지만 필요에 따라 제어되지 않는 컴포넌트로 만들어야 할 때가 있다.

1. HTML 태그 상에서 value(혹은 checked)에 값을 넘기게 되면 제어되는 컴포넌트로서 작동할 수 있으므로, React 상에서 사용되는 `defaultValue` 혹은 `defaultChecked` 등의 어트리뷰트를 통해 기본값을 표시할 수 있다.

```html
<input type="text" defaultValue="기본값으로 표시됩니다." />
<input type="checkbox" defaultChecked={true} />
<input type="radio" defaultChecked={false} />
```

1. 파일을 서버에 업로드하거나 처리해야 하는 경우 `<input type="file" />`를 사용할 수 있는데, 이 태그는 언제나 **제어되지 않는 컴포넌트** 이다.

# 성능 최적화

# 불변성

# 비교조정
