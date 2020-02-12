import React, {useEffect, useState, createContext} from 'react'
import Onboard from 'bnc-onboard'
import Web3 from 'web3'
import {Button, Grid, Header, Icon, Message, Segment} from 'semantic-ui-react'

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
    const [isOnboarding, setIsOnboarding] = useState()
    const [walletSelected, setWalletSelected] = useState(false)

    useEffect(() => {
        const login = async (onboard) => {
            setIsOnboarding(true)
            console.log(`waiting for walletSelect`)
            const selected = await onboard.walletSelect()
            setWalletSelected(selected)
            /*
            if (selected) {
                await onboard.walletCheck()
            }
             */
            setIsOnboarding(false)
        }

        console.log(`Initializing OnBoard.js...`)
        const onboard = (Onboard({
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
                network: networkId => {
                    setNetworkId(networkId)
                    console.log(`NetworkId change to ${networkId}`)
                }
            }
        }))
        setOnboard(onboard)
        login(onboard)

    }, [])


    const contextValue = {
        web3,
        address,
        networkId
    }

    if (walletSelected && web3) {
        return <Web3Context.Provider value={contextValue}>
            {props.children}
        </Web3Context.Provider>
    }

    if (isOnboarding) {
        return (
            <React.Fragment>
                <Segment basic padded='very' textAlign={'center'}>
                    <Message info icon size={'huge'}>
                        <Icon name='spinner' loading />
                        <Message.Content>
                            <Message.Header>Waiting for wallet</Message.Header>
                            Please complete wallet selection.
                        </Message.Content>
                    </Message>
                </Segment>
            </React.Fragment>
        )
    }

    if (!walletSelected) {
        return (
            <React.Fragment>
                <Segment basic padded='very' textAlign={'center'}>
                    <Message warning icon size={'huge'}>
                        <Icon name='exclamation triangle' />
                        <Message.Content>
                            <Message.Header>No wallet selected</Message.Header>
                            You need to select a wallet.
                        </Message.Content>
                    </Message>
                </Segment>
            </React.Fragment>
        )
    }
}

export default OnboardGate