import React from 'react'
import PropTypes from 'prop-types'
import {Button, Header, Loader, Popup, Segment, Table} from 'semantic-ui-react'
import AddressDisplay from './AddressDisplay'
import BN from 'bn.js'
import bn2DisplayString from '@triplespeeder/bn2string'


const unlimitedAllowance = new BN(2).pow(new BN(256)).subn(1)

const TokenAllowanceItem = ({ tokenName,
                                tokenAddress,
                                tokenDecimals,
                                tokenSupply,
                                tokenSymbol,
                                ownerBalance,
                                spenders,
                                spenderENSNames,
                                allowances,
                                showZeroAllowances,
                                editEnabled,
                                openEditModal,
                            }) => {

    const rows = []
    for (const spender of spenders) {
        let allowanceElement
        let criticalAllowance = false
        let value = undefined
        let loaded = BN.isBN(allowances[spender]) && BN.isBN(tokenDecimals) && BN.isBN(tokenSupply)
        if (loaded) {
            value = allowances[spender]
            criticalAllowance = (value.eq(unlimitedAllowance)) || (value.gte(tokenSupply))
            if (criticalAllowance) {
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

        let actionContent
        if (loaded) {
            actionContent = <Popup
                content={editEnabled ? 'edit allowance' : 'Only address owner can edit allowance'}
                trigger={<span><Button
                    icon={'edit'}
                    size={'small'}
                    compact
                    primary
                    disabled={!editEnabled}
                    onClick={() => {
                        openEditModal(spender)
                    }}
                /></span>}
            />
        } else {
            actionContent = <Loader active inline size={'mini'}/>
        }

        const isZeroAllowance = (value && value.isZero())
        if (!(isZeroAllowance && !showZeroAllowances)) {
            rows.push(
                <Table.Row key={`${tokenAddress}-${spender}`}>
                    <Table.Cell>
                        <AddressDisplay address={spender} ensName={spenderENSNames[spender]}/>
                    </Table.Cell>
                    <Table.Cell negative={criticalAllowance}>
                        {allowanceElement}
                    </Table.Cell>
                    <Table.Cell>
                        {actionContent}
                    </Table.Cell>
                </Table.Row>
            )
        }
    }

    if (rows.length === 0) {
        return null
    }

    let tokenDisplayString = tokenName
    if (tokenDisplayString === '') {
        tokenDisplayString = `Unnamed ERC20`
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
        </React.Fragment>
    )
}

TokenAllowanceItem.propTypes = {
    tokenName: PropTypes.string,
    tokenAddress: PropTypes.string,
    tokenDecimals: PropTypes.object, // bignumber
    tokenSupply: PropTypes.object, // bignumber
    tokenSymbol: PropTypes.string,
    ownerBalance: PropTypes.object, // bignumber
    spenders: PropTypes.array.isRequired,
    spenderENSNames: PropTypes.object.isRequired,
    allowances: PropTypes.object.isRequired,
    showZeroAllowances: PropTypes.bool.isRequired,
    editEnabled: PropTypes.bool.isRequired,
    openEditModal: PropTypes.func.isRequired,
}


export default TokenAllowanceItem