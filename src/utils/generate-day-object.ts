import getDayObjectFromString from './get-day-object-from-string';

function generateDayObject(dayStrings: string[]) {
    const dayObject: {
        [key: string]: {
            [key: string]: string[];
        };
    } = {};
    for (let i = 0; i < dayStrings.length; i++) {
        const { year, month, day } = getDayObjectFromString(dayStrings[i]);
        if (!Object.keys(dayObject).includes(year)) {
            dayObject[year] = {};
        }
        if (!Object.keys(dayObject[year]).includes(month)) {
            dayObject[year][month] = [];
        }
        dayObject[year][month].push(day);
    }

    Object.keys(dayObject).forEach(year => {
        Object.keys(dayObject[year]).forEach(month => {
            dayObject[year][month].sort();
        });
    });
    return dayObject;
}

export default generateDayObject;
