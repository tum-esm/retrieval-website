import React, { useState } from 'react';
import types from '../types';
import FilterBar from '../components/filter-bar/filter-bar';
import { uniq } from 'lodash';

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

    const spectrometers = uniq(sensorDays.map(s => s.spectrometer));
    const [selectedSpectrometers, setSelectedSpectrometers] =
        useState(spectrometers);
    const [selectedGas, setSelectedGas] = useState(campaign.gases[0]);

    return (
        <div
            className={
                'w-full h-40 px-4 py-2 flex-row-center text-gray-900 border-b border-gray-300'
            }
        >
            <FilterBar
                date={date}
                campaign={campaign}
                dateCounts={dateCounts}
                spectrometers={spectrometers}
                selectedSpectrometers={selectedSpectrometers}
                setSelectedSpectrometers={setSelectedSpectrometers}
                selectedGas={selectedGas}
                setSelectedGas={setSelectedGas}
            />
        </div>
    );
}
