import React, { useCallback, useState } from 'react'
import bnToDisplayString from '@triplespeeder/bn2string'
import { toBaseUnit } from '../../utils/erc20-decimals-conversion'
import EditAllowanceForm from './EditAllowanceForm'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'app/rootReducer'
import BN from 'bn.js'
import { closeEditAllowanceModal } from './EditAllowanceSlice'
import { setAllowanceThunk } from '../tokenContracts/tokenContractsSlice'

const EditAllowanceFormContainer = () => {
    const dispatch = useDispatch()
    const allowance = useSelector(
        (state: RootState) =>
            state.allowances.allowancesById[state.editAllowance.editAllowanceId]
    )
    const allowanceValue = useSelector(
        (state: RootState) =>
            state.allowances.allowanceValuesById[
                state.editAllowance.editAllowanceId
            ]
    )
    const tokenContract = useSelector(
        (state: RootState) =>
            state.tokenContracts.contractsById[allowance.tokenContractId]
    )
    const spender = useSelector(
        (state: RootState) => state.addresses.addressesById[allowance.spenderId]
    )
    const mobile = useSelector((state: RootState) => state.respsonsive.mobile)
    const [newAllowance, setNewAllowance] = useState('0')

    const convertAllowanceToDisplaystring = useCallback(() => {
        if (allowanceValue.value.gte(tokenContract.totalSupply)) {
            return 'unlimited'
        } else {
            const allowanceDisplay = bnToDisplayString({
                value: allowanceValue.value,
                decimals: tokenContract.decimals,
                roundToDecimals: new BN(2),
            })
            return allowanceDisplay.rounded
        }
    }, [
        allowanceValue.value,
        tokenContract.totalSupply,
        tokenContract.decimals,
    ])

    const handleAllowanceInputChange = (e: React.FormEvent<EventTarget>) => {
        let { value } = e.target as HTMLInputElement
        // console.log(`handleChange: ${value}`)
        if (parseFloat(value) < 0) {
            value = '0'
        }
        setNewAllowance(value)
    }

    const handleClose = () => {
        dispatch(closeEditAllowanceModal())
    }

    const handleSubmit = () => {
        console.log(`Submitted new allowance: ${newAllowance}`)
        // convert 'newAllowance' number to token baseunit
        const newValue = toBaseUnit(newAllowance, tokenContract.decimals)
        dispatch(closeEditAllowanceModal())
        dispatch(
            setAllowanceThunk(
                tokenContract.addressId,
                spender.address,
                newValue,
                allowance.id
            )
        )
    }

    const tokenName =
        tokenContract.name !== '' ? tokenContract.name : 'Unnamed ERC20'

    return (
        <EditAllowanceForm
            mobile={mobile}
            newAllowance={newAllowance}
            currentAllowance={convertAllowanceToDisplaystring()}
            tokenAddress={tokenContract.addressId}
            handleClose={handleClose}
            spender={spender}
            tokenName={tokenName}
            handleChange={handleAllowanceInputChange}
            handleSubmit={handleSubmit}
            tokenSymbol={tokenContract.symbol}
        />
    )
}

export default EditAllowanceFormContainer
