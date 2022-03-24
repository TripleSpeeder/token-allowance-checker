import { AllowanceId } from 'features/allowancesList/AllowancesListSlice'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EditAllowanceState {
    showModal: boolean
    editAllowanceId: AllowanceId
}

const initialState: EditAllowanceState = {
    showModal: false,
    editAllowanceId: '',
}

const editAllowanceSlice = createSlice({
    name: 'editAllowance',
    initialState: initialState,
    reducers: {
        openEditAllowanceModal(state, action: PayloadAction<AllowanceId>) {
            const allowanceId = action.payload
            state.showModal = true
            state.editAllowanceId = allowanceId
        },
        closeEditAllowanceModal(state) {
            state.showModal = false
        },
    },
})
export const { openEditAllowanceModal, closeEditAllowanceModal } =
    editAllowanceSlice.actions
export default editAllowanceSlice.reducer
