import { fetchDataHeatmap } from '@/app/lib/fetch-data-heatmap';
import { HeatmapItemType } from '@/app/lib/custom-types';
import CalendarMonth from '@/app/components/calendar-month';

export default async function Page() {
    const dataHeatmap = await fetchDataHeatmap();

    const calendarData: {
        [key: number]: {
            [key: number]: HeatmapItemType[];
        };
    } = {};
    dataHeatmap.forEach(d => {
        const date = new Date(d.utc.substring(0, 10));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        if (!calendarData[year]) {
            calendarData[year] = {};
            for (let i = 1; i <= 12; i++) {
                calendarData[year][i] = [];
            }
        }
        calendarData[year][month].push(d);
    });

    // translate month number to month name

    return (
        <main className='flex flex-col items-center w-screen min-h-screen p-12 gap-y-4'>
            <h1 className='text-3xl font-medium'>TUM ESM Retrieval Website</h1>
            <h2 className='text-2xl font-medium'>Proffast 2.2 Data</h2>
            {Object.keys(calendarData).map((year, index) => (
                <div className='w-full max-w-6xl'>
                    <h3 className='pb-2 text-xl font-semibold'>{year}</h3>
                    <div className='grid grid-cols-4 gap-x-6 gap-y-6'>
                        {Object.keys(calendarData[parseInt(year)]).map(
                            month => (
                                <div className='flex flex-col w-full'>
                                    <h4
                                        className={
                                            'w-full pb-1 text-base font-medium text-left ' +
                                            'text-slate-800 '
                                        }
                                    >
                                        {new Date(
                                            parseInt(year),
                                            parseInt(month) - 1,
                                            1
                                        ).toLocaleString('en-us', {
                                            month: 'short',
                                        })}
                                    </h4>
                                    <CalendarMonth
                                        identifier={{
                                            year: parseInt(year),
                                            month: parseInt(month),
                                        }}
                                        key={month}
                                        data={
                                            calendarData[parseInt(year)][
                                                parseInt(month)
                                            ]
                                        }
                                    />
                                </div>
                            )
                        )}
                    </div>
                    <div className='w-full h-px my-6 bg-slate-300' />
                </div>
            ))}
        </main>
    );
}
