function getDayObjectFromString(dayString: string) {
    return {
        year: dayString.substring(0, 4),
        month: dayString.substring(4, 6),
        day: dayString.substring(6),
    };
}

export default getDayObjectFromString;
