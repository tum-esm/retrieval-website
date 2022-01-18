const axios = require('axios');
const { join, last } = require('lodash');
const path = require('path');

const API_URL = 'https://retrieval-cms.dostuffthatmatters.dev/api';

function headers(accessToken) {
    if (accessToken) {
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
    } else {
        return { headers: { 'Content-Type': 'application/json' } };
    }
}

const backend = {
    get: (url, accessToken) => axios.get(API_URL + url, headers(accessToken)),
    post: (url, data) => axios.post(API_URL + url, data, headers()),
};

async function getAccessToken() {
    const authenticationResponse = await backend
        .post('/auth/local', {
            identifier: process.env.STRAPI_USERNAME,
            password: process.env.STRAPI_PASSWORD,
        })
        .catch(e => {
            console.log('USERNAME/PASSWORD FOR STRAPI IS INVALID');
            process.abort();
        });
    return authenticationResponse.data.jwt;
}

async function getCampaigns(accessToken, options) {
    const campaignRequest = await backend.get(
        '/campaign-plots?filters[public][$eq]=true' +
            (options !== undefined
                ? `&filters[listed][$eq]=${options.listed}`
                : ''),
        accessToken
    );
    return campaignRequest.data.data.map(a => ({
        ...a.attributes,
        locations: a.attributes['locations'].split(' '),
        spectrometers: a.attributes['spectrometers'].split(' '),
        gases: a.attributes['gases'].split(' '),
    }));
}

async function getCampaignDates(accessToken, campaign) {
    const dateRequest = await backend.get(
        '/sensor-days?' +
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
            ),
        accessToken
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

async function getSensorDay(accessToken, campaign, date) {
    const request = await backend.get(
        '/sensor-days?' +
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
            ),
        accessToken
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
    const accessToken = await getAccessToken();
    const campaigns = await getCampaigns(accessToken);
    await Promise.all(
        campaigns.map(async campaign => {
            const dateCounts = await getCampaignDates(accessToken, campaign);

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
                        sensorDays: await getSensorDay(
                            accessToken,
                            campaign,
                            date
                        ),
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
                            spectrometers
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
