namespace types {
    export type Campaign = {
        identifier: string;
        locations: string[];
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
        rawCount?: number;
        rawTimeseries?: Timeseries;
        flagCount?: number;
        flagTimeseries?: Timeseries;
    };

    export type Timeseries = {
        xs: number[];
        ys: number[];
    };
}

export default types;
