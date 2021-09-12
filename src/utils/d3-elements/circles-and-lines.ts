import { zip, reduce } from 'lodash';
import * as d3 from 'd3';
import types from 'types';

export function getLocationColor(location: string) {
    switch (location) {
        case 'ROS':
            return '#F87171'; // red-400
        case 'HAW':
            return '#34D399'; // emerald-400
        case 'JOR':
            return '#60A5FA'; // blue-400
        case 'GEO':
            return '#FBBF24'; // amber-400
        default:
            return '#9CA3AF'; // coolGray-400
    }
}

export const generateLine = (
    xScale: (x: number) => number,
    yScale: (y: number) => number
) =>
    d3
        .line()
        // @ts-ignore
        .x((d: number[]) => xScale(d[0]))
        // @ts-ignore
        .y((d: number[]) => yScale(d[1]))
        .curve(d3.curveCatmullRom.alpha(0.5));

export const generateLines =
    (xScale: (x: number) => number, yScale: (y: number) => number) =>
    (zippedData: number[][]) => {
        if (zippedData.length == 0) {
            return '';
        }

        return reduce(
            // @ts-ignore
            separateDataLines(zippedData),
            (acc: string, next: number[][]) => {
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

const separateDataLines = (ts: number[][]): number[][][] => {
    let out: number[][][] = [];
    let runningLine: number[][] = [ts[0]];
    for (let i = 1; i < ts.length; i++) {
        if (ts[i][0] - ts[i - 1][0] <= 0.5) {
            // append to running line
            runningLine.push(ts[i]);
        } else {
            // start a new line after gaps of > 30 minutes
            out.push(runningLine);
            runningLine = [ts[i]];
        }
    }
    out.push(runningLine);
    return out;
};

export const implementCirclesAndLines =
    (svg: any, xScale: (n: number) => number) =>
    (
        yScale: (n: number) => number,
        timeseries: types.localGasTimeseries,
        tsIsRaw: boolean
    ) => {
        const { gas, location, data } = timeseries;

        const circleClassName = `circle-${gas}-${location}-${
            tsIsRaw ? 'raw' : 'filtered'
        }`;
        const lineClassName = `line-${gas}-${location}-${
            tsIsRaw ? 'raw' : 'filtered'
        }`;

        let circles: any = svg.selectAll(`.${circleClassName}`).data(data);
        circles
            .enter()
            .append('circle')
            .attr('fill', getLocationColor(location))
            .attr('class', circleClassName)
            .attr('r', tsIsRaw ? 1 : 1.5)

            // Keep all circles in sync with the data
            .merge(circles)
            .attr('opacity', tsIsRaw ? '35%' : '100%')
            .attr('cx', (d: number[], i: number) => xScale(d[0]))
            .attr('cy', (d: number[], i: number) => yScale(d[1]));

        // Remove old circle elements
        circles.exit().remove();

        // Draw line elements
        if (!tsIsRaw) {
            let line: any = svg.selectAll(`.${lineClassName}`);
            const generateCurrentLines = generateLines(xScale, yScale);
            if (line.empty()) {
                line = svg
                    .append('path')
                    .attr('class', `${lineClassName} pointer-events-none`)
                    .style('stroke', getLocationColor(location))
                    .style('stroke-width', tsIsRaw ? 2 : 3)
                    .style('stroke-linecap', 'round')
                    .style('stroke-linejoin', 'round')
                    .style('fill', 'none');
            }
            line.attr('d', generateCurrentLines(data)).attr('opacity', '70%');
        }
    };
