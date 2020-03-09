import React from 'react'
import {useSelector} from 'react-redux'
import _ from 'lodash'
import {RootState} from '../../app/rootReducer'
import TokenAllowancesItem from './TokenAllowancesItem'
import {AllowanceId, QueryStates} from './AllowancesListSlice'
import { Segment, Message, Icon } from 'semantic-ui-react'
import AddressDisplay from '../../components/AddressDisplay'


interface AllowancesListContainerProps {
    owner: string,
    showZeroAllowances: boolean,
    addressFilter: string
}

const AllowancesListContainer = ({owner, showZeroAllowances, addressFilter}:AllowancesListContainerProps) => {

    // TODO: implement showZeroAllowances, addressFilter
    const ownerAllowanceIds = useSelector(
        (state: RootState) => state.allowances.allowancesByOwnerId[owner]
    )
    const allowancesById = useSelector(
        (state: RootState) => state.allowances.allowancesById
    )
    const queryState = useSelector(
        (state:RootState) => state.allowances.allowanceQueryStateByOwner[owner]
    )

    if (!queryState) {
        console.log(`No querystate available for ${owner}`)
        return null
    }

    switch(queryState.state) {
        case QueryStates.QUERY_STATE_RUNNING:
            return (
                <Segment basic padded='very' textAlign={'center'}>
                    <Message icon warning size={'huge'}>
                        <Icon name='circle notched' loading/>
                        <Message.Content>
                            <Message.Header>Please wait while loading events</Message.Header>
                            <AddressDisplay addressId={owner}/>
                            <div>Querying dfuse API for ERC20 Approvals, getting page {queryState.currentPage+1}...</div>
                        </Message.Content>
                    </Message>
                </Segment>
            )
        case QueryStates.QUERY_STATE_COMPLETE:
            if (ownerAllowanceIds.length) {
                // get all allowances of owner
                const allowances = ownerAllowanceIds.map((allowanceId) => (allowancesById[allowanceId]))
                // group allowances by tokenID
                const allowancesByTokenId = _.groupBy(allowances, 'tokenContractId')

                const items:Array<any> = []
                for (let entry of Object.entries(allowancesByTokenId)) {
                    const tokenId = entry[0]
                    const allowanceIds = entry[1].map(allowance => (allowance.id))
                    items.push(<TokenAllowancesItem key={tokenId} tokenId={tokenId} allowanceIds={allowanceIds}/>)
                }
                return (<>{items}</>)
            }
            else {
                return (
                    <Segment basic padded='very' textAlign={'center'}>
                        <Message success icon size={'huge'}>
                            <Icon name='info'/>
                            <Message.Content>
                                <Message.Header>No Approvals</Message.Header>
                                Address {owner} has no Approvals.
                            </Message.Content>
                        </Message>
                    </Segment>
                )
            }
        case QueryStates.QUERY_STATE_ERROR:
            return (
                <Segment basic padded='very' textAlign={'center'}>
                    <Message error icon size={'huge'}>
                        <Icon name='exclamation triangle'/>
                        <Message.Content>
                            <Message.Header>Error</Message.Header>
                            {queryState.error}
                        </Message.Content>
                    </Message>
                </Segment>
            )
        case QueryStates.QUERY_STATE_INITIAL:
        default:
            return (<div>Unhandled state!</div>)
    }

    /*
    if (address === '') {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message info icon size={'huge'}>
                    <Icon name='info'/>
                    <Message.Content>
                        <Message.Header>Enter an address to start!</Message.Header>
                    </Message.Content>
                </Message>
            </Segment>
        )
    }
     */
}

export default AllowancesListContainer