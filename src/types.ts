namespace types {
    export type Campaign = {
        identifier: string;
        locations: string[];
        spectrometers: string[];
        gases: types.gas[];
        public: boolean;
        listed: boolean;
        startDate: string;
        endDate: string;
        displayDate: string;
    };

    export type SensorDay = {
        date: string;
        gas: types.gas;
        location: string;
        spectrometer: string;
        filteredCount: number;
        filteredTimeseries: Timeseries;
        rawCount: number;
        rawTimeseries: Timeseries;
        flagCount: number;
        flagTimeseries: Timeseries;
    };

    export type Timeseries = {
        xs: number[];
        ys: number[];
    };

    export type PlotAxisDomain = {
        from: number;
        to: number;
        step: number;
    };

    export type PlotDomain = {
        [key in 'time' | types.gas]: PlotAxisDomain;
    };

    export type monthlyDomain = {
        [key in types.gas]: {
            [key: string]: { std: number; avg: number };
        };
    };

    export type gas = 'co2' | 'ch4' | 'co';
}

export default types;
