import React from 'react'
import { graphql, Link } from 'gatsby'
import Header from '../components/Header'
import './Index.css'

const Layout = ({ data }) => {
  const { edges } = data.allMarkdownRemark
  return (
    <div>
      <Header />
      <div className="main">
        {edges.map(edge => {
          const { frontmatter } = edge.node
          return (
            <div className="main__post" key={frontmatter.path}>
              <Link to={frontmatter.path}>{frontmatter.title}</Link>
            </div>
          )
        })}

        <div>
          <Link to="/tags">Browse by Tag</Link>
        </div>
      </div>
    </div>
  )
}

export const query = graphql`
  query HomepageQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          frontmatter {
            title
            path
            date
          }
        }
      }
    }
  }
`

export default Layout
