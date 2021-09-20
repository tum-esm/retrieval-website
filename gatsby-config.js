require('dotenv').config({ path: `.env` });

module.exports = {
    siteMetadata: {
        siteUrl: 'https://retrieval-plots.dostuffthatmatters.dev',
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
        {
            resolve: 'gatsby-source-strapi',
            options: {
                apiURL: process.env.API_URL || 'http://localhost:1337',
                collectionTypes: ['plot-meta'],
                queryLimit: 1000,
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: 'EM27 Retrieval Plots',
                short_name: 'EM27 Retrieval Plots',
                start_url: '/',
                background_color: '#ffffff',
                theme_color: '#f60948',
                icon: 'src/assets/favicon.ico',
            },
        },
    ],
};
