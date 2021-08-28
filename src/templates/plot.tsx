import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import types from 'types';
import { last } from 'lodash';
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

export default function Plot(props: { pageContext: any }) {
    return <main>{JSON.stringify(props)}</main>;
    /*
    const response = await fetch(url);

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        const json = await response.json();
    } else {
        alert("HTTP-Error: " + response.status);
        return "server error"
    }
    
    const plotMeta: types.plotMeta = props.data.strapiPlotMeta;
    const sortedDayStrings = plotMeta.data.days.sort();

    // TODO: build pretty empty page
    if (sortedDayStrings.length === 0) {
        return <div>Nothing here</div>;
    }

    const displayDayString: any =
        plotMeta.data.displayDay !== null
            ? plotMeta.data.displayDay
            : last(sortedDayStrings);

    const [displayDay, setDisplayDay] = useState<types.dayObject>(
        getDayObjectFromString(displayDayString)
    );

    const [dayIndex, setDayIndex] = useState(
        sortedDayStrings.indexOf(displayDayString)
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
                    gas={plotMeta.data.gases[gasIndex].name}
                />
            </main>
        </>
    );*/
}
