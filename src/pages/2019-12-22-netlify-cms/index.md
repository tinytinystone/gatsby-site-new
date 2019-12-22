---
path: '/netlify-cms'
date: '2019-12-22'
title: '서버 없이 CMS 구축하기: Netlify CMS'
tags: ['netlify', 'toy_project', 'cms']
excerpt: 'react로 만든 정적 사이트에서 코드 몇 줄만 추가해서 CMS를 붙였습니다'
---

친구의 친구로부터 부탁을 받아 작은 프로젝트를 진행했다. 갤러리 형태의 정적 사이트여서 서버 없이 프론트엔드 코드만 작성하여 github에 코드를 올렸고, [Netlify](https://www.netlify.com/)를 이용해 배포와 호스팅을 마쳤다. 

사이트를 만들고 배포하는 것까지는 문제가 없었는데, (개발을 모르는) 의뢰자가 원할 때 추가로 이미지를 업로드하고 싶다는 요청을 어떻게 처리할지가 고민이었다. 생각해본 안은 아래와 같았다.

### 1. 직접 github 레포에서 수정/추가할 수 있도록 한다

가장 먼저 생각한 건 역시 github에서 직접 이미지를 업로드하고 데이터를 추가하는 것이었다. 굳이 레포를 clone하지 않더라도 github 사이트에서 사진을 업로드하고 데이터를 추가하는 것은 가능한 일이다. 처음에는 스크린샷을 떠서 그 방법을 알려주려고 했다. 그러나 개발을 모르는 사람이 익숙하지 않은 github 사이트에서 직접 json 형태로 된 데이터를 추가하고, 레포를 찾아들어가서 사진을 추가하는 것이 쉽지 않을 것 같았다.

### 2. 서버를 추가한다

서버 코드를 추가하고 AWS 프리티어 계정을 사용해서 별도의 admin 페이지를 구축하는 방법도 생각했다. 그런데 1년이 지난 후 돈이 얼마나 나갈지도 모르고, 괜히 배보다 배꼽이 더 큰 작업이 될 것 같았다.

### (new!) 3. Netlify CMS를 사용한다

몇 줄의 코드만 추가하면 정적 사이트에서 CMS(Content Management System)를 쓸 수 있는 오픈소스가 있다는 것을 들었다. 한번 코드를 살펴보고 지금 사이트에서도 적용이 가능한지 알아보기로 했다.

내가 만든 사이트는 create-react-app으로 되어 있고, public 폴더 내에 이미지 파일들을 저장하여 바로 가져다가 사용하고 있었다. ([github 레포](https://github.com/tinytinystone/black-archive)) 

netlify cms는 내가 만든 프로젝트처럼 react로만 만들어진 정적 사이트에도 붙일 수 있지만, gatsby, hexo 등 정적 사이트 생성기를 사용한 경우, 혹은 Next 등 server-side에서 렌더링을 하는 프레임워크를 사용하는 경우에 쉽게 적용할 수 있다. 사실 후자와 관련한 가이드가 더 자세히 적혀 있어 처음에는 gatsby를 꼭 사용해야 하는 것이 아닐지 생각해 바꿔보려고 시도했다. 그런데 굳이 그렇게 하지 않아도 json 데이터를 추가하거나 이미지 파일을 추가하는 기능은 쉽게 붙일 수 있었다.

먼저, `public/admin` 경로로 폴더를 하나 생성하고, 그 아래에 `index.html` 파일과 `config.yml` 파일을 추가한다.

`admin/index.html`은 netlify CMS의 어드민 페이지의 인터페이스 부분으로, `https//주소.com/admin`으로 접속하면 어드민 페이지에 바로 접속할 수가 있다. `npm install netlify-cms --save`로도 설치할 수 있는데, 나는 전자의 방법으로 실행했다.

`config.yml`은 git branch 설정, 데이터 연결 설정 등을 하는 공간이다.

```yml
backend:
  name: git-gateway # github/gitlab을 사용하는 경우
  branch: master # 업데이트 할 브랜치명(optional)
media_folder: "public/images" # 파일을 직접 업로드할 수 있는 기능을 사용할 경우 파일 로드/저장 경로 설정. admin 페이지에서 저장/삭제 에디터를 사용할 수 있다. 이 경로는 프로젝트의 root에서 상대값을 가지므로 해당 경로를 잘 설정해줘야 한다.
```

다음으로는, 콘텐츠의 구조를 결정하는 collection 부분이다. collection의 타입은 크게 폴더와 파일로 나뉜다. 폴더 콜렉션을 선택한다면 같은 포맷, 필드, 설정 옵션 등을 가지는 파일(들)을 같은 폴더에 저장하게 된다. 새로운 필드 혹은 아이템을 생성할 수도 있다. gatsby로 만든 블로그는 글 한 개 당 하나의 폴더를 가지는데, 이 경우에는 폴더 콜렉션을 선택해야 한다. 반면, 지금 만드는 프로젝트는 한 개의 파일 내에서 데이터를 생성하거나 삭제할 수 있다. 나는 `imageList.json`이라는 파일을 생성해두고 해당 json 파일에 객체 형태로 데이터를 추가하고 싶었다.

```json
{
  "comments": [
    {
      "key": "001",
      "when": "2019-09-10T22:24:00",
      "where": "Jamsil 3-dong, Songpa-gu, Seoul, Korea"
    },
    {
      "key": "002",
      "when": "2019-07-20T21:12:00",
      "where": "Seokchon dong, Songpa-gu, Seoul, Korea"
    },
    // 여기에 객체를 추가
    ]
}

```

그래서, 아래와 같이 `config.yml` 파일을 추가했다.

```yml
collections:
  - name: "data"
    label: "data"
    files:
      - file: "src/data/imageList.json"
        label: "comments"
        name: "comments"
        fields:
          - label: comments
            name: comments
            widget: list
            fields:
              - label: key
                name: key
                widget: text
              - label: when
                name: when
                widget: text
              - label: where
                name: where
                widget: text
```

완성!

여기에 접속할 수 있는 권한설정은 Netlify 의 Settings - Identity에서 권한을 부여했다. 5명까지는 무료로 권한을 부여할 수 있다.

너어어어무 편하게 (단순하게 react로 만든)정적 사이트에 CMS를 추가할 수 있었다.

Netlify CMS에 관한 문서는 여기에서 -> https://www.netlifycms.org/docs/intro/