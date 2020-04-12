import React, { useEffect } from 'react'
import { Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../app/rootReducer'
import { initialize, selectWallet } from './onboardSlice'
import DisplayMessage from '../../components/DisplayMessage'

interface OnboardGateProps {
    children?: React.ReactNode
}
const OnboardGate = ({ children }: OnboardGateProps) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const { onboardAPI, wallet } = useSelector(
        (state: RootState) => state.onboard
    )
    const mobile = useSelector((state: RootState) => state.respsonsive.mobile)

    useEffect(() => {
        if (!onboardAPI) {
            console.log(`OnboardGate: Dispatching initialize()`)
            dispatch(initialize(history))
        } else if (!wallet) {
            console.log(`OnboardGate: Dispatching selectWallet`)
            dispatch(selectWallet(history))
        }
    }, [onboardAPI, wallet, dispatch, history])

    if (wallet) {
        return <React.Fragment>{children}</React.Fragment>
    } else {
        return (
            <DisplayMessage
                mobile={mobile}
                header={'Waiting for wallet'}
                body={'Please complete wallet selection'}
                icon={<Icon name='spinner' loading />}
                info={true}
            />
        )
    }
}

export default OnboardGate
