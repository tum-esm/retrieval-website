import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as plotGridUtils from 'utils/d3-elements/grid-and-labels';
import * as plotGraphUtils from 'utils/d3-elements/circles-and-lines';
import types from 'types';
import constants from 'utils/constants';

const GASES: types.gas[] = ['co2', 'ch4'];
const LOCATIONS = ['ROS', 'HAW'];

const exampleData: types.plotDay = {
    date: '20200404',
    data: {
        timeseries: [
            {
                gas: 'co2',
                location: 'ROS',
                count: 3,
                data: { xs: [8, 9, 10], ys: [410, 411, 410.75] },
            },
            {
                gas: 'ch4',
                location: 'ROS',
                count: 3,
                data: { xs: [8, 9, 10], ys: [1.9, 1.9091, 1.8876] },
            },
        ],
    },
};

function buildTimeseriesData(
    gases: types.gasMeta[],
    stations: types.stationMeta[],
    plotDay: types.plotDay
) {
    let timeseries: types.gasTimeseries[] = [];
    let rawTimeseries: types.gasTimeseries[] = [];
    for (let i = 0; i < gases.length; i++) {
        for (let j = 0; j < stations.length; j++) {
            const gas = gases[i].name;
            const location = stations[j].location;
            let tsAdded = false;

            if (plotDay.data.timeseries !== undefined) {
                const existingTss = plotDay.data?.timeseries
                    .filter(t => t.gas === gas)
                    .filter(t => t.location === location);
                if (existingTss.length !== 0) {
                    timeseries.push(existingTss[0]);
                    tsAdded = true;
                }
            }
            if (!tsAdded) {
                timeseries.push({
                    gas,
                    location,
                    count: 0,
                    data: { xs: [], ys: [] },
                });
            }
            if (plotDay.data.rawTimeseries !== undefined) {
                const existingTss = plotDay.data?.rawTimeseries
                    .filter(t => t.gas === gas)
                    .filter(t => t.location === location);
                if (existingTss.length !== 0) {
                    rawTimeseries.push(existingTss[0]);
                    continue;
                }
            }
            rawTimeseries.push({
                gas,
                location,
                count: 0,
                data: { xs: [], ys: [] },
            });
        }
    }
    return { timeseries, rawTimeseries };
}

export default function D3Plot(props: {
    plotAxisRange: types.plotDomain;
    selectedGas: types.gas;
    gases: types.gasMeta[];
    stations: types.stationMeta[];
    plotDay: types.plotDay;
}) {
    const d3Container = useRef(null);
    const { plotAxisRange: domains, plotDay } = props;

    const { timeseries: initialTS, rawTimeseries: initialRTS } =
        buildTimeseriesData(props.gases, props.stations, props.plotDay);
    const [timeseries, setTimeseries] = useState(initialTS);
    const [rawTimeseries, setRawTimeseries] = useState(initialRTS);

    useEffect(() => {
        if (d3Container.current) {
            const xScale = d3
                .scaleLinear()
                .domain([domains.time.from, domains.time.to])
                .range([
                    80,
                    constants.PLOT.width - constants.PLOT.paddingRight,
                ]);

            const yScale = d3
                .scaleLinear()
                .domain([
                    domains[props.selectedGas].from,
                    domains[props.selectedGas].to,
                ])
                .range([350, constants.PLOT.paddingTop]);

            const svg = d3.select(d3Container.current);

            plotGridUtils.implementPlotGrid(
                svg,
                domains,
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
