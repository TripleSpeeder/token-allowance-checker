import React, { useEffect } from 'react'
import { Icon } from 'semantic-ui-react'
import { RootState } from '../../app/rootReducer'
import { initialize, selectWallet } from './onboardSlice'
import DisplayMessage from '../../components/DisplayMessage'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

interface OnboardGateProps {
  children?: React.ReactNode
}
const OnboardGate = ({ children }: OnboardGateProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { onboardAPI, wallet } = useAppSelector((state) => state.onboard)
  const mobile = useAppSelector((state: RootState) => state.respsonsive.mobile)

  useEffect(() => {
    if (!onboardAPI) {
      console.log(`OnboardGate: Dispatching initialize()`)
      dispatch(initialize(navigate))
    } else if (!wallet) {
      console.log(`OnboardGate: Dispatching selectWallet`)
      dispatch(selectWallet(navigate))
    }
  }, [onboardAPI, wallet, dispatch, navigate])

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
