import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import rootReducer, { RootState } from './rootReducer'
import {
    setOnboardAPI,
    setWeb3Instance,
} from '../features/onboard/onboardSlice'
import { addContract } from 'features/tokenContracts/tokenContractsSlice'
import { setAllowanceValue } from 'features/allowancesList/AllowancesListSlice'
import { setBalanceValue, addBalance } from 'features/balances/BalancesSlice'

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: {
        ignoredActions: [
            setOnboardAPI.type,
            setWeb3Instance.type,
            addContract.type,
            setAllowanceValue.type,
            addBalance.type,
            setBalanceValue.type,
        ],
        ignoredPaths: [
            'onboard.web3',
            'onboard.onboardAPI',
            'tokenContracts.contractsById',
            'allowances.allowanceValuesById',
            'balances.balancesById',
        ],
    },
    immutableCheck: {
        ignore: [
            'onboard.web3',
            'onboard.onboardAPI',
            'tokenContracts.contractsById',
        ],
    },
})

const store = configureStore({
    reducer: rootReducer,
    middleware: customizedMiddleware,
})

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./rootReducer', () => {
        const newRootReducer = require('./rootReducer').default
        store.replaceReducer(newRootReducer)
    })
}

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export default store
