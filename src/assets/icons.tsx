import React from 'react';

const SVG = (props: { children: React.ReactNode; id?: string }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' id={props.id}>
        {props.children}
    </svg>
);

const icons = {
    arrowThickRightCircle: (
        <SVG>
            <circle cx='12' cy='12' r='10' className='primary' />
            <path
                className='secondary'
                d='M12 14H7a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h5V8a1 1 0 0 1 1.7-.7l4 4a1 1 0 0 1 0 1.4l-4 4A1 1 0 0 1 12 16v-2z'
            />
        </SVG>
    ),
};

export default icons;
