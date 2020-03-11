import React, {useCallback, useContext, useState} from 'react'
import bnToDisplayString from '@triplespeeder/bn2string'
import {toBaseUnit} from '../../toBeMigrated/erc20-decimals-conversion'
import EditAllowanceForm from './EditAllowanceForm'
import {useDispatch, useSelector} from 'react-redux'
import { RootState } from 'app/rootReducer'
import BN from 'bn.js'
import { closeEditAllowanceModal } from './EditAllowanceSlice'
import {setAllowanceThunk} from '../tokenContracts/tokenContractsSlice'


const EditAllowanceFormContainer = () => {
    const dispatch = useDispatch()
    const allowance = useSelector((state:RootState) =>
        state.allowances.allowancesById[state.editAllowance.editAllowanceId]
    )
    const allowanceValue = useSelector((state:RootState) => state.allowances.allowanceValuesById[state.editAllowance.editAllowanceId])
    const tokenContract = useSelector((state:RootState) => state.tokenContracts.contractsById[allowance.tokenContractId])
    const spender = useSelector((state:RootState) => state.addresses.addressesById[allowance.spenderId] )
    const [newAllowance, setNewAllowance] = useState('0')

    const convertAllowanceToDisplaystring = useCallback(() => {
        if (allowanceValue.value.gte(tokenContract.totalSupply)) {
            return 'unlimited'
        } else {
            const allowanceDisplay = bnToDisplayString({
                value: allowanceValue.value,
                decimals: tokenContract.decimals,
                roundToDecimals: new BN(2)
            })
            return allowanceDisplay.rounded
        }
    }, [allowance, tokenContract])

    const handleAllowanceInputChange = (e: React.FormEvent<EventTarget>) => {
        let {name, value} = e.target as HTMLInputElement;
        console.log(`handleChange: ${name} - ${value}`)
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
        const newValue = toBaseUnit(newAllowance, tokenContract.decimals, BN)
        dispatch(closeEditAllowanceModal())
        dispatch(setAllowanceThunk(tokenContract.addressId, spender.address, newValue, allowance.id))
    }

    return (
        <EditAllowanceForm
            newAllowance={newAllowance}
            currentAllowance={convertAllowanceToDisplaystring()}
            tokenAddress={tokenContract.addressId}
            handleClose={handleClose}
            spenderAddress={spender.address}
            spenderENSName={spender.ensName || ''}
            tokenName={tokenContract.name}
            handleChange={handleAllowanceInputChange}
            handleSubmit={handleSubmit}
            tokenSymbol={tokenContract.symbol}
        />
    )
}

export default EditAllowanceFormContainer