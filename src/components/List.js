import React, { Component } from 'react';
import { Link } from 'gatsby';
import './List.scss';

export default class List extends Component {
  render() {
    const { edges } = this.props;
    return (
      <div className="mainList">
        {edges.map(edge => {
          const { frontmatter } = edge.node;
          return (
            <div className="mainPost" key={frontmatter.path}>
              <div className="metaData">
                <time dateTime={frontmatter.date} className="time">
                  {frontmatter.date}
                </time>
              </div>
              <h2 className="mainTitle">
                <Link to={frontmatter.path}>{frontmatter.title}</Link>
              </h2>
              <p className="excerpt">{frontmatter.excerpt}</p>
            </div>
          );
        })}

        <div>
          <Link to="/tags">Browse by Tag</Link>
        </div>
      </div>
    );
  }
}
