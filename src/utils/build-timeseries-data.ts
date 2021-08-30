import { zip } from 'lodash';
import types from 'types';

export default function buildTimeseriesData(
    gases: types.gasMeta[],
    stations: types.stationMeta[],
    plotDay: types.plotDay,
    domains: types.plotDomain
) {
    let timeseries: types.localGasTimeseries[] = [];
    let rawTimeseries: types.localGasTimeseries[] = [];
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
                    const newTs: any = {
                        gas: gas,
                        location: location,
                        count: existingTss[0].count,
                        data: zip(
                            existingTss[0].data.xs,
                            existingTss[0].data.ys
                        ).filter(
                            (d: any) =>
                                d[0] > domains.time.from &&
                                d[0] < domains.time.to &&
                                d[1] < domains[gas].to &&
                                d[1] < domains[gas].to
                        ),
                    };
                    timeseries.push(newTs);
                    tsAdded = true;
                }
            }
            if (!tsAdded) {
                timeseries.push({
                    gas,
                    location,
                    count: 0,
                    data: [],
                });
            }
            if (plotDay.data.rawTimeseries !== undefined) {
                const existingTss = plotDay.data?.rawTimeseries
                    .filter(t => t.gas === gas)
                    .filter(t => t.location === location);
                if (existingTss.length !== 0) {
                    const newTs: any = {
                        gas: gas,
                        location: location,
                        count: existingTss[0].count,
                        data: zip(
                            existingTss[0].data.xs,
                            existingTss[0].data.ys
                        ).filter(
                            (d: any) =>
                                d[0] > domains.time.from &&
                                d[0] < domains.time.to &&
                                d[1] > domains[gas].from &&
                                d[1] < domains[gas].to
                        ),
                    };
                    rawTimeseries.push(newTs);
                    continue;
                }
            }
            rawTimeseries.push({
                gas,
                location,
                count: 0,
                data: [],
            });
        }
    }
    return { timeseries, rawTimeseries };
}
