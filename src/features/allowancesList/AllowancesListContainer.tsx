import React from 'react'
import PropTypes from 'prop-types'
import TokenAllowanceListContainer from '../../components/TokenAllowanceListContainer'
import {Icon, Message, Segment} from 'semantic-ui-react'
import {useSelector} from 'react-redux'
import {RootState} from '../../app/rootReducer'


interface AllowancesListContainerProps {
    owner: string,
    showZeroAllowances: boolean,
    addressFilter: string
}

const AllowancesListContainer = ({owner, showZeroAllowances, addressFilter}:AllowancesListContainerProps) => {

    const allowanceIds = useSelector(
        (state: RootState) => state.allowances.allowancesByOwnerId[owner]
    )

    const items = []
    for (const allowanceId in allowanceIds) {
        console.log(`Adding allowance ${allowanceId}`)
        items.push(<li key={allowanceId}>AllowanceId: {allowanceId}</li>)
    }
    return (<ul>{items}</ul>)

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