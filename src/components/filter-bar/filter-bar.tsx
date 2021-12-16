import React from 'react';
import DateGrid from './date-grid';
import types from '../../types';

export default function FilterBar(props: {
    date: string;
    campaign: types.Campaign;
    dateCounts: { [key: string]: number };
    spectrometers: string[];
    selectedSpectrometers: string[];
    setSelectedSpectrometers(ss: string[]): void;
    selectedGas: string;
    setSelectedGas(g: string): void;
}) {
    return (
        <div className={'w-full h-32 px-4 py-2 flex-row-center text-gray-900'}>
            <DateGrid {...props} />
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
            <div className='flex-grow' />
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
        </div>
    );
}
