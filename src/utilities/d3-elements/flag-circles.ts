import { zip } from 'lodash';
import types from '../../types';
import constants from '../constants';
import { getSpectrometerColor } from '../colors';

export const implementFlagCircles =
    (
        svg: any,
        xScale: (n: number) => number,
        yScale: (n: number) => number,
        spectrometers: string[]
    ) =>
    (spectrometer: string, timeseries: types.Timeseries) => {
        const data = zip(timeseries.xs, timeseries.ys).filter(
            d =>
                d[0] > constants.DOMAINS.time.from &&
                d[0] < constants.DOMAINS.time.to &&
                constants.FLAGS.includes(d[1])
        );

        const sensorOffset =
            (spectrometers.indexOf(spectrometer) -
                (spectrometers.length - 1) / 2) *
            6;

        let yLookup: { [key: number]: number } = {};
        constants.FLAGS.forEach((flag, i) => {
            yLookup[flag] = i;
        });

        const circleClassName = `circle-${spectrometer}`;

        let circleGroup: any = svg.selectAll(`.${circleClassName}`);
        if (circleGroup.empty()) {
            circleGroup = svg
                .append('g')
                .attr('class', `${circleClassName} pointer-events-none`)
                .attr('fill', getSpectrometerColor(spectrometer));
        }

        let circles: any = circleGroup
            .selectAll(`circle`)
            .data(data.filter((d: number[]) => constants.FLAGS.includes(d[1])));
        circles
            .enter()
            .append('circle')
            .attr('r', 1.5)

            // Keep all circles in sync with the data
            .merge(circles)
            //.attr('opacity', tsIsRaw ? '35%' : '100%')
            .attr('cx', (d: number[], i: number) => xScale(d[0]).toFixed(2))
            .attr(
                'cy',
                (d: number[], i: number) => yScale(yLookup[d[1]]) + sensorOffset
            );

        // Remove old circle elements
        circles.exit().remove();
    };
