import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';

import './Header.scss';

const TitleAndDescription = ({ data }) => {
  const title = data.site.siteMetadata.title;
  const description = data.site.siteMetadata.description;
  return (
    <header className="header">
      <h1 className="headerTitle">
        <Link to="/">{title}</Link>
      </h1>
      <div className="headerDesc">{description}</div>
      <nav>
        <div>
          <Link to="/about">About</Link>
        </div>
        <div>
          <Link to="/">Blog</Link>
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
      render={data => <TitleAndDescription data={data} />}
    />
  );
};

export default Header;
