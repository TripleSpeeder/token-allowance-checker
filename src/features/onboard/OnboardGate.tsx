import React, {useEffect} from 'react'
import {Icon, Message, Segment} from 'semantic-ui-react'
import {useHistory} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../app/rootReducer'
import {initialize, selectWallet} from './onboardSlice'

const OnboardGate = (props: React.PropsWithChildren<any>) => {
    const history = useHistory()

    const dispatch = useDispatch()
    const {onboardAPI, walletSelected} = useSelector(
        (state: RootState) => state.onboard
    )

    useEffect(() => {
        /*
        const doLogin = async() => {
            setIsOnboarding(true)

            const result = await web3Context.loginFunction()
            setWalletSelected(result)
            setIsOnboarding(false)
            if (!result) {
                // send user back to home page if he rejected wallet selection
                history.push('/')
            }
        }
        */
        if (!onboardAPI) {
            console.log(`OnboardGate: Dispatching initialize()`)
            dispatch(initialize())
        } else if (!walletSelected) {
            console.log(`OnboardGate: Dispatching selectWallet`)
            dispatch(selectWallet())
        }
    }, [onboardAPI, walletSelected])

    if (walletSelected) {
        return <React.Fragment>
            {props.children}
        </React.Fragment>
    } else {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message info icon size={'huge'}>
                    <Icon name='spinner' loading />
                    <Message.Content>
                        <Message.Header>Waiting for wallet</Message.Header>
                        Please complete wallet selection.
                    </Message.Content>
                </Message>
            </Segment>
        )
    }
}

export default OnboardGate