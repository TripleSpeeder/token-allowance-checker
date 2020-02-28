import React, {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import EditAllowanceFormContainer from './EditAllowanceFormContainer'
import TransactionModal from './TransactionModal'
import TokenAllowanceItem from './TokenAllowanceItem'


const TokenAllowanceItemContainer = ({ tokenName,
                                       tokenAddress,
                                       tokenDecimals,
                                       tokenSupply,
                                       tokenSymbol,
                                       tokenContractInstance,
                                       ownerBalance,
                                       owner,
                                       spenders,
                                       spenderENSNames,
                                       allowances,
                                       showZeroAllowances,
                                       reloadAllowanceFunc }) => {
    const web3Context = undefined //useContext(Web3Context)
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

    return (
        <>
            <TokenAllowanceItem
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
            {showEditModal && <EditAllowanceFormContainer
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

        </>)
}

TokenAllowanceItemContainer.propTypes = {
    tokenName: PropTypes.string,
    tokenAddress: PropTypes.string,
    tokenDecimals: PropTypes.object, // bignumber
    tokenSupply: PropTypes.object, // bignumber
    tokenSymbol: PropTypes.string,
    tokenContractInstance: PropTypes.object,
    owner: PropTypes.string.isRequired,
    ownerBalance: PropTypes.object, // bignumber
    spenders: PropTypes.array.isRequired,
    spenderENSNames: PropTypes.object.isRequired,
    allowances: PropTypes.object.isRequired,
    showZeroAllowances: PropTypes.bool.isRequired,
    reloadAllowanceFunc: PropTypes.func.isRequired,
}


export default TokenAllowanceItemContainer