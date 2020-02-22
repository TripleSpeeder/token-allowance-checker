import React from 'react'
import PropTypes from 'prop-types'
import TokenAllowanceListContainer from './TokenAllowanceListContainer'
import {Icon, Message, Segment} from 'semantic-ui-react'


const AllowancesListContainer = ({tokenSpenders, address, showZeroAllowances, addressFilter, loading, error, page}) => {

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
}

AllowancesListContainer.propTypes = {
    tokenSpenders: PropTypes.object.isRequired,
    address: PropTypes.string.isRequired,
    showZeroAllowances: PropTypes.bool.isRequired,
    addressFilter: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
}

export default AllowancesListContainer