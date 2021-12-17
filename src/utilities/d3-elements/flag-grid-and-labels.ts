import { range } from 'lodash';
import constants from '../constants';

function implementTimeDividers(svg: any, xScale: (n: number) => number) {
    const lineClassName = `x-axis-line`;
    let lineGroup: any = svg.selectAll(`.${lineClassName}`);
    if (lineGroup.empty()) {
        lineGroup = svg
            .append('g')
            .attr(
                'class',
                `${lineClassName} pointer-events-none text-xs font-medium ` +
                    `fill-gray-600`
            );
    }

    let lines = lineGroup
        .selectAll('line')
        .data(
            range(
                constants.DOMAINS.time.from,
                constants.DOMAINS.time.to + constants.DOMAINS.time.step,
                constants.DOMAINS.time.step
            )
        );
    lines
        .enter()
        .append('line')
        .attr('y1', constants.PLOT.paddingTop - 1)
        .attr('y2', constants.PLOT.height - 46)
        .attr('stroke', '#CBD5E1')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.4)
        .attr('x1', (x: number, i: number) => xScale(x))
        .attr('x2', (x: number, i: number) => xScale(x));

    lines.exit().remove();
}

function implementFlagBars(svg: any, yScale: (n: number) => number) {
    const lineClassName = `y-axis-bar`;

    let rectGroup: any = svg.selectAll(`.${lineClassName}`);
    if (rectGroup.empty()) {
        rectGroup = svg
            .append('g')
            .attr('class', `${lineClassName} pointer-events-none`);
    }

    let rects = rectGroup
        .selectAll('rect')
        .data(range(0, constants.FLAGS.length));
    rects
        .enter()
        .append('rect')
        .attr('width', constants.PLOT.width - 80 - constants.PLOT.paddingRight)
        .attr('height', yScale(1) - yScale(0))
        .attr('x', 80)
        .attr('class', (value: number, i: number) =>
            i % 2 === 0 ? 'fill-gray-100' : 'text-transparent fill-current'
        )
        .attr('y', (value: number, i: number) => yScale(value - 0.5));

    rects.exit().remove();
}

function implementTimeLabels(svg: any, xScale: (n: number) => number) {
    const labelClassName = `x-axis-label`;

    let labelGroup: any = svg.selectAll(`.${labelClassName}`);
    if (labelGroup.empty()) {
        labelGroup = svg
            .append('g')
            .attr(
                'class',
                `${labelClassName} pointer-events-none text-xs font-medium ` +
                    `fill-gray-600`
            );
    }

    let labels = labelGroup
        .selectAll('text')
        .data(
            range(
                constants.DOMAINS.time.from,
                constants.DOMAINS.time.to + constants.DOMAINS.time.step,
                constants.DOMAINS.time.step
            )
        );
    labels
        .enter()
        .append('text')
        .style('text-anchor', 'middle')
        .attr('y', constants.PLOT.height - 28)
        .attr('x', (x: number, i: number) => xScale(x))
        .text((x: number, i: number) =>
            x
                .toFixed(2)
                .padStart(5, '0')
                .replace('.50', '.30')
                .replace('.25', '.15')
        );

    labels.exit().remove();
}

function implementFlagLabels(svg: any, yScale: (n: number) => number) {
    const labelClassName = `y-axis-label`;

    let labelGroup: any = svg.selectAll(`.${labelClassName}`);
    if (labelGroup.empty()) {
        labelGroup = svg
            .append('g')
            .attr(
                'class',
                `${labelClassName} pointer-events-none text-xs font-medium ` +
                    `fill-gray-600`
            );
    }

    let labels: any = labelGroup
        .selectAll(`text`)
        .data(constants.FLAGS.map((f, i) => [f, i]));
    labels
        .enter()
        .append('text')
        .style('dominant-baseline', 'middle')
        .style('text-anchor', 'end')
        .attr('x', 60)
        .merge(labels)
        .attr('y', (value: any[], i: number) => yScale(value[1]))
        .text((value: any[], i: number) => value[0]);

    labels.exit().remove();
}

function implementAxisTitles(svg: any) {
    if (svg.selectAll('.x-axis-title').empty()) {
        svg.append('text')
            .attr('class', 'x-axis-title font-medium fill-gray-900 text-xs')
            .style('text-anchor', 'middle')
            .attr('y', constants.PLOT.height - 4)
            .attr('x', constants.PLOT.width / 2)
            .text('daytime [h] (UTC)');
    }

    if (svg.selectAll('.y-axis-title').empty()) {
        svg.append('text')
            .attr('class', 'y-axis-title font-medium fill-gray-900 text-xs')
            .attr('y', 0)
            .attr('x', 0)
            .attr(
                'transform',
                `rotate(-90) translate(-${
                    (constants.PLOT.height - 35) / 2
                }, 22)`
            )
            .style('text-anchor', 'middle')
            .text(`flag from gfit retrieval`);
    }
}

export function implementFlagGrid(
    svg: any,
    xScale: (x: number) => number,
    yScale: (x: number) => number
) {
    implementFlagBars(svg, yScale);
    implementFlagLabels(svg, yScale);
    implementTimeDividers(svg, xScale);
    implementTimeLabels(svg, xScale);
    implementAxisTitles(svg);
}
