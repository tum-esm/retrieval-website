import { Link } from 'gatsby';
import React from 'react';
import types from '../types';
import backend from '../utilities/backend';

const SSRPage = (props: { serverData: { campaigns: types.Campaign[] } }) => {
    return (
        <main>
            <h1>EM27 Retrieval Plots</h1>
            <ul>
                {props.serverData.campaigns.map(c => (
                    <li>
                        <Link to={`/${c.identifier}/${c.displayDate}`}>
                            {c.identifier.toUpperCase()}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
};

export default SSRPage;

export async function getServerData() {
    return {
        props: { campaigns: await backend.getCampaigns({ listed: true }) },
    };
}
