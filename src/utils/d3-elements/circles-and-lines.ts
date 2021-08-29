import { zip, reduce } from 'lodash';
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
        if (ts[i][0] - ts[i - 1][0] <= 1800) {
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
    (svg: any, xScale: (n: number) => number, yScale: (n: number) => number) =>
    (timeseries: types.gasTimeseries) => {
        const { gas, location, data } = timeseries;

        const circleClassName = `circle-${gas}-${location}`;
        const lineClassName = `line-${gas}-${location}`;
        const zippedData: any[][] = zip(data.xs, data.ys);

        let circles: any = svg
            .selectAll(`.${circleClassName}`)
            .data(zippedData);
        circles
            .enter()
            .append('circle')
            .attr('fill', getLocationColor(location))
            .attr('class', circleClassName)
            // TODO: Vary circle size for raw vs. filtered data
            .attr('r', 1)

            // Keep all circles in sync with the data
            .merge(circles)
            // TODO: Only show circle on respective settings
            .attr('opacity', true ? '100%' : '0%')
            .attr('cx', (d: number[], i: number) => xScale(d[0]))
            .attr('cy', (d: number[], i: number) => yScale(d[1]));

        // Remove old circle elements
        circles.exit().remove();
        /*
        let line: any = svg.selectAll(`.${lineClassName}`);
        const generateCurrentLines = generateLines(xScale, yScale);
        if (line.empty()) {
            line = svg
                .append('path')
                .attr('class', `${lineClassName} pointer-events-none`)
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
            .attr('d', generateCurrentLines(zippedData));*/
    };
