import React, { useState } from 'react';
import types from '../types';
import FilterBar from '../components/filter-bar/filter-bar';
import { first, uniqBy } from 'lodash';
import D3DataPlot from '../components/plots/d3-data-plot';
import Cookies from 'js-cookie';
import D3FlagPlot from '../components/plots/d3-flag-plot';

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

    const cookieGas = Cookies.get(`${campaign.identifier}-gas`);
    const [selectedGas, setSelectedGas] = useState(
        campaign.gases.includes(cookieGas) ? cookieGas : campaign.gases[0]
    );

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
    const cookieSpectrometers = Cookies.get(
        `${campaign.identifier}-spectrometers`
    );
    const [selectedSpectrometers, setSelectedSpectrometers] = useState(
        cookieSpectrometers !== undefined
            ? cookieSpectrometers
                  .split(',')
                  .every(s => campaign.spectrometers.includes(s))
                ? cookieSpectrometers.split(',')
                : campaign.spectrometers
            : campaign.spectrometers
    );

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
                    setSelectedSpectrometers={spectrometers => {
                        setSelectedSpectrometers(spectrometers);
                        Cookies.set(
                            `${campaign.identifier}-spectrometers`,
                            spectrometers
                        );
                    }}
                    selectedGas={selectedGas}
                    setSelectedGas={gas => {
                        setSelectedGas(gas);
                        Cookies.set(`${campaign.identifier}-gas`, gas);
                    }}
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
                <D3FlagPlot
                    spectrometers={campaign.spectrometers}
                    sensorDays={sensorDays.filter(
                        d => d.gas === campaign.gases[0]
                    )}
                    selectedSpectrometers={selectedSpectrometers}
                />
            </main>
        </>
    );
}
