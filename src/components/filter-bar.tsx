/* This example requires Tailwind CSS v2.0+ */
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import DateGrid from './date-grid';

export default function FilterBar() {
    return (
        <div
            className={
                'fixed w-screen h-32 px-4 py-2 flex-row-center ' +
                'bg-white text-gray-900 shadow'
            }
        >
            <div className='space-y-1 flex-col-center'>
                <div className='text-xl font-semibold h-9'>Aug 14 2021</div>
                <span className='relative z-0 inline-flex rounded-md shadow-sm'>
                    <button
                        type='button'
                        className='relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
                    >
                        <span className='sr-only'>Previous</span>
                        <ChevronLeftIcon
                            className='w-5 h-5'
                            aria-hidden='true'
                        />
                    </button>
                    <div className='relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-300 whitespace-nowrap'>
                        <span className='h-5'>± 1 Day</span>
                    </div>
                    <button
                        type='button'
                        className='relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
                    >
                        <span className='sr-only'>Next</span>
                        <ChevronRightIcon
                            className='w-5 h-5'
                            aria-hidden='true'
                        />
                    </button>
                </span>
            </div>
            <div className='h-full mx-6 border-r border-gray-300' />
            <DateGrid displayDay='20210701' />
            <div className='flex-grow' />
        </div>
    );
}
