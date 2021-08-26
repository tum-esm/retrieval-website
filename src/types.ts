namespace types {
    export type dataPoint = { x: number; y: number };

    export type plotDayData = {
        hours: number[];
        timeseries: {
            gas: 'co2' | 'ch4';
            location: string;
            data: number[];
        }[];
    };

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
}

export default types;
