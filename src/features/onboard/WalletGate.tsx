import React, { useEffect } from 'react'
import { Icon } from 'semantic-ui-react'
import { RootState } from '../../app/rootReducer'
import { selectWallet, setNetworkId } from './onboardSlice'
import DisplayMessage from '../../components/DisplayMessage'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  addAddress,
  setENSName,
  setWalletAddressThunk
} from '../addressInput/AddressSlice'

interface WalletGateProps {
  children?: React.ReactNode
}
const WalletGate = ({ children }: WalletGateProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { onboardAPI, wallet } = useAppSelector((state) => state.onboard)
  const mobile = useAppSelector((state: RootState) => state.respsonsive.mobile)

  useEffect(() => {
    if (onboardAPI) {
      console.log(`subscribing to state updates...`)
      const state = onboardAPI.state.select()
      const { unsubscribe } = state.subscribe((update) => {
        console.log('state update: ', update)
        if (update.wallets.length) {
          const address = update.wallets[0].accounts[0].address
          const ens = update.wallets[0].accounts[0].ens
          const chainId = update.wallets[0].chains[0].id
          console.log(
            `Wallet: ChainID ${chainId} - ${address} - ensName ${ens?.name}`
          )
          dispatch(setNetworkId(chainId))
          dispatch(addAddress(address.toLowerCase()))
          if (ens) {
            dispatch(
              setENSName({
                id: address.toLowerCase(),
                ensName: ens.name
              })
            )
          }
          dispatch(
            setWalletAddressThunk(
              update.wallets[0].accounts[0].address.toLowerCase(),
              navigate
            )
          )
        }
      })
      return () => {
        console.log(`unsubscribing from state updates...`)
        try {
          unsubscribe()
        } catch (e) {
          console.log('Failed to unsubscribe.')
          console.log(e)
        }
      }
    }
  }, [dispatch, navigate, onboardAPI])

  useEffect(() => {
    if (!wallet) {
      console.log(`WalletGate: Dispatching selectWallet`)
      dispatch(selectWallet(navigate))
    }
  }, [wallet, dispatch, navigate])

  if (wallet) {
    return <React.Fragment>{children}</React.Fragment>
  } else {
    return (
      <DisplayMessage
        mobile={mobile}
        header={'Selecting wallet'}
        body={'Please wait...'}
        icon={<Icon name='spinner' loading />}
        info={true}
      />
    )
  }
}

export default WalletGate
