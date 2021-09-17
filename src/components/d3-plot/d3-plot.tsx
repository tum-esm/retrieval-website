import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as plotGridUtils from 'utils/d3-elements/grid-and-labels';
import * as plotGraphUtils from 'utils/d3-elements/circles-and-lines';
import types from 'types';
import constants from 'utils/constants';
import buildTimeseriesData from 'utils/build-timeseries-data';
import './plot-elements.css';

export default function D3Plot(props: {
    domains: types.plotDomain;
    selectedGas: types.gas;
    gases: types.gasMeta[];
    stations: types.stationMeta[];
    plotDay: types.plotDay;
    isLoading: boolean;
    setIsLoading(l: boolean): void;
    visibleStations: boolean[];
}) {
    const d3Container = useRef(null);

    const [tsData, setTsData] = useState<{
        timeseries: types.localGasTimeseries[];
        rawTimeseries: types.localGasTimeseries[];
    }>(
        buildTimeseriesData(
            props.gases,
            props.stations,
            props.plotDay,
            props.domains
        )
    );

    useEffect(
        () =>
            setTsData(
                buildTimeseriesData(
                    props.gases,
                    props.stations,
                    props.plotDay,
                    props.domains
                )
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
    const yScales: ((x: number) => number)[] = useMemo(
        () =>
            props.gases.map(g =>
                d3
                    .scaleLinear()
                    .domain([
                        props.domains[g.name].from,
                        props.domains[g.name].to,
                    ])
                    .range([350, constants.PLOT.paddingTop])
            ),
        [props.gases, props.domains]
    );

    // Draw grid once initially
    useEffect(() => {
        if (
            d3Container.current &&
            xScale !== undefined &&
            yScales !== undefined
        ) {
            const svg = d3.select(d3Container.current);
            plotGridUtils.implementPlotGrid(
                svg,
                props.domains,
                xScale,
                yScales,
                props.gases
            );
        }
    }, [d3Container.current, xScale, yScales]);

    // Draw data on every data change
    useEffect(() => {
        if (
            d3Container.current &&
            xScale !== undefined &&
            yScales !== undefined
        ) {
            const svg = d3.select(d3Container.current);

            const implementCirclesAndLines =
                plotGraphUtils.implementCirclesAndLines(svg, xScale);

            [tsData.timeseries, tsData.rawTimeseries].forEach((gts, i) => {
                for (let j = 0; j < gts.length; j++) {
                    const stationArrayIndex = props.stations.findIndex(
                        s => s.sensor === gts[j].sensor
                    );
                    const gasArrayIndex = props.gases.findIndex(
                        s => s.name === gts[j].gas
                    );
                    if (stationArrayIndex !== -1 && gasArrayIndex !== -1) {
                        implementCirclesAndLines(
                            yScales[gasArrayIndex],
                            gts[j],
                            i === 1
                        );
                    }
                }
            });
            props.setIsLoading(false);
        }
    }, [d3Container.current, xScale, yScales, tsData]);

    return (
        <div
            className={
                'relative w-full p-2 flex-row-center text-gray-900 bg-white shadow rounded ' +
                `plot-css-${props.selectedGas} ` +
                props.stations
                    .map((s, i) =>
                        props.visibleStations[i]
                            ? `plot-css-${props.selectedGas}-${s.sensor} `
                            : ' '
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
