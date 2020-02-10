import React, {ReactElement, useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { createDfuseClient } from '@dfuse/client'
import {Web3Context} from './OnboardGate'
import TokenAllowanceListContainer from './TokenAllowanceListContainer'

const topicHashApprove = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
const eventABI = [
    {
        'indexed': true,
        'internalType': 'address',
        'name': 'owner',
        'type': 'address'
    },
    {
        'indexed': true,
        'internalType': 'address',
        'name': 'spender',
        'type': 'address'
    },
    {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256'
    }
]

const client = createDfuseClient({
    apiKey: 'server_217e99c3f906df80430c3c5f4366c8d0',
    network: 'mainnet.eth.dfuse.io',
})
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
            allLogs {
              data
              topics
            }
          }
        }
      }
    }`

const AllowanceLister = () => {

    const web3Context = useContext(Web3Context)

    const [loading, setLoading] = useState(true)
    const [tokenSpenders, setTokenSpenders] = useState({})
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false
        const collectAllowances = async (address) => {
            setLoading(true)
            setError('')

            const tokenSpenders = {}
            // Perform query
            try {
                const response = await client.graphql(searchTransactions, {
                    variables: {
                        limit: '10',
                        query: `signer:${address} method:'approve(address,uint256)'`,
                    }
                })
                if (cancelled) {
                    console.log(`Received stale response.`)
                    return
                }
                // any errors reported?
                if (response.errors) {
                    throw response.errors
                }
                // get actual results
                const edges = response.data.searchTransactions.edges || []
                if (edges.length <= 0) {
                    console.log(`No Approve() calls found for ${address}`)
                }
                edges.forEach(({node}) => {
                    const tokenContract = node.to
                    // console.log(`Approval - Token ${tokenContract}`)
                    const approveLogs = node.allLogs.filter((logEntry) => {
                        if (logEntry.topics[0] === topicHashApprove) {
                            //console.log('Log match:')
                            //console.log(logEntry)
                            return true
                        } else {
                            return false
                        }
                    })
                    approveLogs.forEach((logEntry) => {
                        const decoded = web3Context.web3.eth.abi.decodeLog(eventABI, logEntry.data, logEntry.topics.slice(1))
                        // console.log(decoded)
                        // double-check owner - Is this necessary?
                        if (decoded.owner.toLowerCase() === address) {
                            // Add tokenContract if its new
                            if (Object.keys(tokenSpenders).includes(tokenContract)) {
                                console.log(`tokenContract ${tokenContract} already known`)
                            } else {
                                console.log(`Adding tokenContract ${tokenContract}`)
                                tokenSpenders[tokenContract] = []
                            }
                            // Add spender address if its new
                            if (tokenSpenders[tokenContract].includes(decoded.spender)) {
                                console.log(`Spender ${decoded.spender} for ${tokenContract} already known`)
                            } else {
                                console.log(`Adding Spender ${decoded.spender} for ${tokenContract}`)
                                tokenSpenders[tokenContract].push(decoded.spender)
                            }
                        } else {
                            console.log(`Skipping log event due to owner mismatch. Expected ${address}, got ${decoded.owner}`)
                        }
                    })
                    setTokenSpenders(tokenSpenders)
                })
            } catch(errors) {
                if (!cancelled) {
                    setError(JSON.stringify(errors))
                }
            }
            setLoading(false)
        }

        setTokenSpenders({})
        if (web3Context.web3 && web3Context.address) {
            console.log(`Starting query for "${web3Context.address}"`)
            collectAllowances(web3Context.address)
        }

        return () => {
            cancelled = true
        }
    }, [web3Context.web3, web3Context.address])

    if (loading) {
        return (<div><h1>Loading...</h1></div>)
    }

    if (error) {
        return (<div><h1>Error occured: {error}</h1></div>)
    }

    const tokens = []
    for (const [key, value] of Object.entries(tokenSpenders)) {
        tokens.push(
            <TokenAllowanceListContainer
                key={key}
                owner={web3Context.address}
                spenders={value}
                contractAddress={key}/>
        )
    }

    return (
        <div>
            <h1>Allowances for {web3Context.address}</h1>
            {tokens}
        </div>
    )
}

export default AllowanceLister