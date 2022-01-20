import React from 'react';
import DateGrid from './date-grid';
import types from '../../types';
import DataSelector from './data-selector';
import { Link } from 'gatsby';
import { ChevronLeftIcon } from '@heroicons/react/solid';

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
                'w-full h-[11.5rem] pl-2 pr-6 py-2 flex-row-left text-gray-900 border-b border-gray-400 bg-gray-100 '
            }
        >
            <Link to='/'>
                <div
                    className={
                        'text-blue-600 underline text-sm flex-row-center font-weight-600 pr-2'
                    }
                >
                    <ChevronLeftIcon className='w-5 h-5 mr-0.5' />
                    <span> Back to Campaigns</span>
                </div>
            </Link>
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
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
