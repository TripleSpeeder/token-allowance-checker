import React, {useCallback, useContext, useState} from 'react'
import bnToDisplayString from '@triplespeeder/bn2string'
import {toBaseUnit} from '../../toBeMigrated/erc20-decimals-conversion'
import EditAllowanceForm from './EditAllowanceForm'
import {AllowanceId} from '../allowancesList/AllowancesListSlice'
import {useDispatch, useSelector} from 'react-redux'
import { RootState } from 'app/rootReducer'
import BN from 'bn.js'
import { closeEditAllowanceModal } from './EditAllowanceSlice'


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

/*
const EditAllowanceFormContainer2 = ({handleSubmit, handleClose, tokenDecimals, tokenSupply, tokenName, allowance, spender, tokenSymbol, tokenAddress}) => {
    const web3Context = undefined//useContext(Web3Context)
    const [newAllowance, setNewAllowance] = useState('0')

    const convertAllowanceToDisplaystring = useCallback(() => {
        if (allowance.gte(tokenSupply)) {
            return 'unlimited'
        } else {
            const allowanceDisplay = bnToDisplayString({
                value: allowance,
                decimals: tokenDecimals,
                roundToDecimals: web3Context.web3.utils.toBN(2)
            })
            return allowanceDisplay.rounded
        }
    }, [allowance, tokenDecimals, tokenSupply, web3Context])

    const handleChange = (e: React.FormEvent<EventTarget>) => {
        let {name, value} = e.target as HTMLInputElement;
        console.log(`handleChange: ${name} - ${value}`)
        if (parseFloat(value) < 0) {
            value = '0'
        }
        setNewAllowance(value)
    }
    const localHandleSubmit = () => {
        // convert 'newAllowance' number to token baseunit
        let amount = toBaseUnit(newAllowance, tokenDecimals, web3Context.web3.utils.BN)
        handleSubmit(amount)
    }

    return (
        <EditAllowanceForm
            currentAllowance={convertAllowanceToDisplaystring()}
            handleClose={handleClose}
            spenderAddress={spender}
            showModal={true}
            tokenName={tokenName}
            handleChange={handleChange}
            handleSubmit={localHandleSubmit}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            newAllowance={newAllowance}
            />
    )
}

EditAllowanceFormContainer.propTypes = {
    tokenDecimals: PropTypes.object.isRequired, // bignumber
    tokenName: PropTypes.string.isRequired,
    tokenSymbol: PropTypes.string.isRequired,
    tokenSupply: PropTypes.object.isRequired,
    tokenAddress: PropTypes.string.isRequired,
    allowance: PropTypes.object.isRequired, // bignumber
    spender: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
}
*/
export default EditAllowanceFormContainer