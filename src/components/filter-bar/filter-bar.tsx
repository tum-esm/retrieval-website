import React from 'react';
import DateGrid from './date-grid';
import types from '../../types';
import DataSelector from './data-selector';

export default function FilterBar(props: {
    date: string;
    campaign: types.Campaign;
    dateCounts: { [key: string]: number };
    spectrometers: string[];
    locations: string[];
    selectedSpectrometers: string[];
    setSelectedSpectrometers(ss: string[]): void;
    selectedGas: string;
    setSelectedGas(g: string): void;
}) {
    return (
        <div
            className={
                'w-full h-44 px-6 py-2 flex-row-left text-gray-900 border-b border-gray-400'
            }
        >
            <DateGrid
                date={props.date}
                campaign={props.campaign}
                dateCounts={props.dateCounts}
            />
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
            <DataSelector
                campaign={props.campaign}
                selectedGas={props.selectedGas}
                setSelectedGas={props.setSelectedGas}
                spectrometers={props.spectrometers}
                locations={props.locations}
                selectedSpectrometers={props.selectedSpectrometers}
                setSelectedSpectrometers={props.setSelectedSpectrometers}
            />
        </div>
    );
}
