import React from 'react';
import { graphql, Link } from 'gatsby';
import { Helmet } from 'react-helmet';

import s from './blogPost.module.scss';

import Layout from '../components/Layout';
import favicon from '../favicon-96x96.png';
import ReactUtterences from 'react-utterances';

import SEO from '../components/SEO';

const Template = ({ data, pageContext, location }) => {
  const { next, prev } = pageContext;

  const { markdownRemark } = data;
  const title = markdownRemark.frontmatter.title;
  const htmlBody = markdownRemark.html;
  const repo = 'tinytinystone/blog-comments';

  return (
    <>
      <Layout>
        <SEO
          title={`Puffin's devlog: ${title}`}
          link={[{ rel: 'shortcut icon', href: `${favicon}` }]}
          pathname={location.pathname}
        />
        <h1>{title}</h1>
        <div
          className={`post ${s.post}`}
          dangerouslySetInnerHTML={{ __html: htmlBody }}
        />
        <div>
          {' '}
          <ReactUtterences repo={repo} type={'url'} />
        </div>
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
