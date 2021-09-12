import React from 'react';
import types from 'types';

export default function DataSelector(props: {
    gases: types.gasMeta[];
    gasIndex: number;
    setGasIndex(i: number): void;
}) {
    return (
        <div className='flex-shrink-0 flex-col-center'>
            <span className='relative z-0 inline-flex rounded-md shadow-sm'>
                {props.gases.map((g, i) => (
                    <button
                        key={g.name}
                        type='button'
                        onClick={() => props.setGasIndex(i)}
                        className={
                            'relative inline-flex items-center px-4 py-2 ' +
                            'text-sm font-medium border border-gray-300 ' +
                            'focus:z-10 focus:outline-none focus:border-indigo-500 ' +
                            'focus:ring-1 focus:ring-indigo-500 ' +
                            (i === 0 ? 'rounded-l-md ' : '-ml-px ') +
                            (i === props.gases.length - 1
                                ? 'rounded-r-md '
                                : '') +
                            (i === props.gasIndex
                                ? 'bg-white text-gray-900 '
                                : 'bg-gray-200 hover:bg-gray-100 text-gray-600 ')
                        }
                    >
                        {g.name} [{g.unit}]
                    </button>
                ))}
            </span>
        </div>
    );
}
