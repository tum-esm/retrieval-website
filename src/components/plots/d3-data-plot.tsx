import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import d3Elements from '../../utilities/d3-elements';
import types from '../../types';
import constants from '../../utilities/constants';

export default function D3DataPlot(props: {
    gases: string[];
    locations: string[];
    spectrometers: string[];
    sensorDays: types.SensorDay[];
    selectedGas: string;
    selectedSpectrometers: string[];
}) {
    const d3Container = useRef(null);

    const xScale: (x: number) => number = d3
        .scaleLinear()
        .domain([constants.DOMAINS.time.from, constants.DOMAINS.time.to])
        .range([80, constants.PLOT.width - constants.PLOT.paddingRight]);
    const yScales: ((x: number) => number)[] = props.gases.map(gas =>
        d3
            .scaleLinear()
            .domain([constants.DOMAINS[gas].from, constants.DOMAINS[gas].to])
            .range([350, constants.PLOT.paddingTop])
    );

    // Draw grid once initially
    useEffect(() => {
        if (d3Container.current) {
            const svg = d3.select(d3Container.current);
            d3Elements.implementPlotGrid(svg, xScale, yScales, props.gases);
        }
    }, [d3Container.current]);

    // Draw data on every data change
    useEffect(() => {
        if (d3Container.current) {
            const svg = d3.select(d3Container.current);

            const implementCirclesAndLines =
                d3Elements.implementCirclesAndLines(svg, xScale);

            props.sensorDays.forEach((sensorDay, i) => {
                const spectrometerArrayIndex = props.spectrometers.findIndex(
                    spectrometer => spectrometer === sensorDay.spectrometer
                );
                const gasArrayIndex = props.gases.findIndex(
                    gas => gas === sensorDay.gas
                );
                if (spectrometerArrayIndex !== -1 && gasArrayIndex !== -1) {
                    implementCirclesAndLines(
                        yScales[gasArrayIndex],
                        sensorDay.gas,
                        sensorDay.spectrometer,
                        sensorDay.filteredTimeseries,
                        false
                    );
                    implementCirclesAndLines(
                        yScales[gasArrayIndex],
                        sensorDay.gas,
                        sensorDay.spectrometer,
                        sensorDay.rawTimeseries,
                        true
                    );
                }
            });
        }
    }, [d3Container.current]);

    return (
        <div
            className={
                'relative w-full p-2 flex-row-center text-gray-900 bg-white shadow rounded ' +
                `plot-css-${props.selectedGas} ` +
                props.spectrometers
                    .map(spectrometer =>
                        props.selectedSpectrometers.includes(spectrometer)
                            ? `plot-css-${props.selectedGas}-${spectrometer} `
                            : ' '
                    )
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
