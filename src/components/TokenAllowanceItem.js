import React, {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Header, Loader, Popup, Segment, Table} from 'semantic-ui-react'
import AddressDisplay from './AddressDisplay'
import BN from 'bn.js'
import bn2DisplayString from '@triplespeeder/bn2string'
import EditAllowanceFormContainer from './EditAllowanceFormContainer'
import {Web3Context} from './OnboardContext'
import TransactionModal from './TransactionModal'


const unlimitedAllowance = new BN(2).pow(new BN(256)).subn(1)

const TokenAllowanceItem = ({tokenName, tokenAddress, tokenDecimals, tokenSupply, tokenSymbol, tokenContractInstance, ownerBalance, owner, spenders, spenderENSNames, allowances}) => {
    const web3Context = useContext(Web3Context)
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
        console.log(`Setting new allowance ${newAllowance} for ${editSpender}`)
        setTransactionError('')
        setTransactionHash('')
        setShowEditModal(false)
        setShowTransactionModal(true)
        setConfirming(true)
        let result
        try {
            result = await tokenContractInstance.approve(editSpender, newAllowance.toString(), {
                    from: web3Context.address
                })
            setTransactionHash(result.tx)
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

    const rows = []
    for (const spender of spenders) {
        let allowanceElement
        let criticalAllowance = false
        let editEnabled = false
        let loaded = BN.isBN(allowances[spender]) && BN.isBN(tokenDecimals) && BN.isBN(tokenSupply)
        if (loaded) {
            const value = allowances[spender]
            // wallet account has to be owner in order to edit allowance
            editEnabled = (owner.toLowerCase() === web3Context.address.toLowerCase())
            criticalAllowance = (value.eq(unlimitedAllowance)) || (value.gte(tokenSupply))
            if (criticalAllowance) {
                // \u221E is 'infinity'
                // allowanceElement = <span>{'\u221E'}</span>
                allowanceElement = <em>unlimited</em>
            } else {
                const decimals = tokenDecimals
                const roundToDecimals = new BN(2)
                const {rounded} = bn2DisplayString({value, decimals, roundToDecimals})
                allowanceElement = `${rounded}`
            }
        } else {
            allowanceElement = <Loader active inline size={'mini'}/>
        }
        rows.push(
            <Table.Row key={spender}>
                <Table.Cell>
                    <AddressDisplay address={spender} ensName={spenderENSNames[spender]}/>
                </Table.Cell>
                <Table.Cell negative={criticalAllowance}>
                    {allowanceElement}
                </Table.Cell>
                <Table.Cell>
                    <Popup
                        content={editEnabled ? 'edit allowance' : 'Only address owner can edit allowance'}
                        trigger={<span><Button
                            icon={'edit'}
                            size={'small'}
                            compact
                            primary
                            disabled={!editEnabled}
                            onClick={()=>{openEditModal(spender)}}
                        /></span>}
                    />
                </Table.Cell>
            </Table.Row>
        )
    }

    let tokenDisplayString = tokenName
    if (tokenDisplayString === '') {
        tokenDisplayString = `Unknown ERC20`
    }
    const roundToDecimals = new BN(2)
    if (BN.isBN(ownerBalance) && BN.isBN(tokenDecimals)) {
        const {rounded} = bn2DisplayString({value: ownerBalance, decimals: tokenDecimals, roundToDecimals})
        tokenDisplayString += ` (current balance: ${rounded})`
    }

    let headline = <AddressDisplay address={tokenAddress} ensName={tokenDisplayString}/>

    return (
        <React.Fragment>
            <Segment raised>
                <Header as={'h3'}>
                    {headline}
                </Header>
                <Table basic={'very'} celled selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Spender</Table.HeaderCell>
                            <Table.HeaderCell>Allowance</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            </Segment>

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
        </React.Fragment>
    )
}

TokenAllowanceItem.propTypes = {
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
}


export default TokenAllowanceItem