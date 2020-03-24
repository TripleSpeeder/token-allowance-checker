import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import namehash from 'eth-ens-namehash'
import { AppDispatch, AppThunk } from '../../app/store'

export enum ResolvingStates {
    Initial,
    Resolving,
    Resolved,
}
export type AddressId = string

// the plain address data without internal info like ID or resolving state
export interface EthAddress {
    address: string // the actual address
    ensName?: string // ensName for this address
    resolvingState: ResolvingStates
    esContractName?: string
}

export interface EthAddressPayload {
    id: AddressId
    ethAddress: EthAddress
}

interface EtherscanContractNamePayload {
    id: AddressId
    esContractName: string
}

interface ResolvingStatePayload {
    id: AddressId
    resolvingState: ResolvingStates
}

interface ENSNamePayload {
    id: AddressId
    ensName: string
}

// The state contains all known EthAddressess, indexed by the address id
interface EthAddressesState {
    addressesById: Record<AddressId, EthAddress>
    checkAddressId: AddressId | undefined
    walletAddressId: AddressId | undefined
}

// initial state: contains 3 test entries
const initialState: EthAddressesState = {
    addressesById: {},
    walletAddressId: undefined,
    checkAddressId: undefined,
}

const addressSlice = createSlice({
    name: 'ethAddresses',
    initialState: initialState,
    reducers: {
        addAddress: {
            reducer(state, action: PayloadAction<EthAddressPayload>) {
                const { id, ethAddress } = action.payload
                state.addressesById[id] = ethAddress
            },
            prepare(address: string) {
                return {
                    payload: {
                        id: address,
                        ethAddress: {
                            address: address,
                            resolvingState: ResolvingStates.Initial,
                        },
                    },
                }
            },
        },
        setResolvingState(state, action: PayloadAction<ResolvingStatePayload>) {
            const { id, resolvingState } = action.payload
            state.addressesById[id].resolvingState = resolvingState
        },
        setENSName(state, action: PayloadAction<ENSNamePayload>) {
            const { id, ensName } = action.payload
            state.addressesById[id].ensName = ensName
        },
        setCheckAddressId(state, action: PayloadAction<AddressId>) {
            state.checkAddressId = action.payload
        },
        clearCheckAddressId(state) {
            state.checkAddressId = undefined
        },
        setWalletAddressId(state, action: PayloadAction<AddressId>) {
            state.walletAddressId = action.payload
        },
        setEtherscanContractName(
            state,
            action: PayloadAction<EtherscanContractNamePayload>
        ) {
            const { id, esContractName } = action.payload
            state.addressesById[id].esContractName = esContractName
        },
    },
})

export const {
    addAddress,
    setResolvingState,
    setENSName,
    setCheckAddressId,
    clearCheckAddressId,
    setWalletAddressId,
    setEtherscanContractName,
} = addressSlice.actions

export default addressSlice.reducer

export const fetchEtherscanNameThunk = (
    addressId: AddressId
): AppThunk => async (dispatch: AppDispatch, getState) => {
    const { networkId } = getState().onboard
    const apiKey = 'THS8KWYM6KZ8WBP3DXKUDR7UKCRB8YIRGH'
    let apiHost
    switch (networkId) {
        case 1:
            // mainnet
            apiHost = 'api.etherscan.io'
            break
        case 3:
            // Ropsten
            apiHost = 'api-ropsten.etherscan.io'
            break
        default:
            throw Error(`Network ${networkId} not supported`)
    }
    const requestUrl = `https://${apiHost}/api?module=contract&action=getsourcecode&address=${addressId}&apikey=${apiKey}`
    const response = await fetch(requestUrl)
    const data = await response.json()
    if (data.message === 'OK') {
        const contractName: string = data?.result[0]?.ContractName
        if (contractName?.length) {
            dispatch(
                setEtherscanContractName({
                    id: addressId,
                    esContractName: contractName,
                })
            )
        }
    } else {
        console.log(
            `Got message ${data.message} fetching contract data from Etherscan API.`
        )
    }
}

export const addAddressThunk = (address: string): AppThunk => async (
    dispatch: AppDispatch,
    getState
) => {
    address = address.toLowerCase()
    // prevent duplicates
    if (Object.keys(getState().addresses.addressesById).includes(address)) {
        return
    }
    const web3 = getState().onboard.web3
    if (web3) {
        // first add address
        dispatch(addAddress(address))

        // indicate starting resolving process
        dispatch(
            setResolvingState({
                id: address,
                resolvingState: ResolvingStates.Resolving,
            })
        )

        // look for reverse ENS name
        try {
            const reverseENSLookupName = address.substr(2) + '.addr.reverse'
            const ResolverContract = await web3.eth.ens.resolver(
                reverseENSLookupName
            )
            const reverseENS = await ResolverContract.methods
                .name(namehash.hash(reverseENSLookupName))
                .call()
            console.log(`Got reverseENS: ${reverseENS}`)
            dispatch(
                setENSName({
                    id: address,
                    ensName: reverseENS,
                })
            )
        } catch (error) {
            // console.log(`Error getting reverse ENS: ${error}`)
        }

        dispatch(
            setResolvingState({
                id: address,
                resolvingState: ResolvingStates.Resolved,
            })
        )
    } else {
        console.log(`AddressSlice: Can not add ${address} - web3 still missing`)
    }
}

export const setCheckAddressThunk = (checkAddress: string): AppThunk => async (
    dispatch: AppDispatch
) => {
    if (checkAddress.endsWith('.eth')) {
        // TODO: handle ENS names
        console.log(`ENS name not yet handled: ${checkAddress}`)
        return
    }
    dispatch(addAddressThunk(checkAddress))
    dispatch(setCheckAddressId(checkAddress))
}

export const setWalletAddressThunk = (
    walletAddress: string
): AppThunk => async (dispatch: AppDispatch) => {
    console.log(`Got new address from wallet: ${walletAddress}`)
    dispatch(addAddressThunk(walletAddress))
    dispatch(setWalletAddressId(walletAddress))
}
