import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { implementAxisTitles } from '../../utils/d3-elements/grid-and-labels';
import {
    implementConcentrationDividers,
    implementConcentrationLabels,
    implementTimeDividers,
    implementTimeLabels,
} from '../../utils/d3-elements/grid-and-labels';
import ld from 'lodash';
import { generateLines } from '../../utils/d3-elements/lines';

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

export const generateTimeseries = (xs: number[], ys: number[]) =>
    ld
        .zip(xs, ys)
        .map(d => ({ x: d[0], y: d[1] }))
        .filter(e => e.y !== 0);

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

                let circles: any = svg
                    .selectAll(`.circle-${gas}-${location}-${sensor}`)
                    .data(dataPoints);
                circles
                    .enter()
                    .append('circle')
                    .attr('fill', '#2A9D8F')
                    .attr('class', `circle-${gas}-${location}-${sensor}`)

                    // Keep all circles in sync with the data
                    .merge(circles)
                    .attr('r', 2.4)
                    .attr('opacity', true ? '100%' : '0%')
                    .attr('cx', (d: { x: number; y: number }, i: number) =>
                        xScale(d.x)
                    )
                    .attr('cy', (d: { x: number; y: number }, i: number) =>
                        yScale(d.y)
                    );

                // Remove old circle elements
                circles.exit().remove();

                // generateLines(xScale, yScale)
                let line: any = svg.selectAll(
                    `.line-${gas}-${location}-${sensor}`
                );
                if (line.empty()) {
                    line = svg
                        .append('path')
                        .attr(
                            'class',
                            `line-${gas}-${location}-${sensor} pointer-events-none`
                        )
                        .style('stroke', '#2A9D8F')
                        .style('stroke-width', 2.4)
                        .style('stroke-linecap', 'round')
                        .style('stroke-linejoin', 'round')
                        //.style('stroke-dasharray', '5,7.5')
                        .style('fill', 'none');
                }
                line.style('stroke-width', 4.8)
                    .attr('opacity', true ? '30%' : '0%')
                    .attr('d', generateLines(xScale, yScale)(dataPoints));
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
