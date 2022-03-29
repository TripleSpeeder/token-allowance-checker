import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Web3 from 'web3'
import { AppThunk } from '../../app/store'
import apiKeys from '../../api/apikeys'
import { NavigateFunction } from 'react-router-dom'
import Onboard, { OnboardAPI, WalletState } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import TACLogo from '../../icons/Light/Small/icon.svg'
import {
  addAddress,
  setENSName,
  setWalletAddressThunk
} from '../addressInput/AddressSlice'
import setChain from '@web3-onboard/core/dist/chain'

const infuraCredentials = apiKeys.infura['0x1']
const onboardCredentials = apiKeys.onboard['0x1']

const MAINNET_RPC_URL = `https://mainnet.infura.io/v3/${infuraCredentials.apikey}`
const injected = injectedModule()

/*
const wallets: Partial<WalletInitOptions>[] = [
  { walletName: 'metamask' },
  { walletName: 'coinbase' },
  {
    walletName: 'walletConnect',
    infuraKey: infuraCredentials.apikey
  },
  { walletName: 'tokenpocket' },
  {
    walletName: 'ledger',
    rpcUrl: `${infuraCredentials.endpoint}${infuraCredentials.apikey}`
  },
  {
    walletName: 'trezor',
    appUrl: 'https://tac.dappstar.io',
    email: 'michael@m-bauer.org',
    rpcUrl: `${infuraCredentials.endpoint}${infuraCredentials.apikey}`
  },
  { walletName: 'status' },
  { walletName: 'trust' },
  {
    walletName: 'lattice',
    rpcUrl: `${infuraCredentials.endpoint}${infuraCredentials.apikey}`,
    appName: 'Token Allowance Checker'
  },
  { walletName: 'authereum' },
  { walletName: 'opera' },
  { walletName: 'operaTouch' },
  { walletName: 'torus' },
  {
    walletName: 'imToken',
    rpcUrl: `${infuraCredentials.endpoint}${infuraCredentials.apikey}`
  },
  {
    walletName: 'huobiwallet',
    rpcUrl: `${infuraCredentials.endpoint}${infuraCredentials.apikey}`
  },
  { walletName: 'frame' },
  { walletName: 'gnosis' }
]

 */

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
/*
export const checkWallet = (): AppThunk => async (dispatch, getState) => {
  console.log(`checking wallet...`)
  const onboardAPI = getState().onboard.onboardAPI
  if (onboardAPI) {
    const result = await onboardAPI.walletCheck()
    console.log(`walletCheck result: ${result}`)
  } else {
    console.log(`dispatched checkWallet() without initialization...`)
  }
}

 */

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

export const initialize =
  (navigate: NavigateFunction): AppThunk =>
  async (dispatch, getState) => {
    console.log(`Initializing OnBoard.js...`)
    try {
      const onboard = Onboard({
        wallets: [injected],
        chains: [
          {
            id: '0x1', // chain ID must be in hexadecimel
            token: 'ETH', // main chain token
            label: 'Ethereum Mainnet',
            rpcUrl: `https://mainnet.infura.io/v3/${infuraCredentials.apikey}` // rpcURL required for wallet balances
          },
          {
            id: '0x3',
            token: 'tROP',
            label: 'Ethereum Ropsten Testnet',
            rpcUrl: `https://ropsten.infura.io/v3/${infuraCredentials.apikey}`
          }
        ],
        appMetadata: {
          name: 'Token Allowance Checker',
          description: 'Control ERC20 token approvals',
          icon: TACLogo
        }
      })
      const state = onboard.state.select()

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
      /*
        networkId: requiredNetworkId,
        hideBranding: false,
        subscriptions: {
          wallet: (wallet) => {
            // store selected wallet
            dispatch(setWallet(wallet))
            dispatch(setWeb3Instance(new Web3(wallet.provider)))
          },
          address: (addressId) => {
            if (addressId) {
              console.log(`Wallet address changed to ${addressId}!`)
              dispatch(setWalletAddressThunk(addressId.toLowerCase(), navigate))
            } else {
              console.log(`No access to wallet address`)
            }
          },
          network: (networkId) => {
            const prevNetworkId = getState().onboard.networkId
            if (prevNetworkId !== 0 && prevNetworkId !== networkId) {
              console.log(
                `Switching network from ${prevNetworkId} to ${networkId}`
              )
            }
            dispatch(setRequiredNetworkIdThunk(networkId))
            dispatch(setNetworkId(networkId))
          },
        },
        walletSelect: {
          heading: '',
          description: '',
          // @ts-ignore
          wallets: wallets
        }*/

      dispatch(setOnboardAPI(onboard))
    } catch (e) {
      console.log(`Onboard.js initialization failed.`)
      console.log(e)
    }
  }
