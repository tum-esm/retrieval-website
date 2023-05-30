import { range } from 'lodash';
import Link from 'next/link';

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

    const getBgColor = (day: number): string => {
        const measurementCount = dailyMeasurementCounts[day];
        if (measurementCount === undefined || measurementCount === 0) {
            return 'bg-gray-200 text-gray-400';
        } else if (measurementCount < 500) {
            return 'bg-green-300 text-green-800';
        } else if (measurementCount < 1500) {
            return 'bg-green-400 text-green-900';
        } else {
            return 'bg-green-500 text-green-950';
        }
    };

    return (
        <div className='flex flex-col w-full gap-y-1'>
            <div className='flex flex-row h-5 gap-x-1'>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                    <div
                        className={
                            'rounded-sm w-[calc((1/7)*100%)] h-5 ' +
                            'flex items-center justify-center ' +
                            'text-xs font-medium text-gray-300'
                        }
                    >
                        {day}
                    </div>
                ))}
            </div>
            {range(0, weekCount).map(weekIndex => (
                <div className='flex flex-row h-5 gap-x-1' key={weekIndex}>
                    {range(0, 7).map(dayIndex => {
                        const day = weekIndex * 7 + dayIndex + 1 - firstWeekday;
                        if (day < 1 || day > daysInMonth) {
                            return <div className='w-[calc((1/7)*100%)] h-5' />;
                        }
                        return (
                            <Link
                                className={
                                    'rounded-sm w-[calc((1/7)*100%)] h-5 ' +
                                    'flex items-center justify-center ' +
                                    'text-sm font-medium ' +
                                    getBgColor(day)
                                }
                                key={day}
                                href={
                                    `/${props.identifier.year}-` +
                                    `${props.identifier.month < 10 ? '0' : ''}${
                                        props.identifier.month
                                    }-` +
                                    `${day < 10 ? '0' : ''}${day}`
                                }
                            >
                                {day}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
