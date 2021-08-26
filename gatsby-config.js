module.exports = {
    siteMetadata: {
        siteUrl: 'https://www.yourdomain.tld',
        title: 'retrieval-plots-v2',
    },
    plugins: [
        'gatsby-plugin-postcss',
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-mdx',
        'gatsby-plugin-root-import',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'pages',
                path: './src/pages/',
            },
            __key: 'pages',
        },
    ],
};
