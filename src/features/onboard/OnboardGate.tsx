import React, { useEffect } from 'react'
import { Icon } from 'semantic-ui-react'
import { RootState } from '../../app/rootReducer'
import { initialize } from './onboardSlice'
import DisplayMessage from '../../components/DisplayMessage'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

interface OnboardGateProps {
  children?: React.ReactNode
}
const OnboardGate = ({ children }: OnboardGateProps) => {
  const dispatch = useAppDispatch()
  const { onboardAPI } = useAppSelector((state) => state.onboard)
  const mobile = useAppSelector((state: RootState) => state.respsonsive.mobile)

  useEffect(() => {
    if (!onboardAPI) {
      console.log(`OnboardGate: Dispatching initialize()`)
      dispatch(initialize())
    }
  }, [onboardAPI, dispatch])

  if (onboardAPI) {
    return <React.Fragment>{children}</React.Fragment>
  } else {
    return (
      <DisplayMessage
        mobile={mobile}
        header={'Initilizing onboardApi'}
        body={'Please wait...'}
        icon={<Icon name='spinner' loading />}
        info={true}
      />
    )
  }
}

export default OnboardGate
