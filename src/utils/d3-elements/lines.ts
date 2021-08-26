import ld from 'lodash';
import * as d3 from 'd3';

type DataPoint = { x: number; y: number };

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
