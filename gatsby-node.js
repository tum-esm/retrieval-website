const axios = require('axios');
const { join } = require('lodash');
const path = require('path');

const API_URL = 'https://retrieval-cms.dostuffthatmatters.dev/api';

async function getCampaigns(options) {
    const campaignRequest = await axios.get(
        `${API_URL}/campaign-plots?` +
            `filters[public][$eq]=true` +
            (options !== undefined
                ? `&filters[listed][$eq]=${options.listed}`
                : '')
    );
    return campaignRequest.data.data.map(a => ({
        ...a.attributes,
        locations: a.attributes['locations'].split(' '),
        gases: a.attributes['gases'].split(' '),
    }));
}

async function getCampaignDates(campaign) {
    const dateRequest = await axios.get(
        `${API_URL}/sensor-days?` +
            `filters[date][$gte]=${campaign.startDate}&` +
            `filters[date][$lte]=${campaign.endDate}&` +
            `fields=date,rawCount&` +
            `pagination[pageSize]=10000&` +
            join(
                campaign.locations.map(
                    (l, i) => `filters[location][$in][${i}]=${l}`
                ),
                '&'
            )
    );
    const sensorDays = dateRequest.data.data;
    const dates = sensorDays.reduce((total, d) => {
        const { date, rawCount } = d.attributes;
        if (!Object.keys(total).includes(date)) {
            return Object.assign(total, { [date]: rawCount });
        } else {
            return Object.assign(total, { [date]: rawCount + total[date] });
        }
    }, {});
    return dates;
}

const CAMPAIGN_NODE_TYPE = 'Campaign';
const PLOT_PAGE_NODE_TYPE = 'PlotPage';

exports.sourceNodes = async ({
    actions,
    createContentDigest,
    createNodeId,
    getNodesByType,
}) => {
    const { createNode } = actions;
    const campaigns = await getCampaigns();
    await Promise.all(
        campaigns.map(async campaign => {
            const dates = await getCampaignDates(campaign);

            createNode({
                ...campaign,
                dateCounts: JSON.stringify(dates),
                id: createNodeId(
                    `${CAMPAIGN_NODE_TYPE}-${campaign.identifier}`
                ),
                parent: null,
                children: [],
                internal: {
                    type: CAMPAIGN_NODE_TYPE,
                    content: JSON.stringify(campaign),
                    contentDigest: createContentDigest(campaign),
                },
            });

            Object.keys(dates).forEach(date => {
                const content = {
                    campaignIdentifier: campaign.identifier,
                    date,
                    count: dates[date],
                };
                createNode({
                    ...content,
                    id: createNodeId(
                        `${PLOT_PAGE_NODE_TYPE}-${campaign.identifier}-${date}`
                    ),
                    parent: null,
                    children: [],
                    internal: {
                        type: PLOT_PAGE_NODE_TYPE,
                        content: JSON.stringify(content),
                        contentDigest: createContentDigest(content),
                    },
                });
            });

            return;
        })
    );
};

exports.createPages = async ({ graphql, actions, reporter }) => {
    const { createPage } = actions;
    const result = await graphql(
        `
            {
                allPlotPage {
                    nodes {
                        campaignIdentifier
                        date
                    }
                }
            }
        `
    );
    result.data.allPlotPage.nodes.forEach(({ campaignIdentifier, date }) =>
        createPage({
            path: `/${campaignIdentifier}/${date}`,
            component: path.resolve(`src/templates/plot.tsx`),
            context: {
                campaignIdentifier,
                date,
            },
        })
    );
};
