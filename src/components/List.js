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
              <div className={s.metaData}>
                <time dateTime={frontmatter.date} className={s.time}>
                  {frontmatter.date}
                </time>
              </div>
              <h2 className={s.mainTitle}>
                <Link to={frontmatter.path}>{frontmatter.title}</Link>
              </h2>
              <p className={s.excerpt}>{frontmatter.excerpt}</p>
            </div>
          );
        })}

        <div className={s.tags}>
          <Link to="/tags">Browse by Tag</Link>
        </div>
      </div>
    );
  }
}
