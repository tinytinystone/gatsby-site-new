import React, { Component } from 'react';
import { Link } from 'gatsby';
import s from './List.module.scss';

export default class List extends Component {
  render() {
    const { edges } = this.props;
    return (
      <div className={s.mainList}>
        {edges.map(edge => {
          const { frontmatter } = edge.node;
          return (
            <div className={s.mainPost} key={frontmatter.path}>
              <Link to={frontmatter.path}>{frontmatter.title}</Link>
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
