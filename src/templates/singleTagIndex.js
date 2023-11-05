import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';

const SingleTagTemplate = ({ data, pageContext }) => {
  const { posts, tagName } = pageContext;
  return (
    <>
      <Layout>
        <div>{`${tagName}`}</div>
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
