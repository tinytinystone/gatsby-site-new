import React, { Component } from 'react';
import { Link } from 'gatsby';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      postsPerPage: 10,
    };
  }
  handleClick = (e) => {
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

    const renderPosts = currentPosts.map((edge) => {
      const { frontmatter } = edge.node;
      return (
        <div key={frontmatter.path} className="mb-2">
          <div>
            <time dateTime={frontmatter.date} className="text-13 text-gray-500">
              {frontmatter.date}
            </time>
          </div>
          <h2 className="text-18">
            <Link to={frontmatter.path}>{frontmatter.title}</Link>
          </h2>
          <p>{frontmatter.excerpt}</p>
        </div>
      );
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(edges.length / postsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map((number) => {
      return (
        <li
          key={number}
          id={number}
          onClick={this.handleClick}
          className={`cursor-pointer flex items-center justify-center px-3 h-8 leading-tight text-blue-400 bg-white hover:text-blue-500 ${
            currentPage === number && `bg-gray-100 font-bold`
          }`}
        >
          {number}
        </li>
      );
    });
    return (
      <div>
        {renderPosts}
        <ul className="flex justify-center -space-x-px text-sm my-5 mx-auto">
          {renderPageNumbers}
        </ul>
      </div>
    );
  }
}
