import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as plotGridUtils from 'utils/d3-elements/grid-and-labels';
import * as plotGraphUtils from 'utils/d3-elements/circles-and-lines';
import types from 'types';
import constants from 'utils/constants';
import buildTimeseriesData from 'utils/build-timeseries-data';
import { dayObject } from '../../types';

export default function D3Plot(props: {
    domains: types.plotDomain;
    selectedGas: types.gas;
    gases: types.gasMeta[];
    stations: types.stationMeta[];
    plotDay: types.plotDay;
    setIsLoading(l: boolean): void;
}) {
    const d3Container = useRef(null);

    const { timeseries: initialTS, rawTimeseries: initialRTS } =
        buildTimeseriesData(props.gases, props.stations, props.plotDay);

    const [timeseries, setTimeseries] = useState(initialTS);
    const [rawTimeseries, setRawTimeseries] = useState(initialRTS);

    useEffect(() => {
        const { timeseries: newTS, rawTimeseries: newRTS } =
            buildTimeseriesData(props.gases, props.stations, props.plotDay);
        setTimeseries(newTS);
        setRawTimeseries(initialRTS);
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

            const implementCircles = plotGraphUtils.implementCircles(
                svg,
                xScale,
                yScale
            );
            const implementLines = plotGraphUtils.implementLines(
                svg,
                xScale,
                yScale
            );

            // TODO: pass selected gas and selected filter/raw
            // TODO: pass raw vs. filtered (circle size)
            // TODO: pass visible locations
            for (let i = 0; i < timeseries.length; i++) {
                const ts = timeseries[i];
                const dataPoints = plotGraphUtils.generateTimeseries(
                    ts.data.xs,
                    ts.data.ys
                );
                implementCircles(ts.gas, ts.location, dataPoints);
                implementLines(ts.gas, ts.location, dataPoints);
            }
            for (let i = 0; i < rawTimeseries.length; i++) {
                const ts = rawTimeseries[i];
                const dataPoints = plotGraphUtils.generateTimeseries(
                    ts.data.xs,
                    ts.data.ys
                );
                implementCircles(ts.gas, ts.location, dataPoints);
                implementLines(ts.gas, ts.location, dataPoints);
            }
            props.setIsLoading(false);
        }
    }, [props.selectedGas, d3Container.current, timeseries, rawTimeseries]);

    return (
        <div
            className={
                'relative w-full p-2 flex-row-center text-gray-900 bg-white shadow rounded'
            }
        >
            <svg
                className='relative w-full no-selection'
                ref={d3Container}
                viewBox={`0 0 ${constants.PLOT.width} ${constants.PLOT.height}`}
            />
        </div>
    );
}
