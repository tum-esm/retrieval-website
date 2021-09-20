import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as plotGridUtils from 'utils/d3-elements/flag-grid-and-labels';
import types from 'types';
import constants from 'utils/constants';
import buildFlagData from 'utils/build-flag-data';
import './plot-elements.css';
import { implementFlagCircles } from 'utils/d3-elements/flag-circles';
import * as plotGraphUtils from 'utils/d3-elements/flag-circles';

export default function FlagPlot(props: {
    domains: types.plotDomain;
    selectedGas: types.gas;
    gases: types.gasMeta[];
    stations: types.stationMeta[];
    flags: number[];
    plotDay: types.plotDay;
    isLoading: boolean;
    setIsLoading(l: boolean): void;
    visibleStations: boolean[];
}) {
    const d3Container = useRef(null);

    const [tsData, setTsData] = useState<{
        flagTimeseries: types.localFlagTimeseries[];
    }>(buildFlagData(props.stations, props.plotDay, props.domains));

    useEffect(
        () =>
            setTsData(
                buildFlagData(props.stations, props.plotDay, props.domains)
            ),
        [props.plotDay]
    );

    const xScale: (x: number) => number = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([props.domains['time'].from, props.domains['time'].to])
                .range([
                    80,
                    constants.PLOT.width - constants.PLOT.paddingRight,
                ]),
        [props.domains]
    );
    const yScale: (x: number) => number = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([-0.5, 8.5])
                .range([constants.PLOT.paddingTop, 350]),
        [props.domains]
    );

    // Draw grid once initially
    useEffect(() => {
        if (
            d3Container.current &&
            xScale !== undefined &&
            yScale !== undefined
        ) {
            const svg = d3.select(d3Container.current);
            // TODO: Use flag list from plot meta
            plotGridUtils.implementFlagGrid(
                svg,
                props.domains,
                xScale,
                yScale,
                props.flags.map(n => n.toString())
            );
        }
    }, [d3Container.current, xScale, yScale]);

    // Draw data on every data change
    useEffect(() => {
        if (
            d3Container.current &&
            xScale !== undefined &&
            yScale !== undefined
        ) {
            const svg = d3.select(d3Container.current);
            // TODO: implement flag timeseries

            const implementFlagCircles = plotGraphUtils.implementFlagCircles(
                svg,
                xScale,
                yScale,
                props.flags.map(n => n.toString()),
                props.stations.map(s => s.sensor)
            );

            for (let j = 0; j < tsData.flagTimeseries.length; j++) {
                const stationArrayIndex = props.stations.findIndex(
                    s => s.sensor === tsData.flagTimeseries[j].sensor
                );
                if (stationArrayIndex !== -1) {
                    implementFlagCircles(tsData.flagTimeseries[j]);
                }
            }

            props.setIsLoading(false);
        }
    }, [d3Container.current, xScale, yScale, tsData]);

    // TODO: fix css classes

    return (
        <div
            className={
                'relative w-full p-2 flex-row-center ' +
                'text-gray-900 bg-white shadow rounded ' +
                'plot-css ' +
                props.stations
                    .map((s, i) =>
                        props.visibleStations[i] ? `plot-css-${s.sensor} ` : ' '
                    )
                    .join(' ')
            }
        >
            <div className='absolute top-0 left-0 z-10 w-full h-full flex-row-center'>
                <div
                    className={
                        'px-2.5 py-1 text-sm font-medium bg-gray-700 rounded text-gray-50 ' +
                        (props.isLoading ? 'opacity-100 ' : 'opacity-0 ')
                    }
                >
                    loading data ...
                </div>
            </div>
            <svg
                className='relative z-0 w-full no-selection'
                ref={d3Container}
                viewBox={`0 0 ${constants.PLOT.width} ${constants.PLOT.height}`}
            />
        </div>
    );
}
