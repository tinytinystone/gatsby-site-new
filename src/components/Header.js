import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';

import s from './Header.module.scss';

const TitleAndDescription = ({ data }) => {
  const title = data.site.siteMetadata.title;
  const description = data.site.siteMetadata.description;

  return (
    <div className={s.header}>
      <Link to="/">
        <h1 className={s.headerTitle}>{title}</h1>
      </Link>
      <p className={s.headerDesc}>{description}</p>
    </div>
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
