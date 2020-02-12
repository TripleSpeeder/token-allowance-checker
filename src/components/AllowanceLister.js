import React, {useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {createDfuseClient} from '@dfuse/client'
import {Web3Context} from './OnboardGate'
import TokenAllowanceListContainer from './TokenAllowanceListContainer'
import 'semantic-ui-css/semantic.min.css'
import {Icon, Message, Segment} from 'semantic-ui-react'

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
        indexName: LOGS, 
        query: $query, 
        limit: $limit, 
        sort: DESC
      ) {
        edges {
          node {
            block {
              number
            }
            matchingLogs {
              data
              topics
              address
            }
          }
        }
      }
    }`

const AllowanceLister = () => {

    const web3Context = useContext(Web3Context)
    const addressFromParams = useParams().address

    const [loading, setLoading] = useState(false)
    const [tokenSpenders, setTokenSpenders] = useState({})
    const [error, setError] = useState('')
    const [address, setAddress] = useState(
        addressFromParams ? addressFromParams.toLowerCase() : ''
            /*(web3Context.address? web3Context.address.toLowerCase() : '')*/
    )

    useEffect(() => {
        setAddress(addressFromParams ? addressFromParams.toLowerCase() : '')
    }, [addressFromParams])

    useEffect(() => {
        document.title = `TAC - ${address}`
    }, [address])


    useEffect(() => {
        let cancelled = false
        const collectAllowances = async () => {
            setLoading(true)
            setError('')

            const tokenSpenders = {}
            // Perform query
            try {
                const response = await client.graphql(searchTransactions, {
                    variables: {
                        limit: '10',
                        query: `signer:${address} method:'approve(address,uint256)' topic.0:${topicHashApprove}`,
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
                    node.matchingLogs.forEach((logEntry) => {
                        // Seems the dfuse query based on topic is not working correctly.
                        // Double-check that the logEntry actually is of the expected topic.
                        if (logEntry.topics[0] !== topicHashApprove) {
                            console.warn(`Skipping wrong topic ${logEntry.topics[0]}`)
                            return
                        }
                        const decoded = web3Context.web3.eth.abi.decodeLog(eventABI, logEntry.data, logEntry.topics.slice(1))
                        // double-check owner - Is this necessary?
                        if (decoded.owner.toLowerCase() === address) {
                            // Add tokenContract if its new
                            const tokenContract = logEntry.address
                            if (Object.keys(tokenSpenders).includes(tokenContract)) {
                                // console.log(`tokenContract ${tokenContract} already known`)
                            } else {
                                console.log(`Adding tokenContract ${tokenContract}`)
                                tokenSpenders[tokenContract] = []
                            }
                            // Add spender address if its new
                            if (tokenSpenders[tokenContract].includes(decoded.spender)) {
                                // console.log(`Spender ${decoded.spender} for ${tokenContract} already known`)
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
                console.log(errors)
                if (!cancelled) {
                    setError(JSON.stringify(errors))
                }
            }
            setLoading(false)
        }

        setTokenSpenders({})
        if (web3Context.web3 && address) {
            console.log(`Starting query for "${address}"`)
            collectAllowances(address)
        }

        return () => {
            cancelled = true
        }
    }, [web3Context.web3, address])

    if (address === '') {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message info icon size={'huge'}>
                    <Icon name='info' />
                    <Message.Content>
                        <Message.Header>Enter an address to start!</Message.Header>
                    </Message.Content>
                </Message>
            </Segment>
        )
    }

    if (loading) {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message icon warning size={'huge'}>
                    <Icon name='circle notched' loading />
                    <Message.Content>
                        <Message.Header>Please wait</Message.Header>
                        <p>Checking address: {address}</p>
                        {`Querying dfuse API for ERC20 Approvals...`}
                    </Message.Content>
                </Message>
            </Segment>
        )
    }

    if (error) {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message error icon size={'huge'}>
                    <Icon name='exclamation triangle' />
                    <Message.Content>
                        <Message.Header>Error</Message.Header>
                        {error}
                    </Message.Content>
                </Message>
            </Segment>
        )
    }

    if (Object.keys(tokenSpenders).length === 0) {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message success icon size={'huge'}>
                    <Icon name='info' />
                    <Message.Content>
                        <Message.Header>No Approvals</Message.Header>
                        Address {address} has no Approvals.
                    </Message.Content>
                </Message>
            </Segment>
        )
    }

    const tokens = []
    for (const [key, value] of Object.entries(tokenSpenders)) {
        tokens.push(
            <TokenAllowanceListContainer
                key={key}
                owner={address}
                spenders={value}
                contractAddress={key}/>
        )
    }

    return (
        <React.Fragment>
            <Segment basic>
                <h2>{address} has these allowances</h2>
            </Segment>
            {tokens}
        </React.Fragment>
    )
}

export default AllowanceLister