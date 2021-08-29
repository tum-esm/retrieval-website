import React, { useState, useEffect } from 'react';
import types from 'types';
import getDayObjectFromString from 'utils/get-day-object-from-string';
import FilterBar from 'components/filter-bar/filter-bar';
import D3Plot from 'components/d3-plot/d3-plot';

const plotAxisRange = {
    time: {
        from: 7,
        to: 19,
        step: 1,
    },
    co2: {
        from: 407,
        to: 417,
        step: 1,
    },
    ch4: {
        from: 1.86,
        to: 1.92,
        step: 0.005,
    },
};

export default function Plot(props: {
    pageContext: {
        metaObject: types.plotMeta;
        displayDayObject: types.plotDay;
    };
}) {
    //return <main>{JSON.stringify(props.pageContext.displayDayObject)}</main>;

    const plotMeta: types.plotMeta = props.pageContext.metaObject;
    const sortedDayStrings = plotMeta.data.days.sort();

    const [displayDay, setDisplayDay] = useState<types.dayObject>(
        getDayObjectFromString(props.pageContext.displayDayObject.date)
    );

    const [dayIndex, setDayIndex] = useState(
        sortedDayStrings.indexOf(props.pageContext.displayDayObject.date)
    );
    const [gasIndex, setGasIndex] = useState(0);
    const [filterData, setFilterData] = useState(true);

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

    if (displayDay === undefined) {
        return <div />;
    }

    return (
        <>
            <header className='fixed top-0 left-0 w-screen bg-white shadow'>
                <FilterBar
                    {...{ isFirstDay, isLastDay, prevDay, nextDay }}
                    {...{
                        dayStrings: sortedDayStrings,
                        gases: plotMeta.data.gases,
                        displayDay,
                    }}
                    setDisplayDay={d => {
                        setDayIndex(
                            sortedDayStrings.indexOf(
                                `${d.year}${d.month}${d.day}`
                            )
                        );
                    }}
                    {...{
                        gasIndex,
                        setGasIndex,
                        filterData,
                        setFilterData,
                    }}
                />
            </header>
            <main
                className={'bg-gray-100 w-screen min-h-screen pt-40 pb-8 px-4'}
            >
                <D3Plot
                    plotAxisRange={plotAxisRange}
                    selectedGas={plotMeta.data.gases[gasIndex].name}
                    gases={plotMeta.data.gases}
                    stations={plotMeta.data.stations}
                    plotDay={props.pageContext.displayDayObject}
                />
            </main>
        </>
    );
}
