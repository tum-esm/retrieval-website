const path = require(`path`);

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
    const result = await graphql(`
        query {
            allStrapiPlotMeta {
                nodes {
                    campaignId
                }
            }
        }
    `);

    result.data.allStrapiPlotMeta.nodes.forEach(plotMeta => {
        createPage({
            path: `/${plotMeta.campaignId}`,
            component: path.resolve(`./src/templates/plot.tsx`),
            context: { campaignId: plotMeta.campaignId },
        });
    });
};
