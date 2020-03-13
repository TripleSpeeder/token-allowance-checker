import {AllowanceId} from '../allowancesList/AllowancesListSlice'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export enum TransactionStates {
    INITIAL,
    SUBMITTED,
    CONFIRMED,
    FAILED
}

export type TransactionId = string
export interface editAllowanceTransaction {
    transactionId: TransactionId
    allowanceId: AllowanceId
    transactionState: TransactionStates
    transactionHash?: string
    error?: string
}

interface transactionTrackerState {
    transactionsById:  Record<TransactionId, editAllowanceTransaction>
}

interface updateTransactionPayload {
    transactionId: TransactionId,
    transactionState?: TransactionStates
    transactionHash?: string
    error?: string
}

const initialState:transactionTrackerState = {
    transactionsById: {}
}

const TransactionTrackerSlice = createSlice({
    name: 'transactionTracker',
    initialState: initialState,
    reducers: {
        addTransaction(state, action:PayloadAction<editAllowanceTransaction>){
            const editAllowanceTransaction = action.payload
            state.transactionsById[editAllowanceTransaction.transactionId] = editAllowanceTransaction
        },
        updateTransaction(state, action:PayloadAction<updateTransactionPayload>)  {
            const {transactionId, transactionState, error, transactionHash} = action.payload
            transactionState && (state.transactionsById[transactionId].transactionState = transactionState)
            error && (state.transactionsById[transactionId].error = error)
            transactionHash && (state.transactionsById[transactionId].transactionHash = transactionHash)
        }
    }
})

export const {addTransaction, updateTransaction} = TransactionTrackerSlice.actions
export default TransactionTrackerSlice.reducer