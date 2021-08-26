import { range } from 'lodash';
import * as d3 from 'd3';

const paddingRight = 18;
const paddingTop = 10;

export function implementTimeDividers(
    svg: any,
    domain: {
        from: number;
        to: number;
        step: number;
    },
    xScale: (n: number) => number
) {
    let xAxisLines = svg
        .selectAll(`.x-axis-line`)
        .data(range(domain.from, domain.to + domain.step, domain.step));
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
}

export function implementConcentrationDividers(
    svg: any,
    domain: {
        from: number;
        to: number;
        step: number;
    },
    yScale: (n: number) => number
) {
    let yAxisLines: any = svg
        .selectAll(`.y-axis-line`)
        .data(range(domain.from, domain.to + domain.step, domain.step));
    yAxisLines
        .enter()
        .append('line')
        .attr('class', 'y-axis-line')
        .attr('x1', 65)
        .attr('x2', 1000 - paddingRight)
        .attr('stroke', '#CBD5E1')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.4)
        .merge(yAxisLines)
        .attr('y1', (y: number, i: number) => yScale(y))
        .attr('y2', (y: number, i: number) => yScale(y));

    yAxisLines.exit().remove();
}

export function implementTimeLabels(
    svg: any,
    domain: {
        from: number;
        to: number;
        step: number;
    },
    xScale: (n: number) => number
) {
    let xAxisLabels = svg
        .selectAll('.x-axis-label')
        .data(range(domain.from, domain.to + domain.step, domain.step));
    xAxisLabels
        .enter()
        .append('text')
        .attr('class', 'x-axis-label text-xs font-medium fill-gray-600')
        .style('text-anchor', 'middle')
        .attr('y', 372)
        .attr('x', (x: number, i: number) => xScale(x))
        .text((x: number, i: number) => x.toFixed(2).padStart(5, '0'));

    xAxisLabels.exit().remove();
}

export function implementConcentrationLabels(
    svg: any,
    domain: {
        from: number;
        to: number;
        step: number;
    },
    yScale: (n: number) => number,
    gas: 'co2' | 'ch4'
) {
    let yAxisLabels: any = svg
        .selectAll('.y-axis-label')
        .data(range(domain.from, domain.to + domain.step, domain.step));
    yAxisLabels
        .enter()
        .append('text')
        .attr('class', 'y-axis-label text-xs font-medium fill-gray-600')
        .style('dominant-baseline', 'middle')
        .style('text-anchor', 'end')
        .attr('x', 60)
        .merge(yAxisLabels)
        .attr('y', (y: number, i: number) => yScale(y))
        .text((y: number, i: number) => y.toFixed(gas === 'co2' ? 0 : 3));

    yAxisLabels.exit().remove();
}

export function implementAxisTitles(svg: any) {
    if (svg.selectAll('.x-axis-title').empty()) {
        svg.append('text')
            .attr('class', 'x-axis-title font-medium fill-gray-900 text-xs')
            .style('text-anchor', 'middle')
            .attr('y', 400 - 4)
            .attr('x', 1000 / 2)
            .text('daytime [h] (UTC)');
    }

    if (svg.selectAll('.y-axis-title').empty()) {
        svg.append('text')
            .attr('class', 'y-axis-title font-medium fill-gray-900 text-xs')
            .attr('y', 0)
            .attr('x', 0)
            .attr('transform', `rotate(-90) translate(-${(400 - 35) / 2}, 12)`)
            .style('text-anchor', 'middle')
            .text(`concentration [ppm]`);
    }
}