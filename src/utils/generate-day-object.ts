function generateDayObject(dayStrings: string[]) {
    const dayObject: {
        [key: string]: {
            [key: string]: string[];
        };
    } = {};
    for (let i = 0; i < dayStrings.length; i++) {
        const year = dayStrings[i].substring(0, 4);
        const month = dayStrings[i].substring(4, 6);
        const day = dayStrings[i].substring(6);
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
