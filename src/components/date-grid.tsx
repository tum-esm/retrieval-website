import { range } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { MONTH_LABEL } from '../utils/constants';

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
    displayDay: { year: string; month: string; day: string };
    setDisplayDay(d: { year: string; month: string; day: string }): void;
    dayStrings: string[];
}) {
    const { displayDay, setDisplayDay, dayStrings } = props;

    const [monthObject, setMonthObject] = useState({
        year: displayDay.year,
        month: displayDay.month,
    });

    useEffect(() => {
        setMonthObject({
            year: displayDay.year,
            month: displayDay.month,
        });
    }, [displayDay]);

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
                    'text-xs text-center font-semibold'
                }
            >
                {range(1, daysInMonth + 1).map(day => {
                    const dayString = `${monthObject.year}${
                        monthObject.month
                    }${day.toString().padStart(2, '0')}`;
                    const displayDayString = `${displayDay.year}${displayDay.month}${displayDay.day}`;

                    const dayHasData = dayStrings.includes(dayString);
                    return (
                        <button
                            style={day === 0 ? skipColStyles : {}}
                            className={
                                'w-6 h-4 rounded-sm font-medium ' +
                                (dayHasData
                                    ? 'bg-green-300 text-green-900 '
                                    : 'bg-gray-100 text-gray-400 ') +
                                (dayString === displayDayString
                                    ? 'ring-[2px] ring-indigo-500 '
                                    : ' ')
                            }
                            disabled={!dayHasData}
                            onClick={() => {
                                if (dayHasData) {
                                    props.setDisplayDay({
                                        ...monthObject,
                                        day: day.toString().padStart(2, '0'),
                                    });
                                }
                            }}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
            <div className='ml-2 flex-col-center'>
                <div className='p-1 mb-2 flex-col-center'>
                    <div className='h-4 px-2 mt-1 text-xs text-gray-500 flex-row-center'>
                        available days
                    </div>
                    <div className='px-2 text-xl font-semibold text-gray-700 w-28 h-7 flex-row-center'>
                        {MONTH_LABEL[monthObject.month]} {monthObject.year}
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
