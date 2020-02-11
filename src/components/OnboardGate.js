import React, {useEffect, useState, createContext} from 'react'
import Onboard from 'bnc-onboard'
import Web3 from 'web3'
import {Button, Grid, Header, Segment} from 'semantic-ui-react'

const onboardapikey='f4b71bf0-fe50-4eeb-bc2b-b323527ed9e6'

export const Web3Context = createContext({
    web3: null,
    address: null,
    networkId: null
})

const OnboardGate = (props) => {

    const [web3, setWeb3] = useState()
    const [address, setAddress] = useState()
    const [networkId, setNetworkId] = useState()
    const [onboard, setOnboard] = useState()

    useEffect(() => {
        console.log(`Initializing OnBoard.js...`)
        setOnboard(Onboard({
            dappId: onboardapikey,
            networkId: 1,
            subscriptions: {
                wallet: wallet => {
                    console.log(`${wallet.name} is now connected!`)
                    setWeb3(new Web3(wallet.provider))
                },
                address: address => {
                    setAddress(address)
                    console.log(`Address changed to ${address}!`)
                },
                balance: balance => {
                    console.log(`Balance change to ${balance}`)
                },
                network: networkId => {
                    setNetworkId(networkId)
                    console.log(`NetworkId change to ${networkId}`)
                }
            }
        }))
    }, [])

    async function login() {
        const selected = await onboard.walletSelect()
        if (selected) {
            await onboard.walletCheck()
        }
    }

    const contextValue = {
        web3,
        address,
        networkId
    }

    if (web3) {
        return <Web3Context.Provider value={contextValue}>
            {props.children}
        </Web3Context.Provider>
    } else {
        return (
            <React.Fragment>
                <Segment basic style={{ paddingTop: '4em' }} vertical>
                    <Grid container stackable verticalAlign='top'>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header as='h3' style={{ fontSize: '2em' }}>
                                    Do you actually know who can spend your tokens?
                                </Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    This site helps you keep track of which contracts you have approved to spend
                                    your tokens.
                                </p>
                                <Header as='h3' style={{ fontSize: '2em' }}>
                                    Control your approvals
                                </Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    This site will show you all approvals for ERC20-compliant tokens, and the option to change
                                    the approved amount, or completely remove it.</p>
                            </Grid.Column>
                            <Grid.Column floated='right' width={7}>
                                <Header as='h3' style={{ fontSize: '2em' }}>
                                    The unlimited approval problem
                                </Header>
                                <p style={{ fontSize: '1.33em' }}>
                                    Many DApps have the habit of requiring you to approve effectively unlimited amount of
                                    tokens. This helps improving the user experience, as you only have to sign off an approval
                                    once and it will be enough for all future transactions.
                                </p>
                                <p style={{ fontSize: '1.33em' }}>
                                    However this also means that the DApp (or the person/entity controlling it) can at any time
                                    transfer <em>all of your tokens</em>, without requiring any further approval.
                                </p>
                                <p style={{ fontSize: '1.33em' }}>
                                    In addition, there is no concept of expiring approvals. Once approved, the approval will
                                    remain forever. If you do not trust a DApp or its operators anymore, there is usually no
                                    easy way to remove the approval.
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment basic textAlign={'center'}>
                    <Button primary size={'huge'} onClick={login}>Connect web3 to start!</Button>
                </Segment>
            </React.Fragment>
        )
    }
}

export default OnboardGate