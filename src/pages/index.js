import React, { Component } from 'react';
import { graphql } from 'gatsby';

import s from './index.module.scss';

import Layout from '../components/Layout';
import List from '../components/List';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    const { edges } = data.allMarkdownRemark;

    return (
      <Layout>
        <List edges={edges} />
      </Layout>
    );
  }
}

export const query = graphql`
  query HomepageQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          frontmatter {
            title
            path
            date
          }
        }
      }
    }
  }
`;

export default App;
