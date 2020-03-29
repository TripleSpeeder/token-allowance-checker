import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ResponsiveState {
    mobile: boolean
}

const initialState: ResponsiveState = {
    mobile: false,
}

const responsiveSlice = createSlice({
    name: 'responsive',
    initialState: initialState,
    reducers: {
        setMobile(state, action: PayloadAction<boolean>) {
            state.mobile = action.payload
        },
    },
})

export const { setMobile } = responsiveSlice.actions

export default responsiveSlice.reducer
