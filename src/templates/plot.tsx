import React, { useState, useEffect } from 'react';
import types from 'types';
import getDayObjectFromString from 'utils/get-day-object-from-string';
import FilterBar from 'components/filter-bar/filter-bar';
import D3Plot from 'components/d3-plot/d3-plot';
import FlagPlot from 'src/components/d3-plot/flag-plot';

const domains = {
    time: {
        from: 5.5,
        to: 17.5,
        step: 1,
    },
    co2: {
        from: 405, //407,
        to: 414, //417,
        step: 1,
    },
    ch4: {
        from: 1.875,
        to: 1.915,
        step: 0.005,
    },
};

export default function Plot(props: {
    pageContext: {
        metaObject: types.plotMeta;
        displayDayObject: types.plotDay;
        apiURL: string;
    };
}) {
    const plotMeta: types.plotMeta = props.pageContext.metaObject;
    const sortedDayStrings = plotMeta.data.days.sort();

    const [displayDay, setDisplayDay] = useState<{
        dayObject: types.dayObject;
        plotDay: types.plotDay;
    }>({
        dayObject: getDayObjectFromString(
            props.pageContext.displayDayObject.date
        ),
        plotDay: props.pageContext.displayDayObject,
    });

    const [dayIndex, setDayIndex] = useState(
        sortedDayStrings.indexOf(props.pageContext.displayDayObject.date)
    );
    const [gasIndex, setGasIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleStations, setVisibleStations] = useState(
        plotMeta.data.stations.map(() => true)
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

    const [prefetchSuccessful, setPrefetchSuccessful] = useState(false);

    // prefetch cms (fire up backend server on page load)
    useEffect(() => {
        async function prefetchCMS() {
            const { metaObject, apiURL } = props.pageContext;
            const response = await fetch(
                `${apiURL}/plot-metas/${metaObject.id}`
            );
            if (response.status === 200) {
                console.log('backend prefetched successfully');
                setPrefetchSuccessful(true);
            } else {
                console.error('backend could not be prefetched', response);
            }
        }
        prefetchCMS();
    }, []);

    useEffect(() => {
        async function fetchDay(daystring: string) {
            // TODO: error handling (show message if data could not be fetched)

            setIsLoading(true);
            const plotDayResponse = await fetch(
                `${props.pageContext.apiURL}/plot-days?date=${daystring}`
            );
            setDisplayDay({
                dayObject: getDayObjectFromString(daystring),
                plotDay: (await plotDayResponse.json())[0],
            });
            // isLoading will be set to false from within the D3 plot
        }

        const newDayString = sortedDayStrings[dayIndex];
        if (displayDay.plotDay.date !== newDayString && prefetchSuccessful) {
            fetchDay(newDayString);
        }
    }, [dayIndex, prefetchSuccessful]);

    return (
        <>
            <header className='fixed top-0 left-0 z-10 w-screen bg-white shadow pointer-events-auto'>
                <FilterBar
                    {...{ isFirstDay, isLastDay, prevDay, nextDay }}
                    {...{
                        dayStrings: sortedDayStrings,
                        gases: plotMeta.data.gases,
                        calibrationDays: plotMeta.data.calibrationDays,
                        dayObject: displayDay.dayObject,
                        stations: plotMeta.data.stations,
                    }}
                    {...{
                        visibleStations,
                        setVisibleStations,
                    }}
                    setDayObject={d => {
                        setDayIndex(
                            sortedDayStrings.indexOf(
                                `${d.year}${d.month}${d.day}`
                            )
                        );
                    }}
                    {...{
                        gasIndex,
                        setGasIndex,
                    }}
                />
            </header>
            <main
                className={
                    'relative block bg-gray-100 w-screen min-h-screen ' +
                    'pt-40 pb-8 px-4 z-0 pointer-events-none no-selection ' +
                    'flex-col-center gap-y-4'
                }
            >
                <D3Plot
                    domains={domains}
                    selectedGas={plotMeta.data.gases[gasIndex].name}
                    gases={plotMeta.data.gases}
                    stations={plotMeta.data.stations}
                    plotDay={displayDay.plotDay}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    visibleStations={visibleStations}
                />
                <FlagPlot
                    domains={domains}
                    selectedGas={plotMeta.data.gases[gasIndex].name}
                    gases={plotMeta.data.gases}
                    stations={plotMeta.data.stations}
                    plotDay={displayDay.plotDay}
                    flags={plotMeta.data.flags}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    visibleStations={visibleStations}
                />
            </main>
        </>
    );
}
