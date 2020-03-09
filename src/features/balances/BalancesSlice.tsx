import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AddressId } from 'features/addressInput/AddressSlice';
import {QueryStates} from '../allowancesList/AllowancesListSlice'
import BN from 'bn.js'
import {AppDispatch, AppThunk} from '../../app/store'

export type BalanceId = string

interface Balance {
    id: BalanceId
    addressId: AddressId
    tokenContractId: AddressId
    queryState: QueryStates
    value: BN
}

interface BalancePayload {
    id: BalanceId,
    balance: Balance
}

interface ValuePayload {
    id: BalanceId,
    value: BN
}

interface QueryStatePayload {
    id: BalanceId,
    queryState: QueryStates
}

interface BalancesState {
    balancesById: Record<BalanceId, Balance>
}

let initialState:BalancesState = {
    balancesById: {}
}

const balancesSlice = createSlice({
    name: 'balances',
    initialState: initialState,
    reducers: {
        addBalance: {
            reducer(state, action:PayloadAction<BalancePayload>) {
                const {id, balance} = action.payload
                state.balancesById[id] = balance
            },
            prepare(id: BalanceId, addressId: AddressId, tokenContractId: AddressId) {
                return {
                    payload: {
                        id: id,
                        balance: {
                            id,
                            addressId,
                            tokenContractId,
                            queryState: QueryStates.QUERY_STATE_INITIAL,
                            value: new BN('-1')
                        }
                    }
                }
            }
        },
        setBalanceValue(state, action: PayloadAction<ValuePayload>) {
            const {id, value} = action.payload
            state.balancesById[id].value = value
        },
        setBalanceQuerystate(state, action: PayloadAction<QueryStatePayload>) {
            const {id, queryState} = action.payload
            state.balancesById[id].queryState = queryState
        }
    }
})

export const buildBalanceId = (addressId: AddressId, tokenContractId: AddressId) => {
    return `${addressId}-${tokenContractId}`
}

export const { addBalance, setBalanceValue, setBalanceQuerystate } = balancesSlice.actions

/*
 Create a new balance entry and fetch balance
 */
export const addBalanceThunk = (addressId: AddressId, tokenContractId: AddressId): AppThunk => async (dispatch:AppDispatch, getState) => {
    const balanceId = buildBalanceId(addressId, tokenContractId)
    dispatch(addBalance(balanceId, addressId, tokenContractId))
    dispatch(setBalanceQuerystate({
        id: balanceId,
        queryState: QueryStates.QUERY_STATE_RUNNING
    }))
    const tokenContract = getState().tokenContracts.contractsById[tokenContractId]
    const address = getState().addresses.addressesById[addressId]
    try {
        const balance = await tokenContract.contractInstance.balanceOf(address.address)
        dispatch(setBalanceValue({
            id: balanceId,
            value: balance
        }))
        dispatch(setBalanceQuerystate({
            id: balanceId,
            queryState: QueryStates.QUERY_STATE_COMPLETE
        }))
    } catch(error) {
        console.log(`Error getting balance: ${error}`)
        dispatch(setBalanceQuerystate({
            id: balanceId,
            queryState: QueryStates.QUERY_STATE_ERROR
        }))
    }
}
export default balancesSlice.reducer
