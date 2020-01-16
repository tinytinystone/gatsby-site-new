import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import favicon from '../favicon-96x96.png';

import './index.scss';

import Layout from '../components/Layout';
import List from '../components/List';

import 'normalize.css';

class App extends Component {
  render() {
    const { data } = this.props;
    return (
      <>
        <Helmet
          title={`Puffin's devlog: Home`}
          link={[{ rel: 'shortcut icon', href: `${favicon}` }]}
        />
        <Layout>
          <List edges={data.allMarkdownRemark.edges} />
        </Layout>
      </>
    );
  }
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
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          frontmatter {
            title
            path
            date
            excerpt
          }
        }
      }
    }
  }
`;

export default App;
