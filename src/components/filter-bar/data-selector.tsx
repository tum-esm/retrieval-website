import { Switch } from '@headlessui/react';
import React from 'react';
import types from 'types';

export default function DataSelector(props: {
    gases: types.gasMeta[];
    gasIndex: number;
    setGasIndex(i: number): void;
    filterData: boolean;
    setFilterData(b: boolean): void;
}) {
    return (
        <div className='flex-col-center'>
            <div className='flex-row-center'>
                <Switch
                    checked={props.filterData}
                    onChange={props.setFilterData}
                    className='relative inline-flex items-center justify-center flex-shrink-0 w-10 h-5 rounded-full cursor-pointer group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                    <span className='sr-only'>Use setting</span>
                    <span
                        aria-hidden='true'
                        className='absolute w-full h-full bg-white rounded-md pointer-events-none'
                    />
                    <span
                        aria-hidden='true'
                        className={
                            (props.filterData
                                ? 'bg-green-700 '
                                : 'bg-gray-200 ') +
                            'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
                        }
                    />
                    <span
                        aria-hidden='true'
                        className={
                            (props.filterData
                                ? 'translate-x-5 '
                                : 'translate-x-0 ') +
                            'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200'
                        }
                    />
                </Switch>
                <div className='ml-3 text-sm font-medium'>Filter data</div>
            </div>
            <div className='w-full my-3 border-b border-gray-300' />
            <span className='relative z-0 inline-flex rounded-md shadow-sm'>
                {props.gases.map((g, i) => (
                    <button
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
