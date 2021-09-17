import React from 'react';
import DateGrid from './date-grid';
import DisplayDay from './display-day';
import DataSelector from './data-selector';
import types from 'types';
import StationSelector from './station-selector';

export default function FilterBar(props: {
    isFirstDay(): boolean;
    isLastDay(): boolean;
    prevDay(): void;
    nextDay(): void;

    dayObject: types.dayObject;
    setDayObject(d: types.dayObject): void;

    dayStrings: string[];
    gases: { name: types.gas; unit: string }[];
    stations: types.stationMeta[];
    calibrationDays: { [key: string]: string };
    visibleStations: boolean[];
    setVisibleStations(s: boolean[]): void;

    gasIndex: number;
    setGasIndex(i: number): void;
}) {
    return (
        <div className={'w-full h-32 px-4 py-2 flex-row-center text-gray-900'}>
            <DisplayDay {...props} />
            <div className='h-full mx-6 border-r border-gray-300' />
            <DateGrid {...props} />
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
            <div className='flex-grow' />
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
            <StationSelector {...props} />
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
            <DataSelector {...props} />
        </div>
    );
}
