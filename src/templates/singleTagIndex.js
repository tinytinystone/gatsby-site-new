import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import { Helmet } from 'react-helmet';
import favicon from '../favicon-96x96.png';
// import '../pages/index.module.scss';

const SingleTagTemplate = ({ data, pageContext }) => {
  const { posts, tagName } = pageContext;
  return (
    <>
      <Helmet
        title={`Puffin's devlog: Tags`}
        link={[{ rel: 'shortcut icon', href: `${favicon}` }]}
      />
      <Layout>
        <div>{`${tagName}`} 관련 포스트</div>
        <ul>
          {posts.map((post, index) => {
            return (
              <li key={index}>
                <Link to={post.frontmatter.path}>{post.frontmatter.title}</Link>
              </li>
            );
          })}
        </ul>
      </Layout>
    </>
  );
};

export default SingleTagTemplate;
