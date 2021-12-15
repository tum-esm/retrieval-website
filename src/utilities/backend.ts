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
    const campaigns: types.Campaign[] = campaignRequest.data.data.map(
        (a: { attributes: any }) => ({
            ...a.attributes,
            locations: a.attributes['locations'].split(' '),
            gases: a.attributes['gases'].split(' '),
        })
    );
    let campaignsWithDays: types.Campaign[] = await Promise.all(
        campaigns.map(async campaign => {
            const latestDate = await getLatestCampaignDate(campaign);
            let displayDate = undefined;
            if (latestDate !== undefined) {
                displayDate =
                    campaign.displayDate === null
                        ? latestDate
                        : campaign.displayDate;
            }
            return { ...campaign, displayDate };
        })
    );
    return campaignsWithDays;
}

async function getCampaignDates(
    campaign: types.Campaign
): Promise<{ [key: string]: number }> {
    const dateRequest: any = await axios.get(
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

async function getLatestCampaignDate(
    campaign: types.Campaign
): Promise<string | undefined> {
    const dateRequest: any = await axios.get(
        `${API_URL}/sensor-days?` +
            `filters[date][$gte]=${campaign.startDate}&` +
            `filters[date][$lte]=${campaign.endDate}&` +
            join(
                campaign.locations.map(
                    (l, i) => `filters[location][$in][${i}]=${l}`
                ),
                '&'
            ) +
            `&fields=date&` +
            `sort=date:desc&` +
            `pagination[pageSize]=1`
    );
    const records = dateRequest.data.data;
    if (records.length === 1) {
        return records[0].attributes.date;
    }
}

async function getSensorDay(
    campaignIdentifier: string,
    date: string
): Promise<types.SensorDay[]> {
    const campaign = (await getCampaigns()).filter(
        c => c.identifier === campaignIdentifier
    )[0];

    const request: any = await axios.get(
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
    return request.data.data.map(
        (record: { attributes: types.SensorDay }) => record.attributes
    );
}

const backend = {
    getCampaigns,
    getCampaignDates,
    getSensorDay,
};

export default backend;
