import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';

import s from './Header.module.scss';

const TitleAndDescription = ({ data }) => {
  const title = data.site.siteMetadata.title;
  const description = data.site.siteMetadata.description;
  return (
    <header className={s.header}>
      <h1 className={s.headerTitle}>
        <Link to="/">{title}</Link>
      </h1>
      <div className={s.headerDesc}>{description}</div>
      <nav className={s.nav}>
        <div className={s.navItem}>
          <Link to="/about">About</Link>
        </div>
        <div className={s.navItem}>
          <Link to="/">Blog</Link>
        </div>
        <div className={s.navItem}>
          <Link to="/tags">Tags</Link>
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
