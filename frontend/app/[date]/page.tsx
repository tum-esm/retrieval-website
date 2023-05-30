import { fetchDataHeatmap } from '@/app/lib/fetch-data-heatmap';
import { fetchDayMeasurementData } from '@/app/lib/fetch-measurement-data';

export async function generateStaticParams() {
    const dataHeatmap = await fetchDataHeatmap();
    return dataHeatmap.map(item => ({
        date: item.utc.substring(0, 10),
    }));
}

export default async function Page({ params }: { params: { date: string } }) {
    console.log('fetching');
    const data = await fetchDayMeasurementData(params.date);

    const sensorLocations: { [key: string]: string | undefined } = {
        ma: undefined,
        mb: undefined,
        mc: undefined,
        md: undefined,
        me: undefined,
    };
    const serialNumbers: { [key: string]: number } = {
        ma: 61,
        mb: 86,
        mc: 115,
        md: 116,
        me: 117,
    };
    const sensorBgColors: { [key: string]: string } = {
        ma: 'bg-blue-500',
        mb: 'bg-purple-500',
        mc: 'bg-rose-500',
        md: 'bg-amber-500',
        me: 'bg-green-500',
    };

    data.forEach(item => {
        if (['ma', 'mb', 'mc', 'md', 'me'].includes(item.sensor_id)) {
            sensorLocations[item.sensor_id] = item.location_id;
        }
    });

    return (
        <>
            <main className='w-screen min-h-screen'>
                <div className='fixed top-0 left-0 w-[24rem] h-screen bg-slate-100 p-6 space-y-4'>
                    <h1 className='w-full text-lg text-center'>
                        Proffast 2.2 Outputs |{' '}
                        <span className='font-semibold'>{params.date}</span>
                    </h1>
                    <div className='flex-col overflow-hidden border divide-y rounded shadow divide-slate-300 border-slate-300'>
                        {Object.entries(sensorLocations).map(
                            ([sensorId, locationId]) => (
                                <div className='flex flex-row items-center px-3 py-1.5 bg-white'>
                                    <div
                                        className={
                                            'w-2.5 h-2.5 mr-2 rounded-sm ' +
                                            sensorBgColors[sensorId]
                                        }
                                    />
                                    <div className='inline font-semibold w-14'>
                                        {sensorId}
                                        {serialNumbers[sensorId]}
                                    </div>{' '}
                                    <span className='text-slate-500'>
                                        {locationId === undefined
                                            ? '(no data)'
                                            : `@ ${locationId}`}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className='relative left-[24rem] p-6 overflow-y-visible w-[calc(100vw-24rem)]'>
                    Duis aliquip sit commodo anim cupidatat anim consequat
                    fugiat dolor non cupidatat esse veniam. Irure ullamco minim
                    in reprehenderit laboris deserunt enim nostrud in. Pariatur
                    Lorem voluptate elit dolore officia. Ea ad laboris quis sunt
                    quis aute do. In dolor ex consectetur consequat labore minim
                    nisi non anim aliquip exercitation occaecat consequat. Non
                    excepteur in non amet amet nostrud ex est pariatur minim
                    labore dolore sint.
                </div>
            </main>
        </>
    );
}
