import React, {useEffect, useState, createContext} from 'react'
import Onboard from 'bnc-onboard'
import Web3 from 'web3'
import {Icon, Message, Segment} from 'semantic-ui-react'

const onboardapikey='f4b71bf0-fe50-4eeb-bc2b-b323527ed9e6'

export const Web3Context = createContext({
    onboard: null,
    web3: null,
    address: null,
    networkId: null,
    loggedIn: false,
    loginFunction: null,
})

const OnboardContext = (props) => {
    const [web3, setWeb3] = useState()
    const [address, setAddress] = useState()
    const [networkId, setNetworkId] = useState()
    const [onboard, setOnboard] = useState()
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
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
    }, [])

    const login = async () => {
        if (onboard) {
            if (!loggedIn) {
                console.log(`logging in`)
                const selected = await onboard.walletSelect()
                if (selected) {
                    await onboard.walletCheck()
                    setLoggedIn(true)
                }
                return selected
            } else {
                console.log(`already logged in`)
                return true
            }
        } else {
            console.log(`Trying login without onboard`)
            return false
        }
    }


    const contextValue = {
        onboard,
        web3,
        address,
        networkId,
        loginFunction: login
    }

    if (onboard) {
        console.log('Onboard initialized!')
        return <Web3Context.Provider value={contextValue}>
            {props.children}
        </Web3Context.Provider>
    } else {
        console.log('Onboard not yet initialized!')
        return (
            <React.Fragment>
                <Segment basic padded='very' textAlign={'center'}>
                    <Message info icon size={'huge'}>
                        <Icon name='spinner' loading />
                        <Message.Content>
                            <Message.Header>Initializing web3</Message.Header>
                            Please wait while initializing web3 connection.
                        </Message.Content>
                    </Message>
                </Segment>
            </React.Fragment>
        )

    }
}

export default OnboardContext