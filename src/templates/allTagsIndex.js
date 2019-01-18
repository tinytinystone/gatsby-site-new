import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/Layout';

const AllTagsTemplate = ({ data, pageContext }) => {
  const { tags } = pageContext;
  return (
    <Layout>
      <div>태그로 찾아보기</div>
      <ul>
        {tags.map((tagName, index) => {
          return (
            <li key={index}>
              <Link to={`/tags/${tagName}`}>{tagName}</Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export default AllTagsTemplate;
