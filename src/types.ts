namespace types {
    export type Campaign = {
        identifier: string;
        locations: string[];
        spectrometers: string[];
        gases: string[];
        public: boolean;
        listed: boolean;
        startDate: string;
        endDate: string;
        displayDate: string;
    };

    export type SensorDay = {
        date: string;
        gas: string;
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
        [key in 'time' | 'co2' | 'ch4']: PlotAxisDomain;
    };
}

export default types;
