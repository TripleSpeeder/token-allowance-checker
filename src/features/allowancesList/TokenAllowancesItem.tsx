import React, {useEffect} from 'react'
import {Header, Segment, Table} from 'semantic-ui-react'
import AddressDisplay from '../../components/AddressDisplay'
import BN from 'bn.js'
import {AddressId} from '../addressInput/AddressSlice'
import {AllowanceId, QueryStates} from './AllowancesListSlice'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'app/rootReducer'
import TokenAllowanceItem from './TokenAllowanceItem'
import {addBalanceThunk, buildBalanceId} from '../balances/BalancesSlice'
import bn2DisplayString from '@triplespeeder/bn2string'


interface TokenAllowanceItemProps {
    tokenId: AddressId
    ownerId: AddressId
    allowanceIds: Array<AllowanceId>
}

const unlimitedAllowance = new BN(2).pow(new BN(256)).subn(1)

const TokenAllowancesItem = ({tokenId, ownerId, allowanceIds}:TokenAllowanceItemProps) => {
    const dispatch = useDispatch()
    const tokenContract = useSelector((state:RootState) => state.tokenContracts.contractsById[tokenId])
    const ownerBalance = useSelector((state:RootState) => {
        const balanceId = buildBalanceId(ownerId, tokenId)
        return state.balances.balancesById[balanceId]
    })

    // lazy-load owner balance when contract instance is available
    useEffect(() => {
        if (!ownerBalance && tokenContract?.contractInstance) {
            dispatch(addBalanceThunk(ownerId, tokenId))
        }
    }, [ownerBalance, ownerId, tokenId, tokenContract])

    if (!tokenContract) {
        console.log(`TokenAllowancesItem - waiting for contract!`)
        return null
    }

    let tokenDisplayString = tokenContract.name
    if (tokenDisplayString === '') {
        tokenDisplayString = `Unnamed ERC20`
    }
    const roundToDecimals = new BN(2)
    if (!ownerBalance || ownerBalance.queryState === QueryStates.QUERY_STATE_RUNNING) {
        tokenDisplayString += ` (current balance: loading...)`
    } else {
        const {rounded} = bn2DisplayString({value: ownerBalance.value, decimals: tokenContract.decimals, roundToDecimals})
        tokenDisplayString += ` (current balance: ${rounded} ${tokenContract.symbol})`
    }
    let headline = <div>{tokenDisplayString}</div>

    // populate rows with one entry per allowance from allowanceIds
    let rows:any = []
    allowanceIds.forEach(allowanceId => {
        rows.push(<TokenAllowanceItem key={allowanceId} allowanceId={allowanceId}/>)
    })

    return (
        <Segment raised>
            <Header as={'h3'}>
                {headline}
                <Header.Subheader>
                    <AddressDisplay addressId={tokenId}/>
                </Header.Subheader>
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
/*
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

 */
}

export default TokenAllowancesItem