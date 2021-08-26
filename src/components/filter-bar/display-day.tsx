import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { MONTH_LABEL } from 'utils/constants';

export default function DisplayDay(props: {
    isFirstDay(): boolean;
    isLastDay(): boolean;
    prevDay(): void;
    nextDay(): void;

    displayDay: { year: string; month: string; day: string };
}) {
    const { displayDay, isFirstDay, isLastDay, prevDay, nextDay } = props;
    return (
        <div className='flex-col-center'>
            <div className='p-1 mb-2 bg-green-100 rounded flex-col-center'>
                <div className='h-4 px-2 mt-1 text-xs text-green-700 flex-row-center'>
                    displayed day
                </div>
                <div className='w-40 px-2 text-xl font-semibold text-green-900 h-7 flex-row-center'>
                    {MONTH_LABEL[displayDay.month]} {parseInt(displayDay.day)}{' '}
                    {displayDay.year}
                </div>
            </div>
            <span className='relative z-0 inline-flex rounded-md shadow-sm'>
                <button
                    type='button'
                    disabled={isFirstDay()}
                    onClick={prevDay}
                    className={
                        'relative inline-flex items-center px-2 py-2 text-sm font-medium ' +
                        'text-gray-500 border border-gray-300 rounded-l-md ' +
                        'focus:z-10 focus:outline-none focus:ring-1 ' +
                        'focus:ring-indigo-500 focus:border-indigo-500 ' +
                        (isFirstDay()
                            ? 'bg-gray-100 cursor-not-allowed '
                            : 'bg-white hover:bg-gray-50 ')
                    }
                    title={
                        isFirstDay() ? 'no measurements before this day' : ''
                    }
                >
                    <span className='sr-only'>Previous</span>
                    <ChevronLeftIcon className='w-5 h-5' aria-hidden='true' />
                </button>
                <div className='relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 whitespace-nowrap'>
                    <span className='h-5'>± 1 Day</span>
                </div>
                <button
                    type='button'
                    disabled={isLastDay()}
                    onClick={nextDay}
                    className={
                        'relative inline-flex items-center px-2 py-2 text-sm font-medium ' +
                        'text-gray-500 border border-gray-300 rounded-r-md ' +
                        'focus:z-10 focus:outline-none focus:ring-1 ' +
                        'focus:ring-indigo-500 focus:border-indigo-500 ' +
                        (isLastDay()
                            ? 'bg-gray-100 cursor-not-allowed '
                            : 'bg-white hover:bg-gray-50 ')
                    }
                    title={isLastDay() ? 'no measurements after this day' : ''}
                >
                    <span className='sr-only'>Next</span>
                    <ChevronRightIcon className='w-5 h-5' aria-hidden='true' />
                </button>
            </span>
        </div>
    );
}
