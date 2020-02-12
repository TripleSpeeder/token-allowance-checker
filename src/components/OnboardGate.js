import React, {useEffect, useState, useContext} from 'react'
import {Web3Context} from './OnboardContext'
import {Icon, Message, Segment} from 'semantic-ui-react'
import {useHistory} from 'react-router-dom'

const OnboardGate = (props) => {
    const history = useHistory()
    const web3Context = useContext(Web3Context)
    const [isOnboarding, setIsOnboarding] = useState(true)
    const [walletSelected, setWalletSelected] = useState(false)

    useEffect(() => {

        const doLogin = async() => {
            setIsOnboarding(true)
            const result = await web3Context.loginFunction()
            if (!result) {
                // send user back to home page if he rejected wallet selection
                history.push('/')
            }
            setWalletSelected(result)
            setIsOnboarding(false)
        }

        if (web3Context.onboard) {
            doLogin()
        }

    }, [web3Context.onboard])

    if (walletSelected && web3Context.web3) {
        return <React.Fragment>
            {props.children}
        </React.Fragment>
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