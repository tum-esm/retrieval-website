import { fetchDataHeatmap } from '@/app/lib/fetch-data-heatmap';
import { fetchDayMeasurementData } from '@/app/lib/fetch-measurement-data';
import Link from 'next/link';

export async function generateStaticParams() {
    const dataHeatmap = await fetchDataHeatmap();
    return dataHeatmap.map(item => ({
        date: item.utc.substring(0, 10),
    }));
}

export default async function Page({ params }: { params: { date: string } }) {
    const data = await fetchDayMeasurementData(params.date);

    let sensorLocations: { [key: string]: string | undefined } = {
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
    data.forEach(item => {
        if (['ma', 'mb', 'mc', 'md', 'me'].includes(item.sensor_id)) {
            sensorLocations[item.sensor_id] = item.location_id;
        }
    });
    const sensorBgColors: { [key: string]: string } = {
        ma: sensorLocations.ma === undefined ? 'bg-slate-300' : 'bg-blue-500',
        mb: sensorLocations.mb === undefined ? 'bg-slate-300' : 'bg-purple-500',
        mc: sensorLocations.mc === undefined ? 'bg-slate-300' : 'bg-rose-500',
        md: sensorLocations.md === undefined ? 'bg-slate-300' : 'bg-amber-500',
        me: sensorLocations.me === undefined ? 'bg-slate-300' : 'bg-green-500',
    };

    console.log(sensorLocations);

    const plottedProperties = [
        {
            name: 'xco2',
            displayName: 'XCO2',
            unit: 'ppm',
        },
        {
            name: 'xch4',
            displayName: 'XCH4',
            unit: 'ppm',
        },
        {
            name: 'groundPressure',
            displayName: 'Ground Pressure',
            unit: 'hPa',
        },
        {
            name: 'solarZenithAngle',
            displayName: 'Solar Zenith Angle',
            unit: '°',
        },
        {
            name: 'solarAzimuthAngle',
            displayName: 'Solar Azimuth Angle',
            unit: '°',
        },
    ];

    return (
        <>
            <main className='w-screen min-h-screen'>
                <div
                    className={
                        'fixed top-0 left-0 w-[24rem] h-screen bg-slate-100 p-6 space-y-2 ' +
                        'z-0 border-r border-slate-300'
                    }
                >
                    <h1 className='w-full text-lg text-center'>
                        Proffast 2.2 Outputs |{' '}
                        <span className='font-semibold'>{params.date}</span>
                    </h1>
                    <h2 className='pt-8 font-medium'>TUM ESM Sensors:</h2>
                    <div className='flex-col space-y-1 overflow-hidden'>
                        {Object.entries(sensorLocations).map(
                            ([sensorId, locationId]) => (
                                <div
                                    className={
                                        'flex flex-row items-center px-3 py-1 rounded ' +
                                        'border text-sm ' +
                                        (locationId === undefined
                                            ? 'cursor-not-allowed bg-slate-50 border-slate-200 '
                                            : 'bg-white hover:bg-slate-50 cursor-pointer border-slate-300')
                                    }
                                >
                                    <div
                                        className={
                                            'w-2.5 h-2.5 mr-2 rounded-sm ' +
                                            sensorBgColors[sensorId]
                                        }
                                    />
                                    <div
                                        className={
                                            'font-semibold w-14 ' +
                                            (locationId === undefined
                                                ? 'text-slate-400'
                                                : 'text-slate-950')
                                        }
                                    >
                                        {sensorId}
                                        {serialNumbers[sensorId]}
                                    </div>{' '}
                                    {locationId === undefined && (
                                        <span className='text-slate-400'>
                                            (no data)
                                        </span>
                                    )}
                                    {locationId !== undefined && (
                                        <span className='text-slate-800'>
                                            @ {locationId}
                                        </span>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                    <h2 className='pt-8 font-medium'>Plotted Properties:</h2>
                    <div className='flex-col space-y-1 overflow-hidden'>
                        {plottedProperties.map(property => (
                            <Link
                                className={
                                    'underline text-sm font-medium text-slate-500 block'
                                }
                                href={`/${params.date}#${property.name}`}
                            >
                                {property.displayName} [{property.unit}]
                            </Link>
                        ))}
                    </div>
                </div>
                <div className='relative left-[24rem] p-6 z-20 overflow-y-visible w-[calc(100vw-24rem)] min-h-screen'>
                    <h1 className='my-2 text-2xl font-semibold' id='xco2'>
                        XCO2
                    </h1>
                    <div className='h-[30rem] w-full bg-red-100 rounded' />
                    <h1 className='my-2 text-2xl font-semibold' id='xch4'>
                        XCH4
                    </h1>
                    <div className='h-[30rem] w-full bg-red-100 rounded' />
                    <h1
                        className='my-2 text-2xl font-semibold'
                        id='groundPressure'
                    >
                        Ground Pressure
                    </h1>
                    <div className='h-[30rem] w-full bg-red-100 rounded' />
                    <h1
                        className='my-2 text-2xl font-semibold'
                        id='solarZenithAngle'
                    >
                        Solar Zenith Angle
                    </h1>
                    <div className='h-[30rem] w-full bg-red-100 rounded' />
                    <h1
                        className='my-2 text-2xl font-semibold'
                        id='solarAzimuthAngle'
                    >
                        Solar Azimuth Angle
                    </h1>
                    <div className='h-[30rem] w-full bg-red-100 rounded' />
                </div>
            </main>
        </>
    );
}
