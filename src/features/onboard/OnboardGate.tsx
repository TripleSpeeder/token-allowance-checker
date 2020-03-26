import React, { useEffect } from 'react'
import { Icon, Message, Segment } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../app/rootReducer'
import { initialize, selectWallet } from './onboardSlice'

interface OnboardGateProps {
    children?: React.ReactNode
}
const OnboardGate = ({ children }: OnboardGateProps) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const { onboardAPI, walletSelected } = useSelector(
        (state: RootState) => state.onboard
    )

    useEffect(() => {
        if (!onboardAPI) {
            console.log(`OnboardGate: Dispatching initialize()`)
            dispatch(initialize(history))
        } else if (!walletSelected) {
            console.log(`OnboardGate: Dispatching selectWallet`)
            dispatch(selectWallet(history))
        }
    }, [onboardAPI, walletSelected, dispatch, history])

    const onboardstate = onboardAPI?.getState()

    if (walletSelected && onboardstate?.wallet) {
        return <React.Fragment>{children}</React.Fragment>
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
