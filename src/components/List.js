import React, { Component } from 'react';
import { Link } from 'gatsby';

export default class List extends Component {
  render() {
    const { edges } = this.props;
    return (
      <>
        {edges.map(edge => {
          const { frontmatter } = edge.node;
          return (
            <div className="main__post" key={frontmatter.path}>
              <Link to={frontmatter.path}>{frontmatter.title}</Link>
            </div>
          );
        })}

        <div>
          <Link to="/tags">Browse by Tag</Link>
        </div>
      </>
    );
  }
}
