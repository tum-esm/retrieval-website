import React, { useState } from 'react';
import types from '../types';
import FilterBar from '../components/filter-bar/filter-bar';
import { first } from 'lodash';
import D3DataPlot from '../components/plots/d3-data-plot';

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
        <>
            <header className='w-full'>
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
            </header>
            <main className='w-full px-4 py-4'>
                <D3DataPlot
                    gases={campaign.gases}
                    locations={locations}
                    spectrometers={campaign.spectrometers}
                    sensorDays={sensorDays}
                    selectedGas={selectedGas}
                    selectedSpectrometers={selectedSpectrometers}
                />
            </main>
        </>
    );
}
