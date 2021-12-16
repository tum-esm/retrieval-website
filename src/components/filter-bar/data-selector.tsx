import React from 'react';
import types from '../../types';

export default function DataSelector(props: { campaign: types.Campaign }) {
    return (
        <div className='flex-col-center'>
            <span className='relative z-0 inline-flex rounded-md shadow-sm'>
                <button
                    type='button'
                    className='relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                >
                    Previous
                </button>
            </span>
        </div>
    );
}
