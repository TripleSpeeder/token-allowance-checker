import {
    configureStore,
    Action,
    getDefaultMiddleware,
    AnyAction,
} from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import rootReducer, { RootState } from './rootReducer'
import {
    setOnboardAPI,
    setWeb3Instance,
    setWallet,
} from '../features/onboard/onboardSlice'
import { addContract } from 'features/tokenContracts/tokenContractsSlice'
import { setAllowanceValue } from 'features/allowancesList/AllowancesListSlice'
import { setBalanceValue, addBalance } from 'features/balances/BalancesSlice'

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: {
        ignoredActions: [
            setOnboardAPI.type,
            setWeb3Instance.type,
            setWallet.type,
            addContract.type,
            setAllowanceValue.type,
            addBalance.type,
            setBalanceValue.type,
        ],
        ignoredPaths: [
            'onboard.web3',
            'onboard.wallet',
            'onboard.onboardAPI',
            'tokenContracts.contractsById',
            'allowances.allowanceValuesById',
            'balances.balancesById',
        ],
    },
    immutableCheck: {
        ignoredPaths: [
            'onboard.web3',
            'onboard.wallet',
            'onboard.onboardAPI',
            'tokenContracts.contractsById',
        ],
        warnAfter: 100, // ms
    },
})

const store = configureStore({
    reducer: rootReducer,
    middleware: customizedMiddleware,
})

/*
if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./rootReducer', () => {
        const newRootReducer = require('./rootReducer').default
        store.replaceReducer(newRootReducer)
    })
}
 */

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>

export default store
