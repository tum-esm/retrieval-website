import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import types from 'types';
import { ArrowCircleRightIcon } from '@heroicons/react/solid';
import { tail } from 'lodash';

const Page = () => {
    const query = useStaticQuery(graphql`
        query {
            allStrapiPlotMeta {
                nodes {
                    campaignId
                }
            }
        }
    `);
    const metas = query.allStrapiPlotMeta.nodes;

    const headingClasses = 'text-lg leading-tight text-center rounded';
    return (
        <main className='w-screen min-h-screen px-4 py-8 bg-gray-100 flex-col-center'>
            <div className='max-w-md flex-col-center'>
                <h2
                    className={`max-w-xs text-lg mb-2 text-green-700 font-regular ${headingClasses}`}
                >
                    TUM - Assistant Professorship of Environmental Sensing and
                    Modeling
                </h2>
                <h1
                    className={`mb-4 text-2xl text-green-900 font-semibold ${headingClasses}`}
                >
                    Plots of the EM27 Retrieval Output
                </h1>
            </div>
            <div className='max-w-md w-[28rem] flex-row-center'>
                {metas.map((m: types.plotMeta) => (
                    <Link to={`/${m.campaignId}`} className='w-full'>
                        <div className='w-full p-2 pl-3 bg-white rounded-md shadow flex-row-center'>
                            <div className='text-base font-semibold text-gray-600'>
                                {m.campaignId[0].toUpperCase()}
                                {tail(m.campaignId)}
                            </div>
                            <div className='flex-grow' />
                            <div className='flex-shrink-0 w-5 h-5 text-gray-400'>
                                <ArrowCircleRightIcon />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
};

export default Page;
