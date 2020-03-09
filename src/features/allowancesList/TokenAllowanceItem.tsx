import React, {useEffect} from 'react'
import {AllowanceId, fetchAllowanceValueThunk, QueryStates} from './AllowancesListSlice'
import {useDispatch, useSelector} from 'react-redux'
import { RootState } from 'app/rootReducer'
import { Table, Loader } from 'semantic-ui-react'
import AddressDisplay from 'components/AddressDisplay'

interface TokenAllowanceItemProps {
    allowanceId: AllowanceId
}

const TokenAllowanceItem = ({allowanceId}:TokenAllowanceItemProps) => {
    const dispatch = useDispatch()
    const allowance      = useSelector((state:RootState) => state.allowances.allowancesById[allowanceId])
    const allowanceValue = useSelector((state:RootState) => state.allowances.allowanceValuesById[allowanceId])
    const owner          = useSelector((state:RootState) => state.addresses.addressesById[allowance.ownerId])
    const spender        = useSelector((state:RootState) => state.addresses.addressesById[allowance.spenderId])
    const tokenContract  = useSelector((state:RootState) => state.tokenContracts.contractsById[allowance.tokenContractId])

    // trigger loading of allowance value if necessary
    useEffect(()=>{
        if (allowanceValue.state === QueryStates.QUERY_STATE_INITIAL) {
            dispatch(fetchAllowanceValueThunk(allowanceId))
        }
    }, [allowanceValue, allowanceId])

    // TODO: const criticalAllowance = (value.eq(unlimitedAllowance)) || (value.gte(tokenSupply))
    const criticalAllowance = false

    let allowanceElement
    switch(allowanceValue.state) {
        case QueryStates.QUERY_STATE_RUNNING:
            allowanceElement = <Loader active inline size={'mini'}/>
            break
        case QueryStates.QUERY_STATE_COMPLETE:
            allowanceElement = <span>{allowanceValue.value.toString()}</span>
            break
        case QueryStates.QUERY_STATE_ERROR:
            allowanceElement = <span>error</span>
            break
        case QueryStates.QUERY_STATE_INITIAL:
        default:
            allowanceElement = ''
    }
    // TODO: Add edit button
    const actionContent = <Loader active inline size={'mini'}/>

    return (
        <Table.Row key={`${allowanceId}`}>
            <Table.Cell>
                <AddressDisplay addressId={allowance.spenderId}/>
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

export default TokenAllowanceItem