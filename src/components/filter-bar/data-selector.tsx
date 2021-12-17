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
            <span className='relative z-0 rounded-md shadow flex-col-center'>
                {props.spectrometers.map((spectrometer, i) => (
                    <button
                        key={spectrometer}
                        type='button'
                        className={
                            'relative min-w-[11rem] flex-row-left px-3 py-1.5 font-weight-600 ' +
                            'font-weight-600 text-sm font-medium border-gray-300 ' +
                            'border-t border-b first:border-t-0 last:border-b-0' +
                            (props.selectedSpectrometers.includes(spectrometer)
                                ? 'text-gray-900 bg-white '
                                : 'text-gray-400 bg-gray-200 hover:bg-gray-100 ') +
                            'z-0 focus:z-10 focus:outline-none focus:ring-1 ' +
                            'focus:ring-indigo-500 focus:border-transparent ' +
                            (i === 0 ? 'rounded-t-md ' : ' ') +
                            (i > 0 ? '-mt-px ' : ' ') +
                            (i === props.spectrometers.length - 1
                                ? 'rounded-b-md '
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
                        <input
                            type='checkbox'
                            checked={props.selectedSpectrometers.includes(
                                spectrometer
                            )}
                            className='mr-1.5 pointer-events-none'
                            readOnly
                        />
                        <span className='mr-1 font-weight-600'>
                            {spectrometer}
                        </span>
                        <span className='font-weight-400'>
                            ({props.locations[i]})
                        </span>
                        <div className='flex-grow' />
                        <div
                            className={
                                'w-3 h-3 bg-gray-300 rounded ' +
                                (props.selectedSpectrometers.includes(
                                    spectrometer
                                )
                                    ? 'opacity-100 '
                                    : 'opacity-40 ')
                            }
                            style={{
                                backgroundColor:
                                    getSpectrometerColor(spectrometer),
                            }}
                        />
                    </button>
                ))}
            </span>
            <span className='relative z-0 rounded-md shadow flex-col-center'>
                {props.campaign.gases.map((gas, i) => (
                    <button
                        key={gas}
                        type='button'
                        className={
                            'relative min-w-[7.5rem] flex-row-left px-3 py-1.5 font-weight-600 ' +
                            'font-weight-600 text-sm font-medium border-gray-300 ' +
                            'border-t border-b first:border-t-0 last:border-b-0' +
                            (props.selectedGas === gas
                                ? 'text-gray-900 bg-white '
                                : 'text-gray-400 bg-gray-200 hover:bg-gray-100 ') +
                            'z-0 focus:z-10 focus:outline-none focus:ring-1 ' +
                            'focus:ring-indigo-500 focus:border-transparent ' +
                            (i === 0 ? 'rounded-t-md ' : ' ') +
                            (i > 0 ? '-mt-px ' : ' ') +
                            (i === props.campaign.gases.length - 1
                                ? 'rounded-b-md '
                                : ' ')
                        }
                        onClick={() => props.setSelectedGas(gas)}
                    >
                        <input
                            type='radio'
                            checked={props.selectedGas === gas}
                            className='mr-1.5 pointer-events-none'
                            readOnly
                        />
                        <span className='mr-1 font-weight-600'>{gas}</span>
                        <span className='font-weight-400'>
                            [{constants.UNITS[gas]}]
                        </span>
                    </button>
                ))}
            </span>
        </div>
    );
}
