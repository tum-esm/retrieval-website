namespace types {
    export type dataPoint = { x: number; y: number };

    export type plotAxisDomain = {
        from: number;
        to: number;
        step: number;
    };

    export type plotDomain = {
        [key in 'time' | 'co2' | 'ch4']: plotAxisDomain;
    };

    export type gas = 'co2' | 'ch4';

    export type dayObject = { year: string; month: string; day: string };
    export type monthObject = { year: string; month: string };
    export type gasMeta = { name: gas; unit: string };
    export type stationMeta = { location: string; sensor: string };

    export type plotMeta = {
        id: number;
        campaignId: string;
        data: {
            gases: gasMeta[];
            stations: stationMeta[];
            flags: number[];
            days: string[];
            hiddenDays: [];
            calibrationDays: {
                [key: string]: string;
            };
            startDate: string;
            displayDay: string;
        };
    };

    export type plotDay = {
        date: string;
        data: {
            timeseries?: gasTimeseries[];
            rawTimeseries?: gasTimeseries[];
            flagTimeseries?: flagTimeseries[];
        };
    };

    export type localPlotDay = {
        date: string;
        data: {
            timeseries?: localGasTimeseries[];
            rawTimeseries?: localGasTimeseries[];
            flagTimeseries?: localFlagTimeseries[];
        };
    };

    export type gasTimeseries = {
        gas: string;
        sensor: string;
        count: number;
        data: timeseriesData;
    };

    export type flagTimeseries = {
        sensor: string;
        count: number;
        data: timeseriesData;
    };

    export type timeseriesData = {
        xs: number[];
        ys: number[];
    };

    export type localGasTimeseries = {
        gas: string;
        sensor: string;
        count: number;
        data: localTimeseriesData;
    };

    export type localFlagTimeseries = {
        sensor: string;
        count: number;
        data: localTimeseriesData;
    };

    export type localTimeseriesData = number[][];
}

export default types;
