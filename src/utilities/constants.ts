import types from '../types';

const constants: {
    MONTH_LABEL: string[];
    PLOT: any;
    DOMAINS: types.PlotDomain;
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
        height: 400,
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
            to: 1.915,
            step: 0.005,
        },
        co: {
            from: 1.875,
            to: 1.915,
            step: 0.005,
        },
    },
};

export default constants;
