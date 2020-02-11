import React from 'react'
import PropTypes from 'prop-types'
import {Button, Header, Icon, Loader, Segment, Table} from 'semantic-ui-react'
import AddressDisplay from './AddressDisplay'
import BN from 'bn.js'
import bn2DisplayString from '@triplespeeder/bn2string'

const unlimitedAllowance = new BN(2).pow(new BN(256)).subn(1)

const TokenAllowanceItem = ({tokenName, tokenAddress, tokenDecimals, tokenSupply, tokenSymbol, ownerBalance, spenders, spenderENSNames, allowances}) => {
    const rows = []
    for (const spender of spenders) {
        let allowanceElement
        let criticalAllowance = false
        if (BN.isBN(allowances[spender]) && BN.isBN(tokenDecimals) && BN.isBN(tokenSupply)) {
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
                    <Button icon labelPosition={'left'} size={'small'} title={'set zero allowance'} primary><Icon name={'erase'}/>Clear allowance</Button>
                </Table.Cell>
            </Table.Row>
        )
    }

    let headline = tokenName
    if (headline === '') {
        headline = `Unnamed (${tokenAddress})`
    }
    const roundToDecimals = new BN(2)
    if (BN.isBN(ownerBalance) && BN.isBN(tokenDecimals)) {
        const {precise, rounded} = bn2DisplayString({value: ownerBalance, decimals: tokenDecimals, roundToDecimals})
        headline += ` (current balance: ${rounded})`
    }

    return (
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
    )
}

TokenAllowanceItem.propTypes = {
    tokenName: PropTypes.string,
    tokenAddress: PropTypes.string.isRequired,
    tokenDecimals: PropTypes.object.isRequired, // bignumber
    tokenSupply: PropTypes.object.isRequired, // bignumber
    tokenSymbol: PropTypes.string.isRequired,
    ownerBalance: PropTypes.object, // bignumber
    decimals: PropTypes.object, // bignumber
    spenders: PropTypes.array.isRequired,
    spenderENSNames: PropTypes.object.isRequired,
    allowances: PropTypes.object.isRequired,
}


export default TokenAllowanceItem