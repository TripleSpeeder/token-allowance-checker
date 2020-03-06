import { combineReducers } from '@reduxjs/toolkit'
import onboardReducer from 'features/onboard/onboardSlice'
import addressesReducer from 'features/addressInput/AddressSlice'
import tokenContractReducer from 'features/tokenContracts/tokenContractsSlice'
import allowancesReducer from 'features/allowancesList/AllowancesListSlice'

const rootReducer = combineReducers({
    onboard: onboardReducer,
    addresses: addressesReducer,
    tokenContracts: tokenContractReducer,
    allowances: allowancesReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
