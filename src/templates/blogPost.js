import React from 'react';
import { graphql, Link } from 'gatsby';
import s from './blogPost.module.scss';
import Layout from '../components/Layout';

const Template = ({ data, pageContext }) => {
  const { next, prev } = pageContext;

  const { markdownRemark } = data;
  const title = markdownRemark.frontmatter.title;
  const htmlBody = markdownRemark.html;
  return (
    <Layout className="post">
      <h1>{title}</h1>
      <div
        className={s.blogPost}
        dangerouslySetInnerHTML={{ __html: htmlBody }}
      />
      <div className={s.postButton}>
        <div>
          {next && (
            <Link to={next.frontmatter.path}>
              Next: {`${next.frontmatter.title}`}
            </Link>
          )}
        </div>
        <div>
          {prev && (
            <Link to={prev.frontmatter.path}>
              Prev: {`${prev.frontmatter.title}`}
            </Link>
          )}
        </div>
      </div>
    </Layout>
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
