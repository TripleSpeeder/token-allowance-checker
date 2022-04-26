import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Web3 from 'web3'
import { AppThunk } from '../../app/store'
import apiKeys from '../../api/apikeys'
import { NavigateFunction } from 'react-router-dom'
import Onboard, { OnboardAPI, WalletState } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import gnosisModule from '@web3-onboard/gnosis'
import keepkeyModule from '@web3-onboard/keepkey'
import keystoneModule from '@web3-onboard/keystone'
import ledgerModule from '@web3-onboard/ledger'
import portisModule from '@web3-onboard/portis'
import torusModule from '@web3-onboard/torus'
import trezorModule from '@web3-onboard/trezor'
import walletConnectModule from '@web3-onboard/walletconnect'
import walletLinkModule from '@web3-onboard/walletlink'
import mewModule from '@web3-onboard/mew'
import TACLogo from '../../icons/Light/Small/icon.svg'
import { setWalletAddressThunk } from '../addressInput/AddressSlice'

const wallets = [
  injectedModule(),
  gnosisModule(),
  mewModule(),
  portisModule({ apiKey: '148909ab-b865-466a-86f6-80b8f3631efe' }),
  torusModule(),
  walletConnectModule(),
  walletLinkModule(),
  keepkeyModule(),
  ledgerModule(),
  trezorModule({
    appUrl: 'https://tac.dappstar.io',
    email: 'michael@m-bauer.org'
  }),
  keystoneModule()
]

// Define contents of onboard state
interface OnboardState {
  onboardAPI: OnboardAPI | null
  web3?: Web3
  wallet?: WalletState
  chainId: string
  requiredChainId: string
}

const initialState: OnboardState = {
  chainId: '0x0',
  requiredChainId: '0x1',
  onboardAPI: null,
  wallet: undefined
}

const onboardSlice = createSlice({
  name: 'onboard',
  initialState,
  reducers: {
    setOnboardAPI(state, action: PayloadAction<OnboardAPI>) {
      state.onboardAPI = action.payload
    },
    setWallet(state, action: PayloadAction<WalletState>) {
      state.wallet = action.payload
    },
    setWeb3Instance(state, action: PayloadAction<Web3>) {
      state.web3 = action.payload
    },
    setNetworkId(state, action: PayloadAction<string>) {
      state.chainId = action.payload
    },
    setRequiredNetworkId(state, action: PayloadAction<string>) {
      state.requiredChainId = action.payload
    }
  }
})

export const {
  setOnboardAPI,
  setNetworkId,
  setWeb3Instance,
  setWallet,
  setRequiredNetworkId
} = onboardSlice.actions

export default onboardSlice.reducer

export const selectWallet =
  (navigate: NavigateFunction): AppThunk =>
  async (dispatch, getState) => {
    console.log(`Selecting wallet...`)
    const onboardAPI = getState().onboard.onboardAPI
    if (onboardAPI) {
      const wallets = await onboardAPI.connectWallet()
      if (!wallets.length) {
        console.log(`No wallet selected.`)
        navigate('/')
      } else {
        const wallet = wallets[0]
        dispatch(setWallet(wallet))
        dispatch(setNetworkId(wallet.chains[0].id))
        // @ts-ignore
        dispatch(setWeb3Instance(new Web3(wallet.provider)))
        dispatch(
          setWalletAddressThunk(
            wallets[0].accounts[0].address.toLowerCase(),
            navigate
          )
        )
      }
    } else {
      console.log(`dispatched selectWallet() without initialization...`)
    }
  }

export const setRequiredNetworkIdThunk =
  (networkId: string): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setRequiredNetworkId(networkId))
    const onboardAPI = getState().onboard.onboardAPI
    if (onboardAPI) {
      // update existing onboardAPI object
      const success = await onboardAPI.setChain({ chainId: networkId })
      if (success) {
        dispatch(setNetworkId(networkId))
      }
    } else {
      console.log(`dispatched setRequiredNetworkId() without initialization...`)
    }
  }

export const initialize = (): AppThunk => async (dispatch, getState) => {
  console.log(`Initializing OnBoard.js...`)
  try {
    const onboard = Onboard({
      wallets,
      chains: [
        {
          id: '0x1', // hexadecimal
          token: 'ETH', // main chain token
          label: 'Ethereum Mainnet',
          rpcUrl: `https://mainnet.infura.io/v3/${apiKeys.infura['0x1'].apikey}`
        },
        {
          id: '0x3',
          token: 'tROP',
          label: 'Ethereum Ropsten Testnet',
          rpcUrl: `https://ropsten.infura.io/v3/${apiKeys.infura['0x3'].apikey}`
        }
      ],
      appMetadata: {
        name: 'Token Allowance Checker',
        description: 'Control ERC20 token approvals',
        icon: TACLogo
      }
    })
    dispatch(setOnboardAPI(onboard))
  } catch (e) {
    console.log(`Onboard.js initialization failed.`)
    console.log(e)
  }
}
