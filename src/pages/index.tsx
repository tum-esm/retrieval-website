import { Link, useStaticQuery, graphql } from 'gatsby';
import React from 'react';
import types from '../types';

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

    return (
        <main>
            <h1>EM27 Retrieval Plots</h1>
            <ul>
                {data.allCampaign.nodes.map((c: types.Campaign) => (
                    <li>
                        <Link to={`/${c.identifier}/${c.displayDate}`}>
                            {c.identifier.toUpperCase()}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
