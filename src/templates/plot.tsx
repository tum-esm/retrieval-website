import React from 'react';
import { graphql } from 'gatsby';

export default function Project(props: { data: any }) {
    const plotMeta: any = props.data.strapiPlotMeta;
    return (
        <main>
            <title>ESM Plots</title>
            <h1 className='p-2 m-4 font-bold text-center text-green-800 bg-green-200 rounded'>
                ESM Plots
            </h1>
            {JSON.stringify(plotMeta)}
        </main>
    );
}

export const query = graphql`
    query ($campaignId: String!) {
        strapiPlotMeta(campaignId: { eq: $campaignId }) {
            campaignId
            data {
                days
                gases {
                    name
                    unit
                }
                startDate
                stations {
                    location
                    sensor
                }
            }
        }
    }
`;
