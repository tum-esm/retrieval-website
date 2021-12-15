import React from 'react';
import types from '../types';
import backend from '../utilities/backend';

export default function Page(props: {
    pageContext: {
        campaign: string;
        date: string;
    };
    serverData: { sensorDay: types.SensorDay[] };
}) {
    return (
        <div>
            {JSON.stringify(props.pageContext)}
            {JSON.stringify(props.serverData)}
        </div>
    );
}

export async function getServerData(context) {
    const [_1, _2, campaignIdentifier, date] = context.url.split('/');
    return {
        props: {
            sensorDay: await backend.getSensorDay(campaignIdentifier, date),
        },
    };
}
