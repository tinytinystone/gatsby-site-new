import React, { Component } from 'react';
import { Link } from 'gatsby';
import s from './List.module.scss';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      postsPerPage: 10,
    };
  }
  handleClick = e => {
    this.setState({
      currentPage: Number(e.target.id),
    });
    window.scrollTo(0, 0);
  };
  render() {
    const { edges } = this.props;
    const { currentPage, postsPerPage } = this.state;

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = edges.slice(indexOfFirstPost, indexOfLastPost);

    const renderPosts = currentPosts.map(edge => {
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
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(edges.length / postsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li
          key={number}
          id={number}
          style={currentPage === number ? { background: '#eee' } : undefined}
          onClick={this.handleClick}
        >
          {number}
        </li>
      );
    });
    return (
      <div className={s.mainList}>
        {renderPosts}
        <ul className={s.pages}>{renderPageNumbers}</ul>
      </div>
    );
  }
}
