const axios = require('axios');
const { join, last } = require('lodash');
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
            ) +
            '&' +
            join(
                campaign.gases.map((g, i) => `filters[gas][$in][${i}]=${g}`),
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

async function getSensorDay(campaign, date) {
    const request = await axios.get(
        `${API_URL}/sensor-days?` +
            `filters[date][$eq]=${date}&` +
            `pagination[pageSize]=10000&` +
            join(
                campaign.locations.map(
                    (l, i) => `filters[location][$in][${i}]=${l}`
                ),
                '&'
            ) +
            '&' +
            join(
                campaign.gases.map((g, i) => `filters[gas][$in][${i}]=${g}`),
                '&'
            )
    );
    return request.data.data.map(record => record.attributes);
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
            const dateCounts = await getCampaignDates(campaign);

            const latestDate = last(Object.keys(dateCounts).sort());
            let displayDate = undefined;
            if (latestDate !== undefined) {
                displayDate =
                    campaign.displayDate === null
                        ? latestDate
                        : campaign.displayDate;
            }
            campaignNode = { ...campaign, displayDate };

            if (Object.keys(dateCounts).length > 0) {
                createNode({
                    ...campaignNode,
                    dateCounts: JSON.stringify(dateCounts),
                    id: createNodeId(
                        `${CAMPAIGN_NODE_TYPE}-${campaign.identifier}`
                    ),
                    parent: null,
                    children: [],
                    internal: {
                        type: CAMPAIGN_NODE_TYPE,
                        content: JSON.stringify(campaignNode),
                        contentDigest: createContentDigest(campaignNode),
                    },
                });
            }

            await Promise.all(
                Object.keys(dateCounts).map(async date => {
                    const content = {
                        campaign: campaign,
                        date,
                        sensorDays: await getSensorDay(campaign, date),
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

                    return;
                })
            );

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
                        sensorDays {
                            rawTimeseries {
                                xs
                                ys
                            }
                            flagTimeseries {
                                xs
                                ys
                            }
                            filteredTimeseries {
                                xs
                                ys
                            }
                            filteredCount
                            flagCount
                            rawCount
                            location
                            gas
                            date
                            spectrometer
                        }
                        date
                        campaign {
                            gases
                            identifier
                            locations
                        }
                    }
                }
            }
        `
    );
    await Promise.all(
        result.data.allPlotPage.nodes.map(
            async ({ campaign, date, sensorDays }) => {
                const dateCounts = (
                    await graphql(
                        `
                        {
                            campaign(identifier: {eq: "${campaign.identifier}"}) {
                                dateCounts
                            }
                        }
                    `
                    )
                ).data.campaign.dateCounts;
                createPage({
                    path: `/${campaign.identifier}/${date}`,
                    component: path.resolve(`src/templates/plot.tsx`),
                    context: {
                        campaign,
                        date,
                        sensorDays,
                        dateCounts,
                    },
                });

                return;
            }
        )
    );
};
