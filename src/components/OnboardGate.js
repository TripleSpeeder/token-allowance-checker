import React, {useEffect, useState, createContext} from 'react'
import Onboard from 'bnc-onboard'
import Web3 from 'web3'
import {Button, Segment} from 'semantic-ui-react'

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
            <Segment basic padded='very' textAlign={'center'}>
                <Button primary size={'huge'} onClick={login}>Connect web3 to start!</Button>
            </Segment>
        )
    }
}

export default OnboardGate