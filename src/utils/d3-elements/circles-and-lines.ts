import ld from 'lodash';
import * as d3 from 'd3';

type DataPoint = { x: number; y: number };

export const generateTimeseries = (xs: number[], ys: number[]) =>
    ld
        .zip(xs, ys)
        .map(d => ({ x: d[0], y: d[1] }))
        .filter(e => e.y !== 0);

export const generateLine = (
    xScale: (x: number) => number,
    yScale: (y: number) => number
) =>
    d3
        .line()
        // @ts-ignore
        .x((d: DataPoint) => xScale(d.x))
        // @ts-ignore
        .y((d: DataPoint) => yScale(d.y))
        .curve(d3.curveCatmullRom.alpha(0.5));

export const generateLines =
    (xScale: (x: number) => number, yScale: (y: number) => number) =>
    (xs: DataPoint[]) => {
        if (xs.length == 0) {
            return '';
        }
        return ld.reduce(
            separateDataLines(xs),
            (acc: string, next: DataPoint[]) => {
                // @ts-ignore
                return acc + ' ' + generateLine(xScale, yScale)(next);
            },
            ''
        );
    };

const separateDataLines = (xs: DataPoint[]) => {
    return ld.tail(
        ld.reduce(
            ld.tail(xs),
            (acc: DataPoint[][], next: DataPoint) =>
                next.x - ld.last(ld.last(acc)).x <= 1800
                    ? ld.concat(ld.initial(acc), [
                          ld.concat(ld.last(acc), next),
                      ])
                    : ld.concat(acc, [[next]]),
            [[], [ld.head(xs)]]
        )
    );
};

export const implementCircles =
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
            .attr('fill', '#2A9D8F')
            .attr('class', `circle-${gas}-${location}`)

            // Keep all circles in sync with the data
            .merge(circles)
            .attr('r', 2.4)
            .attr('opacity', true ? '100%' : '0%')
            .attr('cx', (d: { x: number; y: number }, i: number) => xScale(d.x))
            .attr('cy', (d: { x: number; y: number }, i: number) =>
                yScale(d.y)
            );

        // Remove old circle elements
        circles.exit().remove();
    };

export const implementLines =
    (svg: any, xScale: (n: number) => number, yScale: (n: number) => number) =>
    (
        gas: string,
        location: string,
        dataPoints: {
            x: number;
            y: number;
        }[]
    ) => {
        let line: any = svg.selectAll(`.line-${gas}-${location}`);
        if (line.empty()) {
            line = svg
                .append('path')
                .attr('class', `line-${gas}-${location} pointer-events-none`)
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
    };
