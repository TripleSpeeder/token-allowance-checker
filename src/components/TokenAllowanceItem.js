import React, {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Header, Icon, Loader, Segment, Table} from 'semantic-ui-react'
import AddressDisplay from './AddressDisplay'
import BN from 'bn.js'
import bn2DisplayString from '@triplespeeder/bn2string'
import EditAllowanceFormContainer from './EditAllowanceFormContainer'
import {Web3Context} from './OnboardGate'


const unlimitedAllowance = new BN(2).pow(new BN(256)).subn(1)

const TokenAllowanceItem = ({tokenName, tokenAddress, tokenDecimals, tokenSupply, tokenSymbol, tokenContractInstance, ownerBalance, spenders, spenderENSNames, allowances}) => {
    const web3Context = useContext(Web3Context)
    const [editSpender, setEditSpender] = useState('')
    const [showEditModal, setShowEditModal] = useState(false)

    const openEditModal = (spender) => {
        setEditSpender(spender)
        setShowEditModal(true)
    }

    const handleSubmitEditAllowance = async (newAllowance) => {
        console.log(`Setting new allowance ${newAllowance} for ${editSpender}`)
        let result
        try {
            result = await tokenContractInstance.approve(editSpender, newAllowance.toString(), {
                    from: web3Context.address
                })
            } catch (e) {
            console.log(`Error while approving: ${e.toString()}`)
        }
        setShowEditModal(false)
    }

    const handleCloseEditAllowance = () => {
        setShowEditModal(false)
    }

    const rows = []
    for (const spender of spenders) {
        let allowanceElement
        let criticalAllowance = false
        let loaded = BN.isBN(allowances[spender]) && BN.isBN(tokenDecimals) && BN.isBN(tokenSupply)
        if (loaded) {
            const value = allowances[spender]
            criticalAllowance = (value.eq(unlimitedAllowance)) || (value.gte(tokenSupply))
            if (criticalAllowance) {
                // \u221E is 'infinity'
                // allowanceElement = <span>{'\u221E'}</span>
                allowanceElement = <em>unlimited</em>
            } else {
                const decimals = tokenDecimals
                const roundToDecimals = new BN(2)
                const {precise, rounded} = bn2DisplayString({value, decimals, roundToDecimals})
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
                    <Button
                        icon
                        labelPosition={'left'}
                        size={'small'}
                        title={'edit allowance'}
                        primary
                        disabled={!loaded}
                        onClick={()=>{openEditModal(spender)}}
                    >
                        <Icon name={'edit'}/>
                        Edit
                    </Button>
                </Table.Cell>
            </Table.Row>
        )
    }

    let headline = tokenName
    if (headline === '') {
        headline = `Unknown ERC20 at ${tokenAddress}`
    }
    const roundToDecimals = new BN(2)
    if (BN.isBN(ownerBalance) && BN.isBN(tokenDecimals)) {
        const {precise, rounded} = bn2DisplayString({value: ownerBalance, decimals: tokenDecimals, roundToDecimals})
        headline += ` (current balance: ${rounded})`
    }

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
    ownerBalance: PropTypes.object, // bignumber
    spenders: PropTypes.array.isRequired,
    spenderENSNames: PropTypes.object.isRequired,
    allowances: PropTypes.object.isRequired,
}


export default TokenAllowanceItem