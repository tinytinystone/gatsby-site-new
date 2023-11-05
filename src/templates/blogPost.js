import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/Layout';
import ReactUtterences from 'react-utterances';

const Template = ({ data, pageContext, location }) => {
  const { next, prev } = pageContext;

  const { markdownRemark } = data;
  const { title, date } = markdownRemark.frontmatter;
  const htmlBody = markdownRemark.html;
  const repo = 'tinytinystone/blog-comments';

  return (
    <>
      <Layout>
        <h1 className="text-24 text-green-500">{title}</h1>
        <time className="text-gray-500 mb-5 block" dateTime={date}>
          {date}
        </time>
        <div
          className="border-dotted border-gray-100 border-t-2 markdown pt-5"
          dangerouslySetInnerHTML={{ __html: htmlBody }}
        />
        <div>
          {' '}
          <ReactUtterences repo={repo} type={'url'} />
        </div>
        <div className="p-2 center">
          <div className="pb-1 underline">
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
    </>
  );
};

export const query = graphql`
  query ($pathSlug: String!) {
    markdownRemark(frontmatter: { path: { eq: $pathSlug } }) {
      html
      frontmatter {
        title
        date
        excerpt
        image
      }
    }
  }
`;

export default Template;
