import React, {ReactElement, useEffect, useState} from 'react';
import { createDfuseClient } from '@dfuse/client';

const client = createDfuseClient({
    apiKey: 'server_217e99c3f906df80430c3c5f4366c8d0',
    network: "mainnet.eth.dfuse.io",
})

const onboardapikey='f4b71bf0-fe50-4eeb-bc2b-b323527ed9e6'

const searchTransactions = `query ($query: String! $limit: Int64!) {
      searchTransactions(
        indexName: CALLS, 
        query: $query, 
        limit: $limit, 
        sort: DESC
      ) {
        edges {
          node {
            to
            block {
              number
            }
          }
        }
      }
    }`


export interface AllowanceListerProps {
    address: string;
}

const AllowanceLister = ({address}: AllowanceListerProps) => {

    interface Allowance {
        contractAddress: string,
        amount: string,
    }
    const [loading, setLoading] = useState(true);
    const [allowances, setAllowances] = useState<Allowance[]>([])
    const [error, setError] = useState('')

    useEffect(() => {
        const collectAllowances = async () => {
            setLoading(true)
            setError('')
            try {
                // Perform query
                const response = await client.graphql(searchTransactions, {
                    variables: {
                        limit: "10",
                        query: `signer:${address} method:'approve(address,uint256)'`,
                    }
                })
                // any errors reported?
                if (response.errors) {
                    throw response.errors;
                }
                // get actual results
                const edges = response.data.searchTransactions.edges || []
                if (edges.length <= 0) {
                    console.log("Oups nothing found")
                }
                console.log(edges)
                let allowances :Allowance[] = edges.map((edge:any) => {
                    console.log(edge.node)
                    return {
                        contractAddress: edge.node.to,
                        amount: 'unknown',
                    }
                })
                setAllowances(allowances)
            } catch(errors) {
                setError(JSON.stringify(errors))
            }
            setLoading(false)
        }
        collectAllowances()
    }, [address]);

    let listItems: ReactElement[] = []
    allowances.forEach((item: Allowance, index) => {
        listItems.push(<li key={index}>{item.contractAddress}: {item.amount}</li>)
    })

    return (
        <div>
            <h1>Allowances for {address}</h1>
            {loading && <p>loading...</p>}
            {error && <p>Error occured: {error}</p>}
            <ul>
                {listItems}
            </ul>
        </div>
    );
};

export default AllowanceLister;