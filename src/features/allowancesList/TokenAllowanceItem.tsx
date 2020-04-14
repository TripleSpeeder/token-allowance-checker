import React, { useEffect } from 'react'
import {
    AllowanceId,
    fetchAllowanceValueThunk,
    QueryStates,
} from './AllowancesListSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'app/rootReducer'
import { Divider, Loader, Table } from 'semantic-ui-react'
import AddressDisplay from 'components/AddressDisplay'
import bnToDisplayString from '@triplespeeder/bn2string'
import BN from 'bn.js'
import TokenAllowanceItemActions from './TokenAllowanceItemActions'

interface TokenAllowanceItemProps {
    allowanceId: AllowanceId
}

const unlimitedAllowance = new BN(2).pow(new BN(256)).subn(1)

const TokenAllowanceItem = ({ allowanceId }: TokenAllowanceItemProps) => {
    const dispatch = useDispatch()
    const allowance = useSelector(
        (state: RootState) => state.allowances.allowancesById[allowanceId]
    )
    const allowanceValue = useSelector(
        (state: RootState) => state.allowances.allowanceValuesById[allowanceId]
    )
    const tokenContract = useSelector(
        (state: RootState) =>
            state.tokenContracts.contractsById[allowance.tokenContractId]
    )
    const spenderAddress = useSelector(
        (state: RootState) => state.addresses.addressesById[allowance.spenderId]
    )
    const { mobile } = useSelector((state: RootState) => state.respsonsive)
    const { networkId } = useSelector((state: RootState) => state.onboard)

    // lazy-load allowance value
    useEffect(() => {
        if (allowanceValue.state === QueryStates.QUERY_STATE_INITIAL) {
            dispatch(fetchAllowanceValueThunk(allowanceId))
        }
    }, [allowanceValue, allowanceId, dispatch])

    let allowanceElement, criticalAllowance, positiveAllowance
    switch (allowanceValue.state) {
        case QueryStates.QUERY_STATE_RUNNING:
            allowanceElement = <Loader active inline size={'mini'} />
            break
        case QueryStates.QUERY_STATE_COMPLETE:
            positiveAllowance = allowanceValue.value.isZero()
            criticalAllowance =
                allowanceValue.value.eq(unlimitedAllowance) ||
                allowanceValue.value.gte(tokenContract.totalSupply)
            if (criticalAllowance) {
                allowanceElement = <em>unlimited</em>
            } else {
                const roundToDecimals = new BN('2')
                const { /*precise,*/ rounded } = bnToDisplayString({
                    value: allowanceValue.value,
                    decimals: tokenContract.decimals,
                    roundToDecimals,
                })
                allowanceElement = <span>{rounded}</span>
            }
            break
        case QueryStates.QUERY_STATE_ERROR:
            allowanceElement = <span>error</span>
            break
        case QueryStates.QUERY_STATE_INITIAL:
        default:
            allowanceElement = ''
    }

    const lastChangeString = new Date(
        allowance.lastChangedTimestamp
    ).toDateString()

    const addressCell = (
        <Table.Cell>
            <AddressDisplay
                ethAddress={spenderAddress}
                networkId={networkId}
                mobile={mobile}
            />
        </Table.Cell>
    )

    let allowanceCell
    let lastChangeCell
    if (mobile) {
        allowanceCell = (
            <Table.Cell
                negative={criticalAllowance}
                positive={positiveAllowance}
                textAlign={'right'}
            >
                {allowanceElement}
                <Divider fitted />
                <small>{lastChangeString}</small>
            </Table.Cell>
        )
        lastChangeCell = null
    } else {
        allowanceCell = (
            <Table.Cell
                negative={criticalAllowance}
                positive={positiveAllowance}
                textAlign={'right'}
            >
                {allowanceElement}
            </Table.Cell>
        )
        lastChangeCell = <Table.Cell collapsing>{lastChangeString}</Table.Cell>
    }

    const actionCell = (
        <Table.Cell collapsing>
            <TokenAllowanceItemActions allowanceId={allowanceId} />
        </Table.Cell>
    )

    return (
        <Table.Row key={`${allowanceId}`}>
            {addressCell}
            {allowanceCell}
            {lastChangeCell}
            {actionCell}
        </Table.Row>
    )
}

export default TokenAllowanceItem
