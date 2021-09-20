import types from 'types';

export function getSensorColor(sensor: string) {
    switch (sensor) {
        case 'mb86':
            return '#F87171'; // red-400
        case 'mc15':
            return '#34D399'; // emerald-400
        case 'md16':
            return '#60A5FA'; // blue-400
        case 'me17':
            return '#FBBF24'; // amber-400
        default:
            return '#9CA3AF'; // coolgray-400
    }
}

export const implementFlagCircles =
    (
        svg: any,
        xScale: (n: number) => number,
        yScale: (n: number) => number,
        flags: string[],
        sensors: string[]
    ) =>
    (flagTimeseries: types.localFlagTimeseries) => {
        const { sensor, data } = flagTimeseries;

        const sensorOffset =
            (sensors.indexOf(sensor) - (sensors.length - 1) / 2) * 6;

        let yLookup: { [key: number]: number } = {};
        flags.forEach((flag, i) => {
            yLookup[parseInt(flag)] = i;
        });

        const circleClassName = `circle-${sensor}`;

        let circleGroup: any = svg.selectAll(`.${circleClassName}`);
        if (circleGroup.empty()) {
            circleGroup = svg
                .append('g')
                .attr('class', `${circleClassName} pointer-events-none`)
                .attr('fill', getSensorColor(sensor));
        }

        const flagInts = flags.map(f => parseInt(f));
        let circles: any = circleGroup
            .selectAll(`circle`)
            .data(data.filter((d: number[]) => flagInts.includes(d[1])));
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
