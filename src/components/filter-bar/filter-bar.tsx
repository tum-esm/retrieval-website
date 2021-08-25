import React from 'react';
import DateGrid from './date-grid';
import DisplayDay from './display-day';
import DataSelector from './data-selector';

export default function FilterBar(props: {
    isFirstDay(): boolean;
    isLastDay(): boolean;
    prevDay(): void;
    nextDay(): void;

    displayDay: { year: string; month: string; day: string };
    setDisplayDay(d: { year: string; month: string; day: string }): void;

    dayStrings: string[];
    gases: { name: string; unit: string }[];

    gasIndex: number;
    setGasIndex(i: number): void;
    filterData: boolean;
    setFilterData(b: boolean): void;
}) {
    return (
        <div className={'w-full h-32 px-4 py-2 flex-row-center text-gray-900'}>
            <DisplayDay {...props} />
            <div className='h-full mx-6 border-r border-gray-300' />
            <DateGrid {...props} />
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
            <div className='flex-grow' />
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
            <DataSelector {...props} />
        </div>
    );
}