import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import List from '../components/List';

export default function App({ data }) {
  return (
    <>
      <Layout>
        <List edges={data.allMarkdownRemark.edges} />
      </Layout>
    </>
  );
}

export const query = graphql`
  query HomepageQuery {
    allFile(filter: { extension: { eq: "png" } }) {
      edges {
        node {
          publicURL
        }
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          frontmatter {
            title
            path
            date
            excerpt
            image
          }
        }
      }
    }
  }
`;

export const Head = () => <title>Puffin's devlog: Home</title>;
