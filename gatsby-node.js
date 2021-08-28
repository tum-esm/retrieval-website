const path = require(`path`);
const fetch = require('node-fetch');
const lodash = require('lodash');

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

        const displayDay =
            metaObject.data.displayDay !== null
                ? metaObject.data.displayDay
                : lodash.last(lodash.sortBy(metaObject.data.days));

        const displayDayResponse = await fetch(
            `${API_URL}/plot-days?date=${displayDay}`
        );
        const displayDayObject = (await displayDayResponse.json())[0];

        createPage({
            path: `/${metas[i].campaignId}`,
            component: path.resolve(`./src/templates/plot.tsx`),
            context: { metaObject, displayDayObject },
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
