const axios = require('axios');
const { join, uniq } = require('lodash');

const API_URL = 'https://retrieval-cms.dostuffthatmatters.dev/api';

exports.sourceNodes = async ({ actions }) => {
    const { createNode } = actions;
    const campaignRequest = await axios.get(`${API_URL}/campaign-plots`);
    const campaigns = campaignRequest.data.data;
    campaigns.forEach(async campaign => {
        const locations = campaign.attributes.locations.split(' ');
        const dateRequest = await axios.get(
            `${API_URL}/sensor-days?fields=date,rawCount&pagination[pageSize]=10000&` +
                join(
                    locations.map(
                        (l, i) => `filters[location][$in][${i}]=${l}`
                    ),
                    '&'
                )
        );
        const dates = dateRequest.data.data.reduce((total, d) => {
            const { date, rawCount } = d.attributes;
            if (!Object.keys(total).includes(date)) {
                return Object.assign(total, { [date]: rawCount });
            } else {
                return Object.assign(total, { [date]: rawCount + total[date] });
            }
        }, {});
        console.log({ campaign, dates });
    });
};
