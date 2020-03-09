import React, {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import EditAllowanceFormContainer from '../../components/EditAllowanceFormContainer'
import TransactionModal from '../../components/TransactionModal'
import TokenAllowancesItem from './TokenAllowancesItem'
import {useSelector} from 'react-redux'
import {RootState} from '../../app/rootReducer'
import {AllowanceId} from './AllowancesListSlice'
import {AddressId} from '../addressInput/AddressSlice'

interface AllowanceItemContainerProps {
    tokenId: AddressId
    ownerId: AddressId
}

const TokenAllowanceItemContainer = ({ tokenId, ownerId }:AllowanceItemContainerProps) => {

    // collect all allowances of tokenId owned by ownerId
    const allowanceIds = useSelector((state:RootState) => {
        return state.allowances.allowanceIdsByOwnerId[ownerId].filter(allowanceId => {
            // return allowanceId if it is matching the current tokenId
            return (state.allowances.allowancesById[allowanceId].tokenContractId === tokenId)
        })
    })


//    const allowance = useSelector((state:RootState) => state.allowances.allowancesById[allowanceId])
//    const tokenContract = useSelector((state:RootState) => state.tokenContracts.contractsById[allowance.tokenContractId])
//    const owner = useSelector((state:RootState) => state.addresses.addressesById[allowance.ownerId])
 //   const spender = useSelector((state:RootState) => state.addresses.addressesById[allowance.spenderId])


/*
    const [editSpender, setEditSpender] = useState('')
    const [showEditModal, setShowEditModal] = useState(false)
    const [showTransactionModal, setShowTransactionModal] = useState(false)
    const [transactionError, setTransactionError] = useState('')
    const [transactionHash, setTransactionHash] = useState('')
    const [confirming, setConfirming] = useState(false)

    const openEditModal = (spender) => {
        setEditSpender(spender)
        setShowEditModal(true)
    }

    const handleSubmitEditAllowance = async (newAllowance) => {
        // make sure wallet is ready to transact before continuing
        const loginResult = await web3Context.loginFunction()
        if (!loginResult) {
            console.log(`User failed to login. Cant create transaction.`)
            return
        } else {
            console.log(`User successfully logged into wallet`)
        }
        console.log(`Setting new allowance ${newAllowance} for ${editSpender}`)
        setTransactionError('')
        setTransactionHash('')
        setShowEditModal(false)
        setShowTransactionModal(true)
        setConfirming(true)
        let result
        try {
            result = await tokenContractInstance.approve(editSpender, newAllowance.toString(), {
                from: web3Context.address,
            })
            setTransactionHash(result.tx)
            reloadAllowanceFunc(owner, editSpender)
        } catch (e) {
            console.log(`Error while approving: ${e.message}`)
            setTransactionError(e.message)
        }
        setConfirming(false)
    }

    const handleCloseEditAllowance = () => {
        setShowEditModal(false)
    }

    const handleCloseTransactionModal = () => {
        setShowTransactionModal(false)
    }
    const editEnabled = (owner.toLowerCase() === web3Context.address.toLowerCase())
    */
    const editEnabled = false

    return null

/*
    return (
        <>
            <TokenAllowancesItem
                allowances={allowances}
                tokenDecimals={tokenDecimals}
                tokenSupply={tokenSupply}
                tokenAddress={tokenAddress}
                tokenName={tokenName}
                editEnabled={editEnabled}
                spenders={spenders}
                spenderENSNames={spenderENSNames}
                showZeroAllowances={showZeroAllowances}
                openEditModal={openEditModal}
                ownerBalance={ownerBalance}
            />
        </>)
*/
    /*            {showEditModal && <EditAllowanceFormContainer
                spender={editSpender}
                tokenDecimals={tokenDecimals}
                allowance={allowances[editSpender]}
                tokenSymbol={tokenSymbol}
                tokenName={tokenName}
                tokenSupply={tokenSupply}
                tokenAddress={tokenAddress}
                handleSubmit={handleSubmitEditAllowance}
                handleClose={handleCloseEditAllowance}
            />}
            {showTransactionModal && <TransactionModal
                showModal={showTransactionModal}
                isConfirming={confirming}
                handleClose={handleCloseTransactionModal}
                error={transactionError}
                transactionHash={transactionHash}
            />}
     */
}

export default TokenAllowanceItemContainer