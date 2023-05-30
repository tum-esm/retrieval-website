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

    // {JSON.stringify(calendarData, null, 2)}

    return (
        <main className='flex flex-col w-screen min-h-screen p-12 gap-y-4'>
            <h1 className='text-3xl font-medium'>TUM ESM Retrieval Website</h1>
            <h2 className='text-2xl font-medium'>Proffast 2.2 Data</h2>
            {Object.keys(calendarData).map((year, index) => (
                <>
                    <h3 className='text-xl'>{year}</h3>
                    <div className='grid grid-cols-4 gap-x-4 gap-y-4'>
                        {Object.keys(calendarData[parseInt(year)]).map(
                            month => (
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
                            )
                        )}
                    </div>
                </>
            ))}
        </main>
    );
}
