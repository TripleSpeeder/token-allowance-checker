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

const wallets = [
    { walletName: 'metamask', preferred: true },
    { walletName: 'coinbase', preferred: true },
    {
        walletName: 'walletConnect',
        infuraKey: '7f230a5ca832426796454c28577d93f2',
        preferred: true
    },
    { walletName: 'trust', preferred: true },
    { walletName: 'dapper', preferred: true },
    { walletName: 'authereum', preferred: true },
    { walletName: 'opera' },
    { walletName: 'status' },
    { walletName: 'operaTouch' },
    { walletName: 'torus' },
    { walletName: 'status' }
]

const OnboardContext = (props) => {
    const [web3, setWeb3] = useState()
    const [address, setAddress] = useState()
    const [networkId, setNetworkId] = useState()
    const [onboard, setOnboard] = useState()
    const [loggedIn, setLoggedIn] = useState(false)
    const [selected, setSelected] = useState(false)

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
            },
            walletSelect: {
                wallets: wallets
            }
        }))
        setOnboard(onboard)
    }, [])

    const selectWallet = async() => {
        if (onboard) {
            if (!selected) {
                console.log('Selecting wallet...')
                const selected = await onboard.walletSelect()
                setSelected(selected)
                return selected
            } else {
                console.log('Wallet already selected.')
                return true
            }
        } else {
            console.log(`Trying select wallet without onboard`)
            return false
        }
    }

    const login = async () => {
        if (onboard) {
            if (!selected) {
                const success = await selectWallet()
                if (!success)
                    return false
            }
            if (!loggedIn) {
                console.log(`logging in`)
                const result = await onboard.walletCheck()
                setLoggedIn(result)
                return result
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
        loginFunction: login,
        selectFunction: selectWallet
    }

    if (onboard) {
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