import types from 'types';

export default function buildTimeseriesData(
    gases: types.gasMeta[],
    stations: types.stationMeta[],
    plotDay: types.plotDay
) {
    let timeseries: types.gasTimeseries[] = [];
    let rawTimeseries: types.gasTimeseries[] = [];
    for (let i = 0; i < gases.length; i++) {
        for (let j = 0; j < stations.length; j++) {
            const gas = gases[i].name;
            const location = stations[j].location;
            let tsAdded = false;

            if (plotDay.data.timeseries !== undefined) {
                const existingTss = plotDay.data?.timeseries
                    .filter(t => t.gas === gas)
                    .filter(t => t.location === location);
                if (existingTss.length !== 0) {
                    timeseries.push(existingTss[0]);
                    tsAdded = true;
                }
            }
            if (!tsAdded) {
                timeseries.push({
                    gas,
                    location,
                    count: 0,
                    data: { xs: [], ys: [] },
                });
            }
            if (plotDay.data.rawTimeseries !== undefined) {
                const existingTss = plotDay.data?.rawTimeseries
                    .filter(t => t.gas === gas)
                    .filter(t => t.location === location);
                if (existingTss.length !== 0) {
                    rawTimeseries.push(existingTss[0]);
                    continue;
                }
            }
            rawTimeseries.push({
                gas,
                location,
                count: 0,
                data: { xs: [], ys: [] },
            });
        }
    }
    return { timeseries, rawTimeseries };
}
