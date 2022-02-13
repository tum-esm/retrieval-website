import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import d3Elements from '../../utilities/d3-elements';
import types from '../../types';
import constants from '../../utilities/constants';

export default function D3DataPlot(props: {
    gases: types.gas[];
    locations: string[];
    spectrometers: string[];
    sensorDays: types.SensorDay[];
    selectedGas: string;
    selectedSpectrometers: string[];
    domains: types.PlotDomain;
}) {
    const d3Container = useRef(null);

    const xScale: (x: number) => number = d3
        .scaleLinear()
        .domain([constants.DOMAINS.time.from, constants.DOMAINS.time.to])
        .range([80, constants.PLOT.width - constants.PLOT.paddingRight]);
    const yScales: ((x: number) => number)[] = props.gases.map(gas =>
        d3
            .scaleLinear()
            .domain([props.domains[gas].from, props.domains[gas].to])
            .range([constants.PLOT.height - 50, constants.PLOT.paddingTop])
    );

    // Draw grid once initially
    useEffect(() => {
        if (d3Container.current) {
            const svg = d3.select(d3Container.current);
            d3Elements.implementPlotGrid(
                svg,
                xScale,
                yScales,
                props.gases,
                props.domains
            );
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
                        false,
                        props.domains
                    );
                    implementCirclesAndLines(
                        yScales[gasArrayIndex],
                        sensorDay.gas,
                        sensorDay.spectrometer,
                        sensorDay.rawTimeseries,
                        true,
                        props.domains
                    );
                }
            });
        }
    }, [d3Container.current]);

    return (
        <div
            className={
                'relative w-full py-6 flex-row-center text-gray-900 ' +
                `plot-css-${props.selectedGas} ` +
                props.selectedSpectrometers
                    .map(
                        spectrometer =>
                            `plot-css-${props.selectedGas}-${spectrometer} `
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
