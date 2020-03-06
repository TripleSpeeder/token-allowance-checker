import React from 'react'
import {useSelector} from 'react-redux'
// import * as _ from 'lodash'
import _ from 'lodash'
import {RootState} from '../../app/rootReducer'
import TokenAllowanceItemContainer from './TokenAllowanceItemContainer'
import TokenAllowancesItem from './TokenAllowancesItem'
import {AllowanceId} from './AllowancesListSlice'
import {AddressId} from '../addressInput/AddressSlice'


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

    if (ownerAllowanceIds) {
        // get all allowances of owner
        const allowances = ownerAllowanceIds.map((allowanceId) => (allowancesById[allowanceId]))
        console.log(`Allowances: ${allowances}`)
        // group allowances by tokenID
        const allowancesByTokenId = _.groupBy(allowances, 'tokenContractId')
        console.log(`Grouped Allowances: ${allowancesByTokenId}`)

        const items:Array<any> = []
        for (let entry of Object.entries(allowancesByTokenId)) {
            const tokenId = entry[0]
            const allowanceIds = entry[1].map(allowance => (allowance.id))
            console.log(`Allowances for tokenId ${tokenId}:`)
            allowanceIds.forEach(allowance => {
                console.log(allowance)
            })
            items.push(<TokenAllowancesItem key={tokenId} tokenId={tokenId} allowanceIds={allowanceIds}/>)
        }
        return (<>{items}</>)
    }
    return (<div>no entries</div>)
    /*
    // TODO: useMemo
    const tokens = []
    for (const [contractAddress, spenders] of Object.entries(tokenSpenders)) {
        tokens.push(
            <TokenAllowanceListContainer
                key={contractAddress}
                owner={address}
                spenders={spenders}
                contractAddress={contractAddress}
                showZeroAllowances={showZeroAllowances}
                addressFilter={addressFilter}
            />,
        )
    }

    if (loading) {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message icon warning size={'huge'}>
                    <Icon name='circle notched' loading/>
                    <Message.Content>
                        <Message.Header>Please wait while loading events</Message.Header>
                        <p>Checking address: {address}</p>
                        <div>Querying dfuse API for ERC20 Approvals, getting page {page+1}...</div>
                    </Message.Content>
                </Message>
            </Segment>
        )
    }

    if (error) {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message error icon size={'huge'}>
                    <Icon name='exclamation triangle'/>
                    <Message.Content>
                        <Message.Header>Error</Message.Header>
                        {error}
                    </Message.Content>
                </Message>
            </Segment>
        )
    }

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

    if (tokens.length === 0) {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message success icon size={'huge'}>
                    <Icon name='info'/>
                    <Message.Content>
                        <Message.Header>No Approvals</Message.Header>
                        Address {address} has no Approvals.
                    </Message.Content>
                </Message>
            </Segment>
        )
    }

    return (<>
        {tokens}
    </>)

     */
}

export default AllowancesListContainer