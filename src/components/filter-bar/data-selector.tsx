import { pullAll } from 'lodash';
import React from 'react';
import types from '../../types';

export default function DataSelector(props: {
    campaign: types.Campaign;
    selectedGas: string;
    setSelectedGas(g: string): void;
    spectrometers: string[];
    locations: string[];
    selectedSpectrometers: string[];
    setSelectedSpectrometers(ss: string[]): void;
}) {
    console.log(props.selectedSpectrometers);
    return (
        <div className='flex-row-top gap-x-3'>
            <span className='relative z-0 bg-gray-300 rounded-md shadow flex-col-center gap-y-px'>
                {props.spectrometers.map((spectrometer, i) => (
                    <button
                        key={spectrometer}
                        type='button'
                        className={
                            'relative min-w-[10rem] flex-row-left px-3 py-1.5 font-weight-600 ' +
                            'font-weight-600 text-sm font-medium ' +
                            (props.selectedSpectrometers.includes(spectrometer)
                                ? 'text-gray-900 bg-white '
                                : 'text-gray-400 bg-gray-200 hover:bg-gray-100 ') +
                            'z-0 focus:z-10 focus:outline-none focus:ring-1 ' +
                            'focus:ring-indigo-500 focus:border-indigo-500 ' +
                            (i === 0 ? 'rounded-t-md ' : ' ') +
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
                            className='mr-1.5 pointer-events-none !fill-red-500'
                        />
                        <span className='mr-1 font-weight-600'>
                            {spectrometer}
                        </span>
                        <span className='font-weight-400'>
                            ({props.locations[i]})
                        </span>
                    </button>
                ))}
            </span>
            <span className='relative z-0 bg-gray-300 rounded-md shadow flex-col-center gap-y-px'>
                {props.campaign.gases.map((gas, i) => (
                    <button
                        key={gas}
                        type='button'
                        className={
                            'relative min-w-[6rem] flex-row-left px-3 py-1.5 font-weight-600 ' +
                            'font-weight-600 text-sm font-medium ' +
                            (props.selectedGas === gas
                                ? 'text-gray-900 bg-white '
                                : 'text-gray-500 bg-gray-50 hover:bg-gray-100 ') +
                            'z-0 focus:z-10 focus:outline-none focus:ring-1 ' +
                            'focus:ring-indigo-500 ' +
                            (i === 0 ? 'rounded-t-md ' : ' ') +
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
                        />
                        {gas}
                    </button>
                ))}
            </span>
        </div>
    );
}
