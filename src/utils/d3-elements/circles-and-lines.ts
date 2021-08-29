import ld from 'lodash';
import * as d3 from 'd3';
import types from 'types';

function getLocationColor(location: string) {
    switch (location) {
        case 'ROS':
            return '#2A9D8F';
        case 'HAW':
            return '#FF0000';
        case 'JOR':
            return '#00FF00';
        case 'GEO':
            return '#0000FF';
        default:
            return '#888888';
    }
}

export const generateTimeseries = (xs: number[], ys: number[]): any =>
    ld
        .zip(xs, ys)
        .filter(d => !d.includes(undefined) && d.length === 2)
        .map(d => ({ x: d[0], y: d[1] }))
        .filter(e => e.y !== 0);

export const generateLine = (
    xScale: (x: number) => number,
    yScale: (y: number) => number
) =>
    d3
        .line()
        // @ts-ignore
        .x((d: any) => xScale(d.x))
        // @ts-ignore
        .y((d: types.dataPoint) => yScale(d.y))
        .curve(d3.curveCatmullRom.alpha(0.5));

export const generateLines =
    (xScale: (x: number) => number, yScale: (y: number) => number) =>
    (xs: types.dataPoint[]) => {
        if (xs.length == 0) {
            return '';
        }
        return ld.reduce(
            separateDataLines(xs),
            (acc: string, next: types.dataPoint[]) => {
                // @ts-ignore
                return acc + ' ' + generateLine(xScale, yScale)(next);
            },
            ''
        );
    };

/*const separateDataLines = (xs: types.dataPoint[]) => {
    return ld.tail(
        ld.reduce(
            ld.tail(xs),
            (acc: types.dataPoint[][], next: types.dataPoint) =>
                next.x - ld.last(ld.last(acc)).x <= 1800
                    ? ld.concat(ld.initial(acc), [
                          ld.concat(ld.last(acc), next),
                      ])
                    : ld.concat(acc, [[next]]),
            [[], [ld.head(xs)]]
        )
    );
};*/

const separateDataLines = (xs: types.dataPoint[]): types.dataPoint[][] => {
    let out: types.dataPoint[][] = [];
    let runningLine: types.dataPoint[] = [xs[0]];
    for (let i = 1; i < xs.length; i++) {
        if (xs[i].x - xs[i - 1].x <= 1800) {
            // append to running line
            runningLine.push(xs[i]);
        } else {
            // start a new line after gaps of > 30 minutes
            out.push(runningLine);
            runningLine = [xs[i]];
        }
    }
    out.push(runningLine);
    return out;
};

export const implementCirclesAndLines =
    (svg: any, xScale: (n: number) => number, yScale: (n: number) => number) =>
    (
        gas: string,
        location: string,
        dataPoints: {
            x: number;
            y: number;
        }[]
    ) => {
        let circles: any = svg
            .selectAll(`.circle-${gas}-${location}`)
            .data(dataPoints);
        circles
            .enter()
            .append('circle')
            // TODO: Use a different color for each station
            .attr('fill', getLocationColor(location))
            .attr('class', `circle-${gas}-${location}`)

            // Keep all circles in sync with the data
            .merge(circles)
            // TODO: Vary circle size for raw vs. filtered data
            .attr('r', 1)
            // TODO: Only show circle on respective settings
            .attr('opacity', true ? '100%' : '0%')
            .attr('cx', (d: { x: number; y: number }, i: number) => xScale(d.x))
            .attr('cy', (d: { x: number; y: number }, i: number) =>
                yScale(d.y)
            );

        // Remove old circle elements
        circles.exit().remove();

        let line: any = svg.selectAll(`.line-${gas}-${location}`);
        if (line.empty()) {
            line = svg
                .append('path')
                .attr('class', `line-${gas}-${location} pointer-events-none`)
                // TODO: Use a different color for each station
                .style('stroke', getLocationColor(location))
                .style('stroke-width', 1)
                .style('stroke-linecap', 'round')
                .style('stroke-linejoin', 'round')
                .style('fill', 'none')
                // TODO: Vary line thickness for raw vs. filtered data
                .style('stroke-width', 2);
        }
        line
            // TODO: Only show circle on respective settings
            .attr('opacity', true ? '30%' : '0%')
            .attr('d', generateLines(xScale, yScale)(dataPoints));
    };
