import { range } from 'lodash';
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

function getDaysInMonth(monthObject: { year: string; month: string }) {
    return new Date(
        parseInt(monthObject.year),
        parseInt(monthObject.month) + 1,
        0
    ).getDate();
}

function getFirstWeekday(monthObject: { year: string; month: string }) {
    return new Date(
        parseInt(monthObject.year),
        parseInt(monthObject.month) - 1,
        0
    ).getDay();
}

export default function DateGrid(props: {
    displayDay: string;
    setDisplayDay?: string;
    activeDays?: string[];
}) {
    const [monthObject, setMonthObject] = useState({
        year: props.displayDay.substring(0, 4),
        month: props.displayDay.substring(4, 6),
    });

    const daysInMonth = getDaysInMonth(monthObject);
    const skipColStyles = {
        gridColumnStart: getFirstWeekday(monthObject) + 1,
    };

    const changeMonth = (p: { forward: boolean }) => () => {
        if (monthObject.month === (p.forward ? '12' : '01')) {
            setMonthObject({
                year: (parseInt(monthObject.year) + (p.forward ? +1 : -1))
                    .toString()
                    .padStart(2, '0'),
                month: p.forward ? '01' : '12',
            });
        } else {
            setMonthObject({
                year: monthObject.year,
                month: (parseInt(monthObject.month) + (p.forward ? +1 : -1))
                    .toString()
                    .padStart(2, '0'),
            });
        }
    };

    return (
        <>
            <div
                className={
                    'grid grid-flow-row grid-cols-7 gap-1 ' +
                    'text-xs text-center font-semibold text-gray-500'
                }
            >
                {range(daysInMonth).map(i => (
                    <div
                        style={i === 0 ? skipColStyles : {}}
                        className='w-6 h-4 bg-gray-100 rounded-sm'
                    >
                        {i + 1}
                    </div>
                ))}
            </div>
            <div className='ml-4 flex-col-center'>
                <div className='p-1 mb-2 flex-col-center'>
                    <div className='h-4 px-2 mt-1 text-xs text-gray-500 flex-row-center'>
                        available days
                    </div>
                    <div className='px-2 text-xl font-semibold text-gray-700 h-7 flex-row-center'>
                        Aug {monthObject.year.substring(2)}
                    </div>
                </div>
                <span className='relative z-0 inline-flex rounded-md shadow-sm'>
                    <button
                        type='button'
                        className='relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
                        onClick={changeMonth({ forward: false })}
                    >
                        <span className='sr-only'>Previous</span>
                        <ChevronLeftIcon
                            className='w-5 h-5'
                            aria-hidden='true'
                        />
                    </button>
                    <button
                        type='button'
                        className='relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
                        onClick={changeMonth({ forward: true })}
                    >
                        <span className='sr-only'>Next</span>
                        <ChevronRightIcon
                            className='w-5 h-5'
                            aria-hidden='true'
                        />
                    </button>
                </span>
            </div>
        </>
    );
}
