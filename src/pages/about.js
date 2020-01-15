import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Helmet } from 'react-helmet';
import favicon from '../favicon-96x96.png';

import './index.scss';

export default class About extends Component {
  render() {
    return (
      <>
        <Helmet
          title={`Puffin's devlog: About`}
          link={[{ rel: 'shortcut icon', href: `${favicon}` }]}
        />
        <Layout>
          <h3>whoami</h3>
          <p>
            서울에 살며 프로그래밍을 하는 홍지수입니다.{' '}
            <a href="https://dable.io/">데이블</a>에서 웹 개발자로 일하고
            있습니다.
          </p>
          <p>
            패스트캠퍼스에서 프로그래밍 교육 프로덕트를 기획하는 일을 했습니다.
            좋은 교육 과정을 만들기 위해 개발 공부를 시작했다가, 그 공부가
            재밌어서 개발자가 되었습니다.
          </p>
          <p>
            프로그래밍, 그 중에서도 <em>웹 프론트엔드</em>에 매력을 느껴 공부를
            시작했습니다. 사용자와 맞닿는 지점에서 기술이 하는 역할에 관심이
            많습니다. 요즘은 서버를 열심히 가지고 노는 중입니다.
          </p>
          <p>
            개발자 부족과 개발 문화가 흥미롭습니다. 대학에서 문화인류학과
            과학기술사회학을 공부해서 그런가 봅니다. IT 분야에 오기 전에는
            방송국에서 다큐멘터리를 만들었고 로펌에 다니기도 했습니다.
          </p>
          <p>
            함께 일하는 동료들을 잘 인터뷰하여 보이지 않는 요구사항을 찾아내고,
            이를 통해 더 좋은 구현물을 만들기 위해 노력하고 있습니다. 비전공자의
            장점을 살리되, 부족한 부분은 계속 채워나가고자 컴퓨터과학의 기초를
            계속 공부해 나가고 있습니다.
          </p>
          <p>
            사용자에게 필요한 제품이라면 언어와 기술의 제한 없이 구현해 내고,
            문제를 잘 정의하고 해결해 내는 유능한 소프트웨어 엔지니어가 되는
            것을 목표로 하고 있습니다.
          </p>
          <h3>skill</h3>
          <dl>
            <dt>Development:</dt>
            <dd>JavaScript(ES6+), HTML/CSS, React, Redux, Node.js, SQL, git</dd>
            <dt>Others:</dt>
            <dd>(proficient)English</dd>
          </dl>
          <h3>others</h3>
          <ul>
            <li>jeesoo.hong at gmail com</li>
            <li>
              <a href="https://github.com/tinytinystone">github</a>
            </li>
            <li>
              <a href="https://www.facebook.com/jeesoo.hong">facebook</a>
            </li>
            <li>
              <a href="https://twitter.com/tinytinystone">twitter</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/jeesoohong">linkedIn</a>
            </li>
          </ul>
        </Layout>
      </>
    );
  }
}
