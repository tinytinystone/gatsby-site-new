import React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import { Helmet } from 'react-helmet';
import favicon from '../favicon-96x96.png';

const AllTagsTemplate = ({ data, pageContext }) => {
  const { tags } = pageContext;
  return (
    <>
      <Helmet
        title={`Puffin's devlog: Tags`}
        link={[{ rel: 'shortcut icon', href: `${favicon}` }]}
      />
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
    </>
  );
};

export default AllTagsTemplate;
