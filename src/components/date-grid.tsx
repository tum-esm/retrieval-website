import { range } from 'lodash';
import React, { useState } from 'react';

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
    );
}
