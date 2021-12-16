import React from 'react';
import types from '../../types';

export default function DataSelector(props: {
    campaign: types.Campaign;
    selectedGas: string;
    setSelectedGas(g: string): void;
}) {
    return (
        <div className='flex-col-center'>
            <span className='relative z-0 inline-flex rounded-md shadow-sm'>
                {props.campaign.gases.map((gas, i) => (
                    <button
                        type='button'
                        className={
                            'relative min-w-[6rem] py-2 ' +
                            'text-sm font-medium border border-gray-300 ' +
                            (props.selectedGas === gas
                                ? 'text-gray-700 bg-white font-weight-700 '
                                : 'text-gray-500 bg-gray-200 hover:text-gray-700 hover:bg-white ') +
                            'z-0 focus:z-10 focus:outline-none focus:ring-1 ' +
                            'focus:ring-indigo-500 focus:border-indigo-500 ' +
                            (i === 0 ? 'rounded-l-md ' : ' ') +
                            (i !== 0 ? '-ml-px ' : ' ') +
                            (i === props.campaign.gases.length - 1
                                ? 'rounded-r-md '
                                : ' ')
                        }
                        onClick={() => props.setSelectedGas(gas)}
                    >
                        {gas}
                    </button>
                ))}
            </span>
        </div>
    );
}
