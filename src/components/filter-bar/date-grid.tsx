import { range } from 'lodash';
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import constants from '../../utilities/constants';
import types from '../../types';
import { Link } from 'gatsby';

function getDaysInMonth(p: { month: number; year: number }) {
    return new Date(p.year, p.month, 0).getDate();
}

function getFirstWeekday(p: { month: number; year: number }) {
    return new Date(p.year, p.month - 1, 0).getDay();
}

export default function DateGrid(props: {
    date: string;
    campaign: types.Campaign;
    dateCounts: { [key: string]: number };
}) {
    const { date, campaign, dateCounts } = props;
    const [year, month, day] = date.split('-').map(s => parseInt(s));

    const [calendarPage, setCalendarPage] = useState({ month, year });

    const daysInMonth = getDaysInMonth(calendarPage);
    const skipColStyles = {
        gridColumnStart: getFirstWeekday(calendarPage) + 1,
    };

    const changeMonth = (p: { forward: boolean }) => () => {
        if (calendarPage.month === (p.forward ? 12 : 1)) {
            // moving between years
            setCalendarPage({
                year: calendarPage.year + (p.forward ? +1 : -1),
                month: p.forward ? 1 : 12,
            });
        } else {
            // moving within a year
            setCalendarPage({
                year: calendarPage.year,
                month: calendarPage.month + (p.forward ? +1 : -1),
            });
        }
    };

    function getTileDayString(tileDay: number) {
        return `${calendarPage.year}-${calendarPage.month
            .toString()
            .padStart(2, '0')}-${tileDay.toString().padStart(2, '0')}`;
    }

    function getDayTileClasses(tileDay: number) {
        let tileClasses: string = '';
        if (
            tileDay === day &&
            calendarPage.month === month &&
            calendarPage.year === year
        ) {
            tileClasses += 'ring-[2px] ring-blue-700 ';
        }

        const tileDayCount = dateCounts[getTileDayString(tileDay)];

        if (tileDayCount === undefined) {
            tileClasses += 'bg-gray-100 text-gray-300 cursor-not-allowed';
        } else if (tileDayCount < 1000) {
            tileClasses += 'bg-green-100 text-green-600';
        } else if (tileDayCount < 7500) {
            tileClasses += 'bg-green-200 text-green-700';
        } else if (tileDayCount < 15000) {
            tileClasses += 'bg-green-300 text-green-800';
        } else {
            tileClasses += 'bg-green-400 text-green-900';
        }

        return tileClasses;
    }

    return (
        <div className='flex-row-top h-[8.5rem]'>
            <div
                className={
                    'grid grid-flow-row grid-cols-7 gap-1 font-weight-600 ' +
                    'text-xs text-center font-semibold flex-shrink-0'
                }
            >
                {['m', 't', 'w', 't', 'f', 's', 's'].map((d, i) => (
                    <div
                        key={`${d}${i}`}
                        className={
                            'w-8 h-4 rounded-sm text-gray-400 font-weight-500'
                        }
                    >
                        {d.toUpperCase()}
                    </div>
                ))}
                {range(1, daysInMonth + 1).map(tileDay => {
                    const tileDayString = getTileDayString(tileDay);
                    const tileDayCount = dateCounts[tileDayString];
                    if (tileDayCount !== undefined) {
                        return (
                            <Link
                                to={`/${campaign.identifier}/${tileDayString}`}
                                key={tileDayString}
                                style={tileDay === 1 ? skipColStyles : {}}
                                className={
                                    'w-8 h-4 rounded-sm ' +
                                    getDayTileClasses(tileDay)
                                }
                            >
                                {tileDay}
                            </Link>
                        );
                    } else {
                        return (
                            <div
                                key={tileDayString}
                                style={tileDay === 1 ? skipColStyles : {}}
                                className={
                                    'w-8 h-4 rounded-sm ' +
                                    getDayTileClasses(tileDay)
                                }
                            >
                                {tileDay}
                            </div>
                        );
                    }
                })}
            </div>
            <div className='flex-shrink-0 ml-2 flex-col-center'>
                <div className='p-1 mb-2 flex-col-center'>
                    <div className='h-4 px-2 mt-1 text-xs text-gray-500 flex-row-center'>
                        available days
                    </div>
                    <div className='px-2 text-xl font-semibold text-gray-700 w-28 h-7 flex-row-center'>
                        {constants.MONTH_LABEL[calendarPage.month - 1]}{' '}
                        {calendarPage.year}
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
        </div>
    );
}
