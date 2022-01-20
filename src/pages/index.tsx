import { Link, useStaticQuery, graphql } from 'gatsby';
import React from 'react';
import types from '../types';
import { Helmet } from 'react-helmet';
import icons from '../assets/icons';
import { tail } from 'lodash';

export default function Page() {
    const data = useStaticQuery(graphql`
        {
            allCampaign {
                nodes {
                    displayDate
                    identifier
                }
            }
        }
    `);
    const headingClasses = 'text-lg leading-tight text-center rounded';

    return (
        <>
            <Helmet title='EM27 Retrieval' defer={false} />
            <main className='w-screen min-h-screen px-4 py-16 bg-gray-100 flex-col-center'>
                <div className='absolute bottom-0 left-0 z-0 w-full flex-row-center'>
                    <div className='py-1 text-sm text-gray-400 font-weight-500'>
                        {process.env.GATSBY_COMMIT_SHA !== undefined
                            ? `version ${process.env.GATSBY_COMMIT_SHA}`
                            : 'development'}
                    </div>
                </div>
                <div className='max-w-full flex-col-center'>
                    <h2
                        className={`max-w-xs text-lg mb-2 text-green-700 font-regular ${headingClasses}`}
                    >
                        TUM - Assistant Professorship of Environmental Sensing
                        and Modeling
                    </h2>
                    <h1
                        className={`mb-4 text-2xl text-green-900 font-semibold ${headingClasses}`}
                    >
                        Plots of the EM27 Retrieval Output
                    </h1>
                </div>
                <div className='max-w-full w-[28rem] flex-col-center gap-y-2'>
                    {data.allCampaign.nodes.map((c: types.Campaign) => (
                        <Link
                            to={`/${c.identifier}/${c.displayDate}`}
                            className='w-full'
                        >
                            <div className='w-full p-2 pl-3 bg-white rounded-md shadow flex-row-center'>
                                <div className='text-base font-semibold text-gray-600'>
                                    {c.identifier[0].toUpperCase()}
                                    {tail(c.identifier)}
                                </div>
                                <div className='flex-grow' />
                                <div className='flex-shrink-0 w-5 h-5 text-gray-400 icon-campaign-list'>
                                    {icons.arrowThickRightCircle}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className='text-sm mt-16 max-w-full w-[28rem] flex-col-center'>
                    <h3 className={`text-gray-600 font-semibold`}>
                        Do you want to use this data in your research?
                    </h3>
                    <a
                        className={` text-blue-500 underline font-regular`}
                        href='https://atmosphere.ei.tum.de/de/contact/'
                        target='_blank'
                    >
                        https://atmosphere.ei.tum.de/de/contact/
                    </a>
                </div>
            </main>
        </>
    );
}
