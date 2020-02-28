import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Onboard from 'bnc-onboard'
import Web3 from 'web3'
import {AppThunk} from '../../app/store'
import {API, WalletInitOptions} from 'bnc-onboard/dist/src/interfaces'

const onboardApiKey='f4b71bf0-fe50-4eeb-bc2b-b323527ed9e6'
const infuraApiKey='7f230a5ca832426796454c28577d93f2'

const wallets:Partial<WalletInitOptions>[] = [
    { walletName: 'metamask', preferred: true },
    { walletName: 'coinbase', preferred: true },
    {
        walletName: 'walletConnect',
        infuraKey: infuraApiKey,
        preferred: true
    },
    { walletName: 'trust', preferred: true },
    { walletName: 'dapper', preferred: true },
    { walletName: 'authereum', preferred: true },
    { walletName: 'opera' },
    { walletName: 'status' },
    { walletName: 'operaTouch' },
    { walletName: 'torus' },
    { walletName: 'status' },
    {
        walletName: 'ledger',
        rpcUrl: `mainnet.infura.io/v3/${infuraApiKey}`
    },
    {
        walletName: 'trezor',
        appUrl: 'https://tac.dappstar.io',
        email: 'michael@m-bauer.org',
        rpcUrl: `mainnet.infura.io/v3/${infuraApiKey}`
    }]

// Define contents of onboard state
interface IOnboard {
    onboardAPI: API | null,
    web3?: Web3,
    address?: string,
    networkId: number,
    walletSelected: boolean
}

let initialState:IOnboard = {
    networkId: 0,
    onboardAPI: null,
    walletSelected: false
}

const onboardSlice = createSlice({
    name: 'onboard',
    initialState: initialState,
    reducers: {
        setOnboardAPI(state, action: PayloadAction<API>) {
            state.onboardAPI = action.payload
        },
        setWeb3Instance(state, action: PayloadAction<Web3>) {
            state.web3 = action.payload
        },
        setNetworkId(state, action: PayloadAction<number>) {
            state.networkId = action.payload
        },
        setAddress(state, action: PayloadAction<string>) {
            state.address = action.payload
        },
        setWalletSelected(state, action: PayloadAction<boolean>) {
            state.walletSelected = action.payload
        }
    }
})

export const {
    setOnboardAPI,
    setAddress,
    setNetworkId,
    setWeb3Instance,
    setWalletSelected,
} = onboardSlice.actions

export default onboardSlice.reducer

export const selectWallet = () : AppThunk => async (dispatch, getState) => {
    console.log(`Selecting wallet...`)
    const onboardAPI = getState().onboard.onboardAPI
    if (onboardAPI) {
        let result = await onboardAPI.walletSelect()
        console.log(`walletSelect result: ${result}`)
        dispatch(setWalletSelected(result))
    } else {
        console.log(`dispatched selectWallet() without initialization...`)
    }
}

export const checkWallet = () : AppThunk => async (dispatch, getState) => {
    console.log(`checking wallet...`)
    const onboardAPI = getState().onboard.onboardAPI
    if (onboardAPI) {
        let result = await onboardAPI.walletCheck()
        console.log(`walletCheck result: ${result}`)
    } else {
        console.log(`dispatched checkWallet() without initialization...`)
    }
}

export const initialize = (): AppThunk => async dispatch => {
    console.log(`Initializing OnBoard.js...`)
    const onboard = (Onboard({
        dappId: onboardApiKey,
        networkId: 1,
        subscriptions: {
            wallet: wallet => {
                console.log(`${wallet.name} is now connected!`)
                dispatch(setWeb3Instance(new Web3(wallet.provider)))
            },
            address: address => {
                console.log(`Address changed to ${address}!`)
                dispatch(setAddress(address))
            },
            network: networkId => {
                console.log(`NetworkId change to ${networkId}`)
                dispatch(setNetworkId(networkId))
            },
            balance: balance => {}
        },
        walletSelect: {
            heading: 'Select walletName',
            description: 'Select walletName description',
            // @ts-ignore
            wallets: wallets
        }
    }))
    dispatch(setOnboardAPI(onboard))
}
