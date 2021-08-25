/* This example requires Tailwind CSS v2.0+ */
import React from 'react';

export default function D3Plot(props: {
    plotAxisRange: {
        [key in 'time' | 'co2' | 'ch4']: {
            from: number;
            to: number;
            step: number;
        };
    };
}) {
    return (
        <div
            className={
                'relative w-full px-4 py-2 flex-row-center text-gray-900 bg-red-300'
            }
        >
            Hello
        </div>
    );
}
