import {configureStore, Action, getDefaultMiddleware} from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'

import rootReducer ,{ RootState } from './rootReducer'
import { setOnboardAPI, setWeb3Instance } from '../features/onboard/onboardSlice'

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: {
        ignoredActions: [
            setOnboardAPI.type,
            setWeb3Instance.type,
        ],
        ignoredPaths: [
            'onboard.web3',
            'onboard.onboardAPI'
        ]
    },
    immutableCheck: {
        ignore: [
            'onboard.web3',
            'onboard.onboardAPI'
        ]
    }
})

const store = configureStore({
    reducer: rootReducer,
    middleware: customizedMiddleware
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