/* This example requires Tailwind CSS v2.0+ */
import React from 'react';
import DateGrid from './date-grid';
import DisplayDay from './display-day';

export default function FilterBar(props: {
    isFirstDay(): boolean;
    isLastDay(): boolean;
    prevDay(): void;
    nextDay(): void;

    displayDay: { year: string; month: string; day: string };
    setDisplayDay(d: { year: string; month: string; day: string }): void;
    dayStrings: string[];
}) {
    return (
        <div
            className={
                'fixed w-screen h-32 px-4 py-2 flex-row-center ' +
                'bg-white text-gray-900 shadow'
            }
        >
            <DisplayDay {...props} />
            <div className='h-full mx-6 border-r border-gray-300' />
            <DateGrid {...props} />
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
            <div className='flex-grow' />
            <div className='h-full ml-2 mr-6 border-r border-gray-300' />
        </div>
    );
}
