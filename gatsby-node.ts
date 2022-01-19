const axios = require('axios');
const { join, last, concat, mean, round, uniq } = require('lodash');
const path = require('path');
const math = require('mathjs');

const API_URL = 'https://retrieval-cms.dostuffthatmatters.dev/api';

namespace types {
    export type campaign = {
        identifier: string;
        startDate: string;
        endDate: string;
        displayDate: string;
        locations: string[];
        gases: string[];
    };
    export type accessToken = string;
}

function headers(accessToken?: types.accessToken) {
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
    get: (url: string, accessToken: types.accessToken) =>
        axios.get(API_URL + url, headers(accessToken)),
    post: (url: string, data: any) =>
        axios.post(API_URL + url, data, headers()),
};

async function getAccessToken() {
    const authenticationResponse = await backend
        .post('/auth/local', {
            identifier: process.env.STRAPI_USERNAME,
            password: process.env.STRAPI_PASSWORD,
        })
        .catch(() => {
            console.log('USERNAME/PASSWORD FOR STRAPI IS INVALID');
            process.abort();
        });
    return authenticationResponse.data.jwt;
}

async function getCampaigns(
    accessToken: types.accessToken,
    options?: { listed: boolean; public: boolean }
): Promise<types.campaign[]> {
    const campaignRequest = await backend.get(
        '/campaign-plots?filters[public][$eq]=true' +
            (options !== undefined
                ? `&filters[listed][$eq]=${options.listed}`
                : ''),
        accessToken
    );
    return campaignRequest.data.data.map((a: any) => ({
        ...a.attributes,
        locations: a.attributes['locations'].split(' '),
        spectrometers: a.attributes['spectrometers'].split(' '),
        gases: a.attributes['gases'].split(' '),
    }));
}

async function getCampaignDates(
    accessToken: types.accessToken,
    campaign: types.campaign
) {
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
    const dates = sensorDays.reduce(
        (
            total: { [key: string]: number },
            d: { attributes: { date: string; rawCount: number } }
        ) => {
            const { date, rawCount } = d.attributes;
            if (!Object.keys(total).includes(date)) {
                return Object.assign(total, { [date]: rawCount });
            } else {
                return Object.assign(total, { [date]: rawCount + total[date] });
            }
        },
        {}
    );
    return dates;
}

async function getSensorDays(
    accessToken: types.accessToken,
    campaign: types.campaign,
    date: string
) {
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
    return request.data.data.map((record: any) => record.attributes);
}

const CAMPAIGN_NODE_TYPE = 'Campaign';
const PLOT_PAGE_NODE_TYPE = 'PlotPage';

exports.sourceNodes = async ({
    actions,
    createContentDigest,
    createNodeId,
    getNodesByType,
}: any) => {
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
            const campaignNode = { ...campaign, displayDate };

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

            const gases: ('co2' | 'ch4' | 'co')[] = ['co2', 'ch4', 'co'];

            let monthlyTimeseries: {
                [key in 'co2' | 'ch4' | 'co']: { [key: string]: number[] };
            } = {
                co2: {},
                ch4: {},
                co: {},
            };

            await Promise.all(
                Object.keys(dateCounts).map(async date => {
                    const content = {
                        campaign: campaign,
                        date,
                        sensorDays: await getSensorDays(
                            accessToken,
                            campaign,
                            date
                        ),
                    };

                    const month = date.slice(0, 7);
                    gases.forEach(gas => {
                        monthlyTimeseries[gas][month] = concat(
                            monthlyTimeseries[gas][month] === undefined
                                ? []
                                : monthlyTimeseries[gas][month],
                            ...content.sensorDays
                                .filter((d: any) => d.gas === gas)
                                .map((d: any) => d.filteredTimeseries.ys)
                        );
                    });

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

            let monthlyRange: {
                [key in 'co2' | 'ch4' | 'co']: {
                    [key: string]: { std: number; avg: number };
                };
            } = {
                co2: {},
                ch4: {},
                co: {},
            };
            gases.forEach(gas => {
                Object.keys(monthlyTimeseries[gas]).forEach(month => {
                    if (monthlyTimeseries[gas][month].length > 0) {
                        monthlyRange[gas][month] = {
                            std: math.std(monthlyTimeseries[gas][month]),
                            avg: mean(monthlyTimeseries[gas][month]),
                        };
                    }
                });
            });

            console.log(JSON.stringify({ monthlyRange }));

            return;
        })
    );
};

exports.createPages = async ({ graphql, actions, reporter }: any) => {
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
            async ({ campaign, date, sensorDays }: any) => {
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
