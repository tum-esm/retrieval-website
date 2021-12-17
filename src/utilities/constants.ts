import types from '../types';

const constants: {
    MONTH_LABEL: string[];
    PLOT: any;
    DOMAINS: types.PlotDomain;
    UNITS: { [key in 'co2' | 'ch4' | 'co']: string };
    FLAGS: number[];
} = {
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
        'Dev',
    ],
    PLOT: {
        width: 1000,
        height: 350,
        paddingRight: 18,
        paddingTop: 10,
    },

    DOMAINS: {
        time: {
            from: 5.5,
            to: 17.5,
            step: 1,
        },
        co2: {
            from: 405, //407,
            to: 414, //417,
            step: 1,
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
};

export default constants;
