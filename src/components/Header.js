import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';

const TitleAndDescription = ({ data }) => {
  const title = data.site.siteMetadata.title;
  // const description = data.site.siteMetadata.description;
  return (
    <header>
      <h1 className="mt-3 text-30 uppercase">
        <Link
          className="no-underline font-bold text-blue-500 hover:text-blue-400"
          to="/"
        >
          {title}
        </Link>
      </h1>
      {/*<div>{description}</div>*/}
      <nav className="mb-5">
        <div className="inline-block mr-3">
          <Link
            className="text-blue-500 hover:text-blue-400 no-underline"
            to="/about"
          >
            About
          </Link>
        </div>
        <div className="inline-block mr-3">
          <Link
            className="text-blue-500 hover:text-blue-400 no-underline"
            to="/"
          >
            Blog
          </Link>
        </div>
        <div className="inline-block">
          <Link
            className="text-blue-500 hover:text-blue-400 no-underline"
            to="/tags"
          >
            Tags
          </Link>
        </div>
      </nav>
    </header>
  );
};

const Header = () => {
  return (
    <StaticQuery
      query={graphql`
        query {
          site {
            siteMetadata {
              title
              description
            }
          }
        }
      `}
      render={(data) => <TitleAndDescription data={data} />}
    />
  );
};

export default Header;
