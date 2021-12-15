import React from 'react';

export default function Page({ pageContext }) {
    return <div>{JSON.stringify(pageContext)}</div>;
}
