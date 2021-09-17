import React from 'react';
import types from 'types';
import { getSensorColor } from 'utils/d3-elements/circles-and-lines';

export default function StationSelector(props: {
    stations: types.stationMeta[];
    visibleStations: boolean[];
    dayObject: types.dayObject;
    calibrationDays: { [key: string]: string };
    setVisibleStations(s: boolean[]): void;
}) {
    const { stations, visibleStations, setVisibleStations } = props;

    const handleClick = (index: number) => () => {
        setVisibleStations(
            visibleStations.map((c, i) => (i !== index ? c : !c))
        );
    };

    const { year, month, day } = props.dayObject;
    const isCalibrationDay =
        props.calibrationDays[`${year}${month}${day}`] !== undefined;

    return (
        <fieldset className='flex-shrink-0 space-y-1'>
            {stations.map((s, i) => (
                <div
                    key={s.sensor}
                    className='relative flex items-start px-2 bg-gray-700 rounded py-0.5'
                >
                    <div className='flex items-center h-5'>
                        <input
                            checked={visibleStations[i]}
                            onChange={handleClick(i)}
                            onClick={handleClick(i)}
                            type='checkbox'
                            className='w-4 h-4 border-gray-300 rounded focus:ring-green-500'
                        />
                    </div>
                    <div
                        className='ml-3 text-sm'
                        style={{
                            color: getSensorColor(s.sensor),
                        }}
                    >
                        <label htmlFor='comments' className='font-medium'>
                            {s.sensor}
                        </label>
                        <span id='comments-description' className='opacity-80'>
                            {' '}
                            (
                            {isCalibrationDay
                                ? props.calibrationDays[
                                      `${year}${month}${day}`
                                  ] + ' - calibration'
                                : s.location}
                            )
                        </span>
                    </div>
                </div>
            ))}
        </fieldset>
    );
}
