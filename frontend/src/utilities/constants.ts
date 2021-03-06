import types from '../types';

const constants: {
    GASES: types.gas[];
    MONTH_LABEL: string[];
    PLOT: any;
    DOMAINS: types.PlotDomain;
    UNITS: { [key in types.gas]: string };
    FLAGS: number[];
    LOCATION_LABELS: { [key: string]: string };
} = {
    GASES: ['co2', 'ch4', 'co'],
    MONTH_LABEL: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ],
    PLOT: {
        width: 1000,
        height: 400,
        paddingRight: 18,
        paddingTop: 10,
    },

    DOMAINS: {
        time: {
            from: 4,
            to: 18,
            step: 1,
        },
        co2: {
            from: 405, //407,
            to: 420, //417,
            step: 1.5,
        },
        ch4: {
            from: 1.875,
            to: 1.92,
            step: 0.005,
        },
        co: {
            from: 80,
            to: 130,
            step: 5,
        },
    },

    UNITS: {
        co2: 'ppm',
        ch4: 'ppm',
        co: 'ppb',
    },
    FLAGS: [21, 8, 15, 33, 39, 37, 25, 24, 31],
    LOCATION_LABELS: {
        TUM_I: 'Center, TUM',
        FEL: 'East, Feldkirchen',
        GRAE: 'West, Gräfelfing',
        OBE: 'North, Oberschleißheim',
        TAU: 'South, Taufkirchen',
        HAW: 'East, HAW Bergedorf',
        GEO: 'Center, Geomatikum',
        ROS: 'South, Rosengarten',
        JOR: 'West, Schulzentrum Jork',
    },
};

export default constants;
