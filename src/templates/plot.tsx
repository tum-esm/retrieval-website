import React, { useState, useEffect } from 'react';
import types from '../types';
import FilterBar from '../components/filter-bar/filter-bar';
import { first } from 'lodash';
import D3DataPlot from '../components/plots/d3-data-plot';
import Cookies from 'js-cookie';
import D3FlagPlot from '../components/plots/d3-flag-plot';
import constants from '../utilities/constants';

export default function Page(props: {
    pageContext: {
        campaign: types.Campaign;
        date: string;
        sensorDays: types.SensorDay[];
        dateCounts: string;
        monthlyDomain: string;
    };
}) {
    const { campaign, date, sensorDays } = props.pageContext;
    const dateCounts = JSON.parse(props.pageContext.dateCounts);
    const monthlyDomain: types.monthlyDomain = JSON.parse(
        props.pageContext.monthlyDomain
    );

    const domains = constants.DOMAINS;
    constants.GASES.forEach(gas => {
        const computedDomain = monthlyDomain[gas][date.slice(0, 7)];
        if (computedDomain !== undefined) {
            domains[gas].from = computedDomain.avg - 4.5 * computedDomain.std;
            domains[gas].to = computedDomain.avg + 4.5 * computedDomain.std;
            domains[gas].step = computedDomain.std;
        }
    });

    const [selectedGas, setSelectedGas] = useState(campaign.gases[0]);
    const [selectedSpectrometers, setSelectedSpectrometers] = useState(
        campaign.spectrometers
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

    function updateSelection() {
        const cookieSpectrometers = Cookies.get(
            `${campaign.identifier}-spectrometers`
        ).split(',');
        if (
            cookieSpectrometers !== undefined &&
            cookieSpectrometers.every(s => campaign.spectrometers.includes(s))
        ) {
            setSelectedSpectrometers(cookieSpectrometers);
        } else {
            setSelectedSpectrometers(campaign.spectrometers);
        }

        const cookieGas: any = Cookies.get(`${campaign.identifier}-gas`);
        if (campaign.gases.includes(cookieGas)) {
            setSelectedGas(cookieGas);
        } else {
            setSelectedGas(campaign.gases[0]);
        }
    }

    useEffect(() => {
        updateSelection();
    }, [campaign.identifier, date]);

    return (
        <>
            <div className='hidden w-full h-auto lg:block'>
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
                                spectrometers.join(',')
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
                        domains={domains}
                    />
                    <D3FlagPlot
                        spectrometers={campaign.spectrometers}
                        sensorDays={sensorDays.filter(
                            d => d.gas === campaign.gases[0]
                        )}
                        selectedSpectrometers={selectedSpectrometers}
                    />
                </main>
            </div>
            <div className='block w-full h-auto lg:hidden'>
                <main className='w-screen min-h-screen px-4 py-16 bg-gray-100 flex-col-center'>
                    <h1
                        className={`mb-4 text-green-900 font-semibold text-xl text-center rounded max-w-md leading-normal`}
                    >
                        Please view this page on a larger screen or possibly
                        zoom out:{' '}
                        <span className='px-1.5 py-0.5 mx-1 font-mono text-lg bg-white rounded shadow'>
                            ctrl/cmd
                        </span>{' '}
                        and{' '}
                        <span className='px-1.5 py-0.5 mx-1 font-mono text-lg bg-white rounded shadow'>
                            -
                        </span>
                    </h1>
                </main>
            </div>
        </>
    );
}
