import { combineReducers } from '@reduxjs/toolkit'
import onboardReducer from 'features/onboard/onboardSlice'
import addressesReducer from 'features/addressInput/AddressSlice'
import tokenContractReducer from 'features/tokenContracts/tokenContractsSlice'
import allowancesReducer from 'features/allowancesList/AllowancesListSlice'
import balancesReducer from 'features/balances/BalancesSlice'
import editAllowanceReducer from 'features/editAllowance/EditAllowanceSlice'
import transactionTrackerReducer from 'features/transactionTracker/TransactionTrackerSlice'

const rootReducer = combineReducers({
    onboard: onboardReducer,
    addresses: addressesReducer,
    tokenContracts: tokenContractReducer,
    allowances: allowancesReducer,
    balances: balancesReducer,
    editAllowance: editAllowanceReducer,
    transactions: transactionTrackerReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
