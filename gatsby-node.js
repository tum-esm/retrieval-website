const path = require(`path`);
const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:1337';

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
    const result = await graphql(`
        query {
            allStrapiPlotMeta {
                nodes {
                    strapiId
                    campaignId
                }
            }
        }
    `);

    /*
    async function fetchMeta(id) {
        const metaResponse = await fetch(`${API_URL}/plot-metas/${id}`);
        return await metaResponse.json();
    }*/
    const metas = result.data.allStrapiPlotMeta.nodes;

    for (let i = 0; i < metas.length; i++) {
        const metaResponse = await fetch(
            `${API_URL}/plot-metas/${metas[i].strapiId}`
        );
        const metaObject = await metaResponse.json();
        createPage({
            path: `/${metas[i].campaignId}`,
            component: path.resolve(`./src/templates/plot.tsx`),
            context: { metaObject },
        });
    }
    /*
    result.data.allStrapiPlotMeta.nodes.forEach(plotMeta => {
        const metaObject = fetchMeta(plotMeta.strapiId);

        // if (metaResponse.ok) {
        //     const metaObject = await metaResponse.json();
        // } else {
        //     console.error('HTTP-Error: ' + metaResponse.status);
        //     return;
        // }

        createPage({
            path: `/${plotMeta.campaignId}`,
            component: path.resolve(`./src/templates/plot.tsx`),
            context: { metaObject },
        });
    });*/
};
