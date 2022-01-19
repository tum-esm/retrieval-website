export function getSpectrometerColor(sensor: string) {
    switch (sensor) {
        case 'ma61':
            return '#60A5FA'; // blue-400
        case 'mb86':
            return '#a78bfa'; // violet-400
        case 'mc15':
            return '#f87171'; // red-400
        case 'md16':
            return '#fbbf24'; // amber-400
        case 'me17':
            return '#34D399'; // emerald-400
        default:
            return '#9CA3AF'; // coolgray-400
    }
}
