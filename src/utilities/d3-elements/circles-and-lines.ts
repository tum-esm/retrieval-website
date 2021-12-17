import { zip, reduce } from 'lodash';
import * as d3 from 'd3';
import types from '../../types';
import { getSpectrometerColor } from '../colors';
import constants from '../constants';

const generateLine = (
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

const generateLines =
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
        gas: string,
        spectrometer: string,
        timeseries: types.Timeseries,
        timeseriesIsRaw: boolean
    ) => {
        const data = zip(timeseries.xs, timeseries.ys).filter(
            d =>
                d[0] > constants.DOMAINS.time.from &&
                d[0] < constants.DOMAINS.time.to &&
                d[1] > constants.DOMAINS[gas].from &&
                d[1] < constants.DOMAINS[gas].to
        );

        const circleClassName = `circle-${
            timeseriesIsRaw ? 'raw' : 'filtered'
        }-${gas}-${spectrometer}`;
        const lineClassName = `interpolation-${gas}-${spectrometer}`;

        let circleGroup: any = svg.selectAll(`.${circleClassName}`);
        if (circleGroup.empty()) {
            circleGroup = svg
                .append('g')
                .attr('class', `${circleClassName} pointer-events-none`)
                .attr('fill', getSpectrometerColor(spectrometer));
        }

        let circles: any = circleGroup.selectAll(`circle`).data(data);
        circles
            .enter()
            .append('circle')
            .attr('r', timeseriesIsRaw ? 1 : 1.5)

            // Keep all circles in sync with the data
            .merge(circles)
            //.attr('opacity', tsIsRaw ? '35%' : '100%')
            .attr('cx', (d: number[], i: number) => xScale(d[0]).toFixed(2))
            .attr('cy', (d: number[], i: number) => yScale(d[1]).toFixed(2));

        // Remove old circle elements
        circles.exit().remove();

        // Draw line elements
        if (!timeseriesIsRaw) {
            let lineGroup: any = svg.selectAll('.interpolated-lines');
            if (lineGroup.empty()) {
                lineGroup = svg.append('g').attr('class', `interpolated-lines`);
            }

            let line: any = lineGroup.selectAll(`.${lineClassName}`);
            const generateCurrentLines = generateLines(xScale, yScale);
            if (line.empty()) {
                line = lineGroup
                    .append('path')
                    .attr('class', `${lineClassName} pointer-events-none`)
                    .style('stroke', getSpectrometerColor(spectrometer))
                    .style('stroke-width', timeseriesIsRaw ? 2 : 3)
                    .style('stroke-linecap', 'round')
                    .style('stroke-linejoin', 'round')
                    .style('fill', 'none');
            }
            line.attr('d', generateCurrentLines(data)); //.attr('opacity', '70%');
        }
    };
