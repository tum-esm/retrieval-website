import { range } from 'lodash';

function getDaysInMonth(p: { month: number; year: number }): number {
    return new Date(p.year, p.month, 0).getDate();
}

function getFirstWeekday(p: { month: number; year: number }): number {
    // the month parameter is 1-indexed, and the returned value is 0-indexed
    return new Date(p.year, p.month - 1, 0).getDay();
}

export default function CalendarMonth(props: {
    identifier: {
        month: number;
        year: number;
    };
    data: {
        utc: string;
        total: number;
    }[];
}) {
    const firstWeekday = getFirstWeekday(props.identifier);
    const daysInMonth = getDaysInMonth(props.identifier);
    const dailyMeasurementCounts: { [key: number]: number } = {};
    props.data.forEach(d => {
        const day = new Date(d.utc.substring(0, 10)).getDate();
        dailyMeasurementCounts[day] = d.total;
    });
    const weekCount = Math.ceil((firstWeekday + daysInMonth) / 7);

    return (
        <div className='flex flex-col bg-red-600 gap-y-1'>
            {range(0, weekCount).map(weekIndex => (
                <div
                    className='flex flex-row bg-red-400 gap-x-1'
                    key={weekIndex}
                >
                    {range(0, 7).map(dayIndex => {
                        const day = weekIndex * 7 + dayIndex + 1 - firstWeekday;
                        const measurementCount = dailyMeasurementCounts[day];
                        return (
                            <div
                                className='inline bg-red-200 calendar-day'
                                key={day}
                            >
                                <div className='calendar-day-number'>{day}</div>
                                <div className='calendar-day-measurement-count'>
                                    {measurementCount}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
