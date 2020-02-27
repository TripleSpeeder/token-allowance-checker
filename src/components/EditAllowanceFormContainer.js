import React, {useCallback, useContext, useState} from 'react'
import PropTypes from 'prop-types'
import bnToDisplayString from '@triplespeeder/bn2string'
import {toBaseUnit} from './erc20-decimals-conversion'
import EditAllowanceForm from './EditAllowanceForm'
import {Web3Context} from './OnboardContext'


const EditAllowanceFormContainer = ({handleSubmit, handleClose, tokenDecimals, tokenSupply, tokenName, allowance, spender, tokenSymbol, tokenAddress}) => {
    const web3Context = useContext(Web3Context)
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

    const handleChange = (e, { name, value }) => {
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

export default EditAllowanceFormContainer