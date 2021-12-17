import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import types from '../../types';
import constants from '../../utilities/constants';
import d3Elements from '../../utilities/d3-elements';

export default function D3FlagPlot(props: {
    spectrometers: string[];
    sensorDays: types.SensorDay[];
    selectedSpectrometers: string[];
}) {
    const d3Container = useRef(null);

    const xScale: (x: number) => number = d3
        .scaleLinear()
        .domain([constants.DOMAINS.time.from, constants.DOMAINS.time.to])
        .range([80, constants.PLOT.width - constants.PLOT.paddingRight]);
    const yScale: (x: number) => number = d3
        .scaleLinear()
        .domain([-0.5, constants.FLAGS.length - 0.5])
        .range([constants.PLOT.paddingTop, constants.PLOT.height - 50]);

    // Draw grid once initially
    useEffect(() => {
        if (d3Container.current) {
            d3Elements.implementFlagGrid(
                d3.select(d3Container.current),
                xScale,
                yScale
            );
        }
    }, [d3Container.current]);

    // Draw data on every data change
    useEffect(() => {
        if (d3Container.current) {
            const svg = d3.select(d3Container.current);

            const implementFlagCircles = d3Elements.implementFlagCircles(
                svg,
                xScale,
                yScale,
                props.spectrometers
            );

            props.sensorDays.forEach((sensorDay, i) => {
                console.log({ flags: sensorDay.flagTimeseries });
                implementFlagCircles(
                    sensorDay.spectrometer,
                    sensorDay.flagTimeseries
                );
            });
        }
    }, [d3Container.current]);

    return (
        <div
            className={
                'relative w-full py-6 flex-row-center text-gray-900 ' +
                `plot-css ` +
                props.selectedSpectrometers
                    .map(spectrometer => `plot-css-${spectrometer} `)
                    .join(' ')
            }
        >
            <svg
                className='relative z-0 w-full no-selection'
                ref={d3Container}
                viewBox={`0 0 ${constants.PLOT.width} ${constants.PLOT.height}`}
            />
        </div>
    );
}
