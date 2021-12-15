import axios from 'axios';
import { join } from 'lodash';
import types from '../types';

const API_URL = 'https://retrieval-cms.dostuffthatmatters.dev/api';

async function getCampaigns(options?: {
    listed: true;
}): Promise<types.Campaign[]> {
    const campaignRequest = await axios.get(
        `${API_URL}/campaign-plots?` +
            `filters[public][$eq]=true` +
            (options !== undefined
                ? `&filters[listed][$eq]=${options.listed}`
                : '')
    );
    return campaignRequest.data.data.map((a: { attributes: any }) => ({
        ...a.attributes,
        locations: a.attributes['locations'].split(' '),
        gases: a.attributes['gases'].split(' '),
    }));
}

async function getCampaignDates(
    campaign: types.Campaign
): Promise<{ [key: string]: number }> {
    const dateRequest: any = await axios.get(
        `${API_URL}/sensor-days?` +
            `filters[date][$ge]=${campaign.startDate}&` +
            `filters[date][$le]=${campaign.endDate}&` +
            `fields=date,rawCount&` +
            `pagination[pageSize]=10000&` +
            join(
                campaign.locations.map(
                    (l, i) => `filters[location][$in][${i}]=${l}`
                ),
                '&'
            )
    );
    const sensorDays: { attributes: types.SensorDay }[] = dateRequest.data.data;
    const dates = sensorDays.reduce((total: { [key: string]: number }, d) => {
        const { date, rawCount } = d.attributes;
        if (!Object.keys(total).includes(date)) {
            return Object.assign(total, { [date]: rawCount });
        } else {
            return Object.assign(total, { [date]: rawCount + total[date] });
        }
    }, {});
    return dates;
}

const backend = {
    getCampaigns,
    getCampaignDates,
};

export default backend;
