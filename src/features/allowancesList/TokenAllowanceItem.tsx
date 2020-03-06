import React from 'react'
import {AllowanceId} from './AllowancesListSlice'
import {useSelector} from 'react-redux'
import { RootState } from 'app/rootReducer'
import { Table, Loader } from 'semantic-ui-react'
import AddressDisplay from 'components/AddressDisplay'

interface TokenAllowanceItemProps {
    allowanceId: AllowanceId
}

const TokenAllowanceItem = ({allowanceId}:TokenAllowanceItemProps) => {
    const allowance = useSelector((state:RootState) => state.allowances.allowancesById[allowanceId])
    const owner = useSelector((state:RootState) => state.addresses.addressesById[allowance.ownerId])
    const spender = useSelector((state:RootState) => state.addresses.addressesById[allowance.spenderId])
    const tokenContract = useSelector((state:RootState) => state.tokenContracts.contractsById[allowance.tokenContractId])

    // TODO: const criticalAllowance = (value.eq(unlimitedAllowance)) || (value.gte(tokenSupply))
    const criticalAllowance = false
    // TODO: Add loading state for allowance value
    const allowanceElement = <Loader active inline size={'mini'}/>
    // TODO: Add edit button
    const actionContent = <Loader active inline size={'mini'}/>

    return (
        <Table.Row key={`${allowanceId}`}>
            <Table.Cell>
                <AddressDisplay address={spender.address} ensName={spender.ensName}/>
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