/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
require('prismjs/themes/prism.css');

exports.onRouteUpdate = ({ location }) => {
  console.log('new pathname', location.pathname);
  if (window.MathJax !== undefined) {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
  }
};
