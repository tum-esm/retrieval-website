const colors = require('tailwindcss/colors');
const customColors = {
    // Primary
    blue: {
        50: '#DCEEFB',
        100: '#B6E0FE',
        200: '#84C5F4',
        300: '#62B0E8',
        400: '#4098D7',
        500: '#2680C2',
        600: '#186FAF',
        700: '#0F609B',
        800: '#0A558C',
        900: '#003E6B',
    },

    // Neutrals
    gray: colors.blueGray,

    green: {
        50: '#F0FCF9',
        100: '#C6F7E9',
        200: '#8EEDD1',
        300: '#5FE3C0',
        400: '#2DCCA7',
        500: '#17B897',
        600: '#079A82',
        700: '#048271',
        800: '#016457',
        900: '#004440',
    },

    red: {
        50: '#FFEEEE',
        100: '#FACDCD',
        200: '#F29B9B',
        300: '#E66A6A',
        400: '#D64545',
        500: '#BA2525',
        600: '#A61B1B',
        700: '#911111',
        800: '#780A0A',
        900: '#610404',
    },

    yellow: {
        50: '#FFFAEB',
        100: '#FCEFC7',
        200: '#F8E3A3',
        300: '#F9DA8B',
        400: '#F7D070',
        500: '#E9B949',
        600: '#C99A2E',
        700: '#A27C1A',
        800: '#7C5E10',
        900: '#513C06',
    },

    orange: colors.orange,
    teal: colors.teal,
    rose: colors.rose,
};

module.exports = {
    mode: 'jit',
    purge: [
        './src/pages/**/*.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
        './src/assets/**/*.{js,jsx,ts,tsx}',
        './src/utils/**/*.{js,jsx,ts,tsx}',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: customColors,
            fill: customColors,
        },
    },
    variants: {
        extend: {},
    },
};
