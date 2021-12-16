import React, { useState } from 'react';
import types from '../types';
import FilterBar from '../components/filter-bar/filter-bar';
import { first, uniq } from 'lodash';

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
    const [selectedGas, setSelectedGas] = useState(campaign.gases[0]);

    const locations: string[] = campaign.spectrometers.map(s => {
        const representativeDay = first(
            sensorDays.filter(
                d => d.gas === selectedGas && d.spectrometer === s
            )
        );
        if (representativeDay === undefined) {
            return 'no data';
        } else {
            return representativeDay.location;
        }
    });
    const [selectedSpectrometers, setSelectedSpectrometers] = useState(
        campaign.spectrometers
    );

    // TODO: Pass data to plot component
    // TODO: Implement plot
    // TODO: Connect selectors to plot (css classes)
    // TODO: Implement flag plot

    return (
        <div>
            <FilterBar
                date={date}
                campaign={campaign}
                dateCounts={dateCounts}
                spectrometers={campaign.spectrometers}
                locations={locations}
                selectedSpectrometers={selectedSpectrometers}
                setSelectedSpectrometers={setSelectedSpectrometers}
                selectedGas={selectedGas}
                setSelectedGas={setSelectedGas}
            />
        </div>
    );
}
