import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import {
    implementConcentrationDividers,
    implementConcentrationLabels,
    implementTimeDividers,
    implementTimeLabels,
    implementAxisTitles,
} from '../../utils/d3-elements/grid-and-labels';
import {
    implementCircles,
    implementLines,
    generateTimeseries,
} from '../../utils/d3-elements/circles-and-lines';

const paddingRight = 18;
const paddingTop = 10;

type plotDayData = {
    hours: number[];
    timeseries: {
        gas: 'co2' | 'ch4';
        location: string;
        sensor: string;
        data: number[];
    }[];
};

const exampleData: plotDayData = {
    hours: [8, 9, 10],
    timeseries: [
        {
            gas: 'co2',
            location: 'ROS',
            sensor: 'mb86',
            data: [410, 411, 410.75],
        },
        {
            gas: 'ch4',
            location: 'ROS',
            sensor: 'mb86',
            data: [1.9, 1.9091, 1.8914],
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
    const { plotAxisRange: domains, gas } = props;
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
            implementConcentrationDividers(svg, domains[gas], yScale);
            implementConcentrationLabels(svg, domains[gas], yScale, gas);
            implementAxisTitles(svg);

            for (let i = 0; i < plotData.timeseries.length; i++) {
                const {
                    gas,
                    location,
                    sensor,
                    data: ys,
                } = plotData.timeseries[i];
                const dataPoints: { x: number; y: number }[] =
                    generateTimeseries(plotData.hours, ys);

                implementCircles(
                    svg,
                    gas,
                    location,
                    sensor,
                    dataPoints,
                    xScale,
                    yScale
                );

                implementLines(
                    svg,
                    gas,
                    location,
                    sensor,
                    dataPoints,
                    xScale,
                    yScale
                );
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
