import { Link } from 'gatsby';
import React from 'react';

export default function Page() {
    return (
        <main className='w-screen min-h-screen px-4 py-16 bg-gray-100 flex-col-center'>
            <h1
                className={`mb-4 text-green-900 font-semibold text-2xl leading-tight text-center rounded`}
            >
                404: Page Not Found
            </h1>
            <Link to='/'>
                <div className='text-center text-blue-600 underline'>
                    Get back to main page
                </div>
            </Link>
        </main>
    );
}
