import React from 'react';
import { graphql, Link } from 'gatsby';
import { Helmet } from 'react-helmet';

import s from './blogPost.module.scss';

import Layout from '../components/Layout';
import favicon from '../favicon-96x96.png';

const Template = ({ data, pageContext }) => {
  const { next, prev } = pageContext;

  const { markdownRemark } = data;
  const title = markdownRemark.frontmatter.title;
  const htmlBody = markdownRemark.html;
  return (
    <>
      <Helmet
        title={`Puffin's devlog: ${title}`}
        link={[{ rel: 'shortcut icon', href: `${favicon}` }]}
      />
      <Layout>
        <h1>{title}</h1>
        <div
          className={`post ${s.post}`}
          dangerouslySetInnerHTML={{ __html: htmlBody }}
        />
        <div className={s.postButton}>
          <div className={s.postButtonItem}>
            {next && (
              <Link to={next.frontmatter.path}>
                Next: {`${next.frontmatter.title}`}
              </Link>
            )}
          </div>
          <div className={s.postButtonItem}>
            {prev && (
              <Link to={prev.frontmatter.path}>
                Prev: {`${prev.frontmatter.title}`}
              </Link>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export const query = graphql`
  query($pathSlug: String!) {
    markdownRemark(frontmatter: { path: { eq: $pathSlug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;

export default Template;
