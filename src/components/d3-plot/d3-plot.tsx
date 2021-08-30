import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as plotGridUtils from 'utils/d3-elements/grid-and-labels';
import * as plotGraphUtils from 'utils/d3-elements/circles-and-lines';
import types from 'types';
import constants from 'utils/constants';
import buildTimeseriesData from 'utils/build-timeseries-data';

export default function D3Plot(props: {
    domains: types.plotDomain;
    selectedGas: types.gas;
    gases: types.gasMeta[];
    stations: types.stationMeta[];
    plotDay: types.plotDay;
    isLoading: boolean;
    setIsLoading(l: boolean): void;
    filterData: boolean;
}) {
    const d3Container = useRef(null);

    const { timeseries: initialTS, rawTimeseries: initialRTS } =
        buildTimeseriesData(
            props.gases,
            props.stations,
            props.plotDay,
            props.domains
        );

    const [timeseries, setTimeseries] = useState(initialTS);
    const [rawTimeseries, setRawTimeseries] = useState(initialRTS);

    useEffect(() => {
        const { timeseries: newTS, rawTimeseries: newRTS } =
            buildTimeseriesData(
                props.gases,
                props.stations,
                props.plotDay,
                props.domains
            );
        setTimeseries(newTS);
        setRawTimeseries(newRTS);
    }, [props.plotDay]);

    useEffect(() => {
        if (d3Container.current) {
            const xScale = d3
                .scaleLinear()
                .domain([props.domains.time.from, props.domains.time.to])
                .range([
                    80,
                    constants.PLOT.width - constants.PLOT.paddingRight,
                ]);

            const yScale = d3
                .scaleLinear()
                .domain([
                    props.domains[props.selectedGas].from,
                    props.domains[props.selectedGas].to,
                ])
                .range([350, constants.PLOT.paddingTop]);

            const svg = d3.select(d3Container.current);

            plotGridUtils.implementPlotGrid(
                svg,
                props.domains,
                xScale,
                yScale,
                props.selectedGas
            );

            const implementCirclesAndLines =
                plotGraphUtils.implementCirclesAndLines(
                    svg,
                    xScale,
                    yScale,
                    props.domains
                );

            // TODO: pass selected gas and selected filter/raw
            // TODO: pass raw vs. filtered (circle size)
            // TODO: pass visible locations
            for (let i = 0; i < timeseries.length; i++) {
                implementCirclesAndLines(
                    timeseries[i],
                    false,
                    props.filterData
                );
                implementCirclesAndLines(
                    rawTimeseries[i],
                    true,
                    props.filterData
                );
            }
            props.setIsLoading(false);
        }
    }, [
        props.selectedGas,
        props.filterData,
        d3Container.current,
        timeseries,
        rawTimeseries,
    ]);

    return (
        <div
            className={
                'relative w-full p-2 flex-row-center text-gray-900 bg-white shadow rounded'
            }
        >
            <div className='absolute top-0 left-0 z-10 w-full h-full flex-row-center'>
                <div
                    className={
                        'px-2.5 py-1 text-sm font-semibold bg-blue-900 rounded text-blue-50 ' +
                        (props.isLoading ? 'opacity-100 ' : 'opacity-0 ')
                    }
                >
                    loading data ...
                </div>
            </div>
            <svg
                className='relative z-0 w-full no-selection'
                ref={d3Container}
                viewBox={`0 0 ${constants.PLOT.width} ${constants.PLOT.height}`}
            />
        </div>
    );
}
