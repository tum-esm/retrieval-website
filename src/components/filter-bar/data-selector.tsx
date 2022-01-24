import React from 'react';
import types from '../../types';
import { getSpectrometerColor } from '../../utilities/colors';
import constants from '../../utilities/constants';

export default function DataSelector(props: {
    campaign: types.Campaign;
    selectedGas: string;
    setSelectedGas(g: string): void;
    spectrometers: string[];
    locations: string[];
    selectedSpectrometers: string[];
    setSelectedSpectrometers(ss: string[]): void;
}) {
    return (
        <div className='flex-row-top gap-x-3'>
            <div className='relative z-0 divide-y divide-gray-200 rounded shadow flex-col-center'>
                {props.spectrometers.map((spectrometer, i) => (
                    <button
                        key={spectrometer}
                        type='button'
                        className={
                            'relative min-w-[11rem] w-full flex-row-left px-3 py-1.5 ' +
                            'font-weight-600 text-sm font-medium border-gray-300 ' +
                            (props.selectedSpectrometers.includes(spectrometer)
                                ? 'text-gray-900 bg-white '
                                : 'text-gray-500 bg-gray-100 hover:bg-white ') +
                            'z-0 focus:z-10 focus:outline-none focus:ring-1 ' +
                            'focus:ring-indigo-500 focus:border-transparent ' +
                            (i === 0 ? 'rounded-t ' : ' ') +
                            (i === props.spectrometers.length - 1
                                ? 'rounded-b '
                                : ' ')
                        }
                        onClick={() =>
                            props.setSelectedSpectrometers(
                                props.selectedSpectrometers.includes(
                                    spectrometer
                                )
                                    ? [...props.selectedSpectrometers].filter(
                                          s => s !== spectrometer
                                      )
                                    : [
                                          ...props.selectedSpectrometers,
                                          spectrometer,
                                      ]
                            )
                        }
                    >
                        <div
                            className={
                                'w-3 h-3 mr-2 rounded-sm ' +
                                (props.selectedSpectrometers.includes(
                                    spectrometer
                                )
                                    ? ' '
                                    : '!bg-gray-300 ')
                            }
                            style={{
                                backgroundColor:
                                    getSpectrometerColor(spectrometer),
                            }}
                        />
                        <span className='mr-1 font-mono font-weight-600'>
                            {spectrometer}
                        </span>
                        <span className='font-weight-400'>
                            (
                            {constants.LOCATION_LABELS[props.locations[i]] !==
                            undefined
                                ? constants.LOCATION_LABELS[props.locations[i]]
                                : props.locations[i]}
                            )
                        </span>
                    </button>
                ))}
            </div>
            <div className='relative z-0 divide-y divide-gray-200 rounded shadow flex-col-center'>
                {props.campaign.gases.map((gas, i) => (
                    <button
                        key={gas}
                        className={
                            'relative min-w-[5rem] flex-row-left px-3 py-1.5 ' +
                            'font-weight-600 text-sm font-medium border-gray-300 ' +
                            (props.selectedGas === gas
                                ? 'text-gray-900 bg-white '
                                : 'text-gray-500 bg-gray-100 hover:bg-white ') +
                            'z-0 focus:z-10 focus:outline-none focus:ring-1 ' +
                            'focus:ring-indigo-500 focus:border-transparent ' +
                            (i === 0 ? 'rounded-t ' : ' ') +
                            (i === props.campaign.gases.length - 1
                                ? 'rounded-b '
                                : ' ')
                        }
                        onClick={() => props.setSelectedGas(gas)}
                    >
                        <div
                            className={
                                'w-3 h-3 mr-2 rounded-sm ' +
                                (props.selectedGas === gas
                                    ? 'bg-gray-900 '
                                    : 'bg-gray-300')
                            }
                        />
                        <div className='flex flex-row mr-1 font-weight-600'>
                            {gas === 'co2' && (
                                <>
                                    CO
                                    <div className='scale-[80%] font-weight-700 translate-y-1'>
                                        2
                                    </div>
                                </>
                            )}
                            {gas === 'ch4' && (
                                <>
                                    CH
                                    <div className='scale-[80%] font-weight-700 translate-y-1'>
                                        4
                                    </div>
                                </>
                            )}
                            {gas === 'co' && <>CO</>}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
