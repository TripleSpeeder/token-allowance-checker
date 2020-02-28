import { combineReducers } from '@reduxjs/toolkit'
import onboardReducer from '../features/onboard/onboardSlice'
import addressesReducer from '../features/addressInput/AddressSlice'
import tokenContractReducer from '../features/tokenContracts/tokenContractsSlice'

const rootReducer = combineReducers({
    onboard: onboardReducer,
    addresses: addressesReducer,
    tokenContracts: tokenContractReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
