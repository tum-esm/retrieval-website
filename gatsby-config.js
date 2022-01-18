require('dotenv').config({
    path: `.env`,
});

module.exports = {
    siteMetadata: {
        siteUrl: 'https://www.yourdomain.tld',
        title: 'retrieval-website-v2',
    },

    plugins: [
        'gatsby-plugin-postcss',
        `gatsby-plugin-sass`,
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-sitemap',
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                name: 'EM27 Retrieval Plots',
                short_name: 'EM27 Retrieval Plots',
                start_url: '/',
                background_color: '#ffffff',
                theme_color: '#f60948',
                icon: 'src/assets/favicon.ico',
            },
        },
        'gatsby-plugin-mdx',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'pages',
                path: './src/pages/',
            },
            __key: 'pages',
        },
        {
            resolve: `gatsby-plugin-typescript`,
            options: {
                isTSX: true, // defaults to false
                jsxPragma: `jsx`, // defaults to "React"
                allExtensions: true, // defaults to false
            },
        },
    ],
};
