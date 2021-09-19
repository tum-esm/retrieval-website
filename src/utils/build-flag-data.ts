import { zip } from 'lodash';
import types from 'types';

export default function buildFlagData(
    stations: types.stationMeta[],
    plotDay: types.plotDay,
    domains: types.plotDomain
) {
    let flagTimeseries: types.localFlagTimeseries[] = [];

    for (let j = 0; j < stations.length; j++) {
        const sensor = stations[j].sensor;
        let tsAdded = false;

        if (plotDay.data.flagTimeseries !== undefined) {
            const existingTss = plotDay.data.flagTimeseries.filter(
                t => t.sensor === sensor
            );
            if (existingTss.length !== 0) {
                const newFts: any = {
                    sensor: sensor,
                    count: existingTss[0].count,
                    data: zip(
                        existingTss[0].data.xs,
                        existingTss[0].data.ys
                    ).filter(
                        (d: any) =>
                            d[0] > domains.time.from && d[0] < domains.time.to
                    ),
                };
                flagTimeseries.push(newFts);
                tsAdded = true;
            }
        }
        if (!tsAdded) {
            flagTimeseries.push({
                sensor,
                count: 0,
                data: [],
            });
        }
    }

    return { flagTimeseries };
}
