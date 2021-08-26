import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import * as plotGridUtils from 'utils/d3-elements/grid-and-labels';
import * as plotGraphUtils from 'utils/d3-elements/circles-and-lines';
import types from 'types';
import constants from 'utils/constants';

const GASES: types.gas[] = ['co2', 'ch4'];
const LOCATIONS = ['ROS', 'HAW'];

const exampleData: types.plotDayData = {
    hours: [8, 9, 10],
    timeseries: [
        {
            gas: 'co2',
            location: 'ROS',
            data: [410, 411, 410.75],
        },
        {
            gas: 'ch4',
            location: 'ROS',
            data: [1.9, 1.9091, 1.8876],
        },
    ],
};

export default function D3Plot(props: {
    plotAxisRange: types.plotDomain;
    gas: types.gas;
}) {
    const d3Container = useRef(null);
    const { plotAxisRange: domains } = props;
    const plotData: types.plotDayData = exampleData;

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
                .domain([domains[props.gas].from, domains[props.gas].to])
                .range([350, constants.PLOT.paddingTop]);

            const svg = d3.select(d3Container.current);

            plotGridUtils.implementPlotGrid(
                svg,
                domains,
                xScale,
                yScale,
                props.gas
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

            for (let i = 0; i < plotData.timeseries.length; i++) {
                const ts = plotData.timeseries[i];
                if (ts.gas === props.gas) {
                    const dataPoints = plotGraphUtils.generateTimeseries(
                        plotData.hours,
                        ts.data
                    );
                    implementCircles(ts.gas, ts.location, dataPoints);
                    implementLines(ts.gas, ts.location, dataPoints);
                }
            }

            const locationsWithTimeseries = plotData.timeseries
                .filter(t => t.gas === props.gas)
                .map(d => d.location);

            for (let i = 0; i < GASES.length; i++) {
                for (let j = 0; j < LOCATIONS.length; j++) {
                    const gas = GASES[i];
                    const location = LOCATIONS[j];
                    if (
                        gas !== props.gas ||
                        !locationsWithTimeseries.includes(location)
                    ) {
                        implementCircles(gas, location, []);
                        implementLines(gas, location, []);
                    }
                }
            }
        }
    }, [props.gas, d3Container.current]);

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
