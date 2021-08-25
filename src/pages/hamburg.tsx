import React, { useEffect, useState } from 'react';
import getDayObjectFromString from '../utils/get-day-object-from-string';
import FilterBar from '../components/filter-bar';

const dayStrings = ['20210801', '20200801', '20210803', '20210701'];
const displayDayString = '20210801';
const gases = [
    { name: 'co2', unit: 'ppm' },
    { name: 'ch4', unit: 'ppb' },
];

const Page = () => {
    const [displayDay, setDisplayDay] =
        useState<{ year: string; month: string; day: string }>(undefined);

    const sortedDayStrings = dayStrings.sort();
    const [dayIndex, setDayIndex] = useState(
        sortedDayStrings.indexOf(displayDayString)
    );

    const isFirstDay = () => dayIndex === 0;
    const isLastDay = () => dayIndex === sortedDayStrings.length - 1;

    function prevDay() {
        if (!isFirstDay()) {
            setDayIndex(dayIndex - 1);
        }
    }

    function nextDay() {
        if (!isLastDay()) {
            setDayIndex(dayIndex + 1);
        }
    }

    useEffect(() => {
        setDisplayDay(getDayObjectFromString(sortedDayStrings[dayIndex]));
    }, [dayIndex]);

    return (
        <main className={'bg-gray-100 w-screen min-h-screen'}>
            {displayDay !== undefined && (
                <FilterBar
                    isFirstDay={isFirstDay}
                    isLastDay={isLastDay}
                    prevDay={prevDay}
                    nextDay={nextDay}
                    displayDay={displayDay}
                    dayStrings={sortedDayStrings}
                    setDisplayDay={d => {
                        setDayIndex(
                            sortedDayStrings.indexOf(
                                `${d.year}${d.month}${d.day}`
                            )
                        );
                    }}
                />
            )}
        </main>
    );
};

export default Page;
