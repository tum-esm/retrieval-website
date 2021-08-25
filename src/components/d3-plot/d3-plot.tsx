import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { range } from 'lodash';

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
                .range([100, 996]);

            const yScale = d3
                .scaleLinear()
                .domain([
                    props.plotAxisRange[props.gas].from,
                    props.plotAxisRange[props.gas].to,
                ])
                .range([350, 4]);

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
                .attr('y1', 4)
                .attr('y2', 350)
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
                .attr('x1', 100)
                .attr('x2', 996)
                .attr('stroke', '#CBD5E1')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1.4)
                .attr('y1', (y: number, i: number) => yScale(y))
                .attr('y2', (y: number, i: number) => yScale(y));

            yAxisLines.exit().remove();
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
