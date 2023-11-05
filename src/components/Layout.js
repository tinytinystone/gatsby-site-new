import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Header from './Header';

export default function Layout({ pageTitle, children }) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  return (
    <div className="max-w-6xl h-screen my-0 mx-auto flex flex-col">
      <Header />
      <main>{children}</main>
    </div>
  );
}
