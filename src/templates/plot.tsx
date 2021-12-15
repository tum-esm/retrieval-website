import React from 'react';
import types from '../types';

export default function Page(props: {
    pageContext: {
        campaign: string;
        date: string;
        sensorDays: types.SensorDay[];
    };
}) {
    return <div>{JSON.stringify(props.pageContext)}</div>;
}
