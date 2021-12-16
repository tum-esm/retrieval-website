import React from 'react';
import types from '../types';
import DateGrid from '../components/filter-bar/date-grid';

export default function Page(props: {
    pageContext: {
        campaign: types.Campaign;
        date: string;
        sensorDays: types.SensorDay[];
        dateCounts: string;
    };
}) {
    const { campaign, date, sensorDays } = props.pageContext;
    const dateCounts = JSON.parse(props.pageContext.dateCounts);
    return (
        <div className={'w-full h-40 px-4 py-2 flex-row-center text-gray-900'}>
            <DateGrid date={date} campaign={campaign} dateCounts={dateCounts} />
        </div>
    );
}
