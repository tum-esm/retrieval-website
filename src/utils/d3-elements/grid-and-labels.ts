import { range } from 'lodash';
import constants from 'utils/constants';
import types from 'types';

export function implementTimeDividers(
    svg: any,
    axisDomain: types.plotAxisDomain,
    xScale: (n: number) => number
) {
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
                axisDomain.from,
                axisDomain.to + axisDomain.step,
                axisDomain.step
            )
        );
    lines
        .enter()
        .append('line')
        .attr('class', 'x-axis-line')
        .attr('y1', constants.PLOT.paddingTop)
        .attr('y2', 354)
        .attr('stroke', '#CBD5E1')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.4)
        .attr('x1', (x: number, i: number) => xScale(x))
        .attr('x2', (x: number, i: number) => xScale(x));

    lines.exit().remove();
}

export function implementConcentrationDividers(
    svg: any,
    axisDomain: types.plotAxisDomain,
    yScale: (n: number) => number,
    gas: 'co2' | 'ch4'
) {
    const lineClassName = `y-axis-line-${gas}`;

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
                axisDomain.from,
                axisDomain.to + axisDomain.step,
                axisDomain.step
            )
        );
    lines
        .enter()
        .append('line')
        .attr('x1', 65)
        .attr('x2', constants.PLOT.width - constants.PLOT.paddingRight)
        .attr('stroke', '#CBD5E1')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.4)
        .merge(lines)
        .attr('y1', (y: number, i: number) => yScale(y))
        .attr('y2', (y: number, i: number) => yScale(y));

    lines.exit().remove();
}

export function implementTimeLabels(
    svg: any,
    axisDomain: types.plotAxisDomain,
    xScale: (n: number) => number
) {
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
                axisDomain.from,
                axisDomain.to + axisDomain.step,
                axisDomain.step
            )
        );
    labels
        .enter()
        .append('text')
        .style('text-anchor', 'middle')
        .attr('y', 372)
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

export function implementConcentrationLabels(
    svg: any,
    axisDomain: types.plotAxisDomain,
    yScale: (n: number) => number,
    gas: 'co2' | 'ch4'
) {
    const labelClassName = `y-axis-label-${gas}`;

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
        .data(
            range(
                axisDomain.from,
                axisDomain.to + axisDomain.step,
                axisDomain.step
            )
        );
    labels
        .enter()
        .append('text')
        .style('dominant-baseline', 'middle')
        .style('text-anchor', 'end')
        .attr('x', 60)
        .merge(labels)
        .attr('y', (y: number, i: number) => yScale(y))
        .text((y: number, i: number) => y.toFixed(gas === 'co2' ? 0 : 3));

    labels.exit().remove();
}

export function implementAxisTitles(svg: any) {
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
                }, 14)`
            )
            .style('text-anchor', 'middle')
            .text(`concentration [ppm]`);
    }
}

export function implementPlotGrid(
    svg: any,
    domain: types.plotDomain,
    xScale: (x: number) => number,
    yScales: ((x: number) => number)[],
    gases: types.gasMeta[]
) {
    implementTimeDividers(svg, domain.time, xScale);
    implementTimeLabels(svg, domain.time, xScale);
    implementAxisTitles(svg);
    gases.forEach(gm => {
        const gasArrayIndex = gases.findIndex(s => s.name === gm.name);
        implementConcentrationDividers(
            svg,
            domain[gm.name],
            yScales[gasArrayIndex],
            gm.name
        );
        implementConcentrationLabels(
            svg,
            domain[gm.name],
            yScales[gasArrayIndex],
            gm.name
        );
    });
}
