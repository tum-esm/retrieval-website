import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import {
    implementConcentrationDividers,
    implementConcentrationLabels,
    implementTimeDividers,
    implementTimeLabels,
    implementAxisTitles,
} from 'utils/d3-elements/grid-and-labels';
import * as circleUtils from 'utils/d3-elements/circles-and-lines';

const paddingRight = 18;
const paddingTop = 10;

type plotDayData = {
    hours: number[];
    timeseries: {
        gas: 'co2' | 'ch4';
        location: string;
        data: number[];
    }[];
};

const GASES = ['co2', 'ch4'];
const LOCATIONS = ['ROS', 'HAW'];

const exampleData: plotDayData = {
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
    plotAxisRange: {
        [key in 'time' | 'co2' | 'ch4']: {
            from: number;
            to: number;
            step: number;
        };
    };
    gas: 'co2' | 'ch4';
}) {
    const d3Container = useRef(null);
    const { plotAxisRange: domains } = props;
    const plotData: plotDayData = exampleData;

    useEffect(() => {
        if (d3Container.current) {
            const xScale = d3
                .scaleLinear()
                .domain([domains.time.from, domains.time.to])
                .range([80, 1000 - paddingRight]);

            const yScale = d3
                .scaleLinear()
                .domain([domains[props.gas].from, domains[props.gas].to])
                .range([350, paddingTop]);

            const svg = d3.select(d3Container.current);

            implementTimeDividers(svg, domains.time, xScale);
            implementTimeLabels(svg, domains.time, xScale);
            implementConcentrationDividers(svg, domains[props.gas], yScale);
            implementConcentrationLabels(
                svg,
                domains[props.gas],
                yScale,
                props.gas
            );
            implementAxisTitles(svg);

            const implementCircles = circleUtils.implementCircles(
                svg,
                xScale,
                yScale
            );
            const implementLines = circleUtils.implementLines(
                svg,
                xScale,
                yScale
            );

            for (let i = 0; i < plotData.timeseries.length; i++) {
                const ts = plotData.timeseries[i];
                if (ts.gas === props.gas) {
                    const dataPoints = circleUtils.generateTimeseries(
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
                viewBox='0 0 1000 400'
            />
        </div>
    );
}
