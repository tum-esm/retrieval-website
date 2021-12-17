export function getSpectrometerColor(sensor: string) {
    switch (sensor) {
        case 'mb86':
            return '#F87171'; // red-400
        case 'mc15':
            return '#34D399'; // emerald-400
        case 'md16':
            return '#60A5FA'; // blue-400
        case 'me17':
            return '#FBBF24'; // amber-400
        default:
            return '#9CA3AF'; // coolgray-400
    }
}
