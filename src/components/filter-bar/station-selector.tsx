import React from 'react';
import types from 'types';

export default function StationSelector(props: {
    stations: types.stationMeta[];
    visibleStations: boolean[];
    setVisibleStations(s: boolean[]): void;
}) {
    const { stations, visibleStations, setVisibleStations } = props;

    const handleClick = (index: number) => () => {
        setVisibleStations(
            visibleStations.map((c, i) => (i !== index ? c : !c))
        );
    };

    return (
        <fieldset className='flex-shrink-0 space-y-1.5'>
            {stations.map((s, i) => (
                <div className='relative flex items-start'>
                    <div className='flex items-center h-5'>
                        <input
                            checked={visibleStations[i]}
                            onClick={handleClick(i)}
                            type='checkbox'
                            className='w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500'
                        />
                    </div>
                    <div className='ml-3 text-sm'>
                        <label
                            htmlFor='comments'
                            className='font-medium text-gray-700'
                        >
                            {s.location}
                        </label>
                        <span
                            id='comments-description'
                            className='text-gray-500'
                        >
                            {' '}
                            ({s.sensor})
                        </span>
                    </div>
                </div>
            ))}
        </fieldset>
    );
}
