/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: "Puffin's DevLog",
    description: '프로그래밍의 세계를 여행하는 히치하이커의 여행일지',
    url: 'https://jeesoo.work/',
    image:
      'https://pbs.twimg.com/profile_images/1073095560641404928/piUv6ERk_400x400.jpg',
  },
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages/`,
      },
      __key: 'pages',
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
        ],
      },
    },
  ],
};
