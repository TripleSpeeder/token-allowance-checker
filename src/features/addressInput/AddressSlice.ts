import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import namehash from 'eth-ens-namehash'
import {AppDispatch, AppThunk} from '../../app/store'
import { addContract } from 'features/tokenContracts/tokenContractsSlice'

enum ResolvingStates {
    Initial,
    Resolving,
    Resolved
}
export type AddressId = string

// the plain address data without internal info like ID or resolving state
interface EthAddress {
    address: string       // the actual address
    description?: string  // user-defined description
    ensName?: string      // ensName for this address
}

// plain address data extended with resolving state
type EthAddressWithId = {
    resolvingState?: ResolvingStates
} & EthAddress

export interface EthAddressPayload {
    id: AddressId,
    ethAddressWithId: EthAddressWithId
}

interface ResolvingStatePayload {
    id: AddressId,
    resolvingState: ResolvingStates
}

interface ENSNamePayload {
    id: AddressId,
    ensName: string
}

// The state contains all known EthAddressess, indexed by the address id
interface EthAddressesState {
    addressesById: Record<AddressId, EthAddressWithId>
}

// initial state: contains 3 test entries
let initialState:EthAddressesState = {
    addressesById: {}
}

const addressSlice = createSlice({
    name: 'ethAddresses',
    initialState: initialState,
    reducers: {
        addAddress: {
            reducer(state, action: PayloadAction<EthAddressPayload>) {
                const {id, ethAddressWithId} = action.payload
                state.addressesById[id] = ethAddressWithId
            },
            prepare(address: string) {
                return {
                    payload: {
                        id: address,
                        ethAddressWithId: {
                            address: address,
                            resolvingState: ResolvingStates.Initial
                        }
                    }
                }
            }
        },
        setResolvingState(state, action: PayloadAction<ResolvingStatePayload>) {
            const {id, resolvingState} = action.payload
            state.addressesById[id].resolvingState = resolvingState
        },
        setENSName(state, action: PayloadAction<ENSNamePayload>) {
            const {id, ensName} = action.payload
            state.addressesById[id].ensName = ensName
        }
    }
})

export const { addAddress, setResolvingState, setENSName } = addressSlice.actions

export default addressSlice.reducer

export const addAddressThunk = (address: string): AppThunk => async (dispatch: AppDispatch, getState) => {
    const web3 = getState().onboard.web3
    if (web3) {
        // first add address
        dispatch(addAddress(address))
        // indicate starting resolving process
        dispatch(setResolvingState({
            id: address,
            resolvingState: ResolvingStates.Resolving
        }))
        try {
            const reverseENSLookupName = address.toLowerCase().substr(2) + '.addr.reverse'
            const ResolverContract = await web3.eth.ens.resolver(reverseENSLookupName);
            const reverseENS = await ResolverContract.methods.name(namehash.hash(reverseENSLookupName)).call()
            console.log(`Got reverseENS: ${reverseENS}`)
            dispatch(setENSName({
                id: address,
                ensName: reverseENS
            }))
        } catch(error) {
            // console.log(`Error getting reverse ENS: ${error}`)
        }
        dispatch(setResolvingState({
            id: address,
            resolvingState: ResolvingStates.Resolved
        }))
    }
}

