import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { range } from 'lodash';

const paddingRight = 18;
const paddingTop = 10;

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
    const { plotAxisRange: domain } = props;

    useEffect(() => {
        if (d3Container.current) {
            const xScale = d3
                .scaleLinear()
                .domain([
                    props.plotAxisRange.time.from,
                    props.plotAxisRange.time.to,
                ])
                .range([90, 1000 - paddingRight]);

            const yScale = d3
                .scaleLinear()
                .domain([
                    props.plotAxisRange[props.gas].from,
                    props.plotAxisRange[props.gas].to,
                ])
                .range([350, paddingTop]);

            const svg = d3.select(d3Container.current);
            let xAxisLines = svg
                .selectAll(`.x-axis-line`)
                .data(
                    range(
                        domain.time.from,
                        domain.time.to + domain.time.step,
                        domain.time.step
                    )
                );
            xAxisLines
                .enter()
                .append('line')
                .attr('class', 'x-axis-line')
                .attr('y1', paddingTop)
                .attr('y2', 354)
                .attr('stroke', '#CBD5E1')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1.4)
                .attr('x1', (x: number, i: number) => xScale(x))
                .attr('x2', (x: number, i: number) => xScale(x));

            xAxisLines.exit().remove();

            let yAxisLines = svg
                .selectAll(`.y-axis-line`)
                .data(
                    range(
                        domain[props.gas].from,
                        domain[props.gas].to + domain[props.gas].step,
                        domain[props.gas].step
                    )
                );
            yAxisLines
                .enter()
                .append('line')
                .attr('class', 'y-axis-line')
                .attr('x1', 70)
                .attr('x2', 1000 - paddingRight)
                .attr('stroke', '#CBD5E1')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1.4)
                .attr('y1', (y: number, i: number) => yScale(y))
                .attr('y2', (y: number, i: number) => yScale(y));

            yAxisLines.exit().remove();

            let xAxisLabels = svg
                .selectAll('.x-axis-label')
                .data(
                    range(
                        domain.time.from,
                        domain.time.to + domain.time.step,
                        domain.time.step
                    )
                );
            xAxisLabels
                .enter()
                .append('text')
                .attr('class', 'x-axis-label text-xs font-medium fill-gray-600')
                .style('text-anchor', 'middle')
                .attr('y', 372)
                .attr('x', (x: number, i: number) => xScale(x))
                .text((x: number, i: number) => x.toFixed(2).padStart(5, '0'));

            xAxisLabels.exit().remove();

            let yAxisLabels = svg
                .selectAll('.y-axis-label')
                .data(
                    range(
                        domain[props.gas].from,
                        domain[props.gas].to + domain[props.gas].step,
                        domain[props.gas].step
                    )
                );
            yAxisLabels
                .enter()
                .append('text')
                .attr('class', 'y-axis-label text-xs font-medium fill-gray-600')
                .style('dominant-baseline', 'middle')
                .attr('x', 40)
                .attr('y', (y: number, i: number) => yScale(y))
                .text((y: number, i: number) =>
                    y.toFixed(props.gas === 'co2' ? 0 : 3)
                );

            yAxisLabels.exit().remove();

            if (svg.selectAll('.x-axis-title').empty()) {
                svg.append('text')
                    .attr(
                        'class',
                        'x-axis-title font-semibold fill-gray-900 text-sm'
                    )
                    .style('text-anchor', 'middle')
                    .attr('y', 400 - 4)
                    .attr('x', 1000 / 2)
                    .text('daytime [h] (UTC)');
            }

            if (svg.selectAll('.y-axis-title').empty()) {
                svg.append('text')
                    .attr(
                        'class',
                        'y-axis-title font-semibold fill-gray-900 text-sm'
                    )
                    .attr('y', 0)
                    .attr('x', 0)
                    .attr(
                        'transform',
                        `rotate(-90) translate(-${(400 - 35) / 2}, 18)`
                    )
                    .style('text-anchor', 'middle')
                    .text(`concentration [ppm]`);
            }
        }
    });

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
