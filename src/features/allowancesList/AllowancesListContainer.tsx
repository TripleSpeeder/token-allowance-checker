import React from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { RootState } from '../../app/rootReducer'
import TokenAllowancesItem from './TokenAllowancesItem'
import { QueryStates } from './AllowancesListSlice'
import { Icon } from 'semantic-ui-react'
import { AddressId } from '../addressInput/AddressSlice'
import DisplayMessage from '../../components/DisplayMessage'
import AddressDisplay from '../../components/AddressDisplay'

interface AllowancesListContainerProps {
    ownerId: AddressId
    showZeroAllowances: boolean
    addressFilter: string
}

const AllowancesListContainer = ({
    ownerId,
    showZeroAllowances,
    addressFilter,
}: AllowancesListContainerProps) => {
    const allowancesByTokenId = useSelector((state: RootState) => {
        let allowanceIds
        if (showZeroAllowances && addressFilter === '') {
            // no filter required, just return all IDs.
            allowanceIds = state.allowances.allowanceIdsByOwnerId[ownerId]
        } else {
            // apply filter
            allowanceIds = state.allowances.allowanceIdsByOwnerId[
                ownerId
            ].filter((allowanceId) => {
                const allowance = state.allowances.allowancesById[allowanceId]
                if (!showZeroAllowances) {
                    const allowanceValue =
                        state.allowances.allowanceValuesById[allowanceId]
                    const isZeroAllowance =
                        allowanceValue.state ===
                            QueryStates.QUERY_STATE_COMPLETE &&
                        allowanceValue.value.isZero()
                    if (isZeroAllowance) {
                        return false
                    }
                }
                if (addressFilter) {
                    const filterString = addressFilter.toLowerCase()
                    const tokenContract =
                        state.tokenContracts.contractsById[
                            allowance.tokenContractId
                        ]
                    if (tokenContract) {
                        const tokenContractAddress =
                            state.addresses.addressesById[
                                tokenContract.addressId
                            ]
                        const matchedFilter =
                            tokenContract.name
                                .toLowerCase()
                                .includes(filterString) ||
                            tokenContract.symbol
                                .toLowerCase()
                                .includes(filterString) ||
                            tokenContractAddress.address
                                .toLowerCase()
                                .includes(filterString) ||
                            tokenContractAddress.ensName
                                ?.toLowerCase()
                                .includes(filterString)
                        if (!matchedFilter) {
                            return false
                        }
                    } else {
                        console.warn(
                            `No tokencontract for ${allowance.tokenContractId}`
                        )
                    }
                }
                return true
            })
        }

        // get allowances by their Id
        const allowances = allowanceIds?.map(
            (allowanceId) => state.allowances.allowancesById[allowanceId]
        )

        // group allowances by tokenID
        const groupedAllowances = _.groupBy(allowances, 'tokenContractId')

        // sort grouped allowances by token name
        // Result: An array of an Array of Allowances
        return _.sortBy(groupedAllowances, [
            function (allowanceArray) {
                const tokenContract =
                    state.tokenContracts.contractsById[
                        allowanceArray[0].tokenContractId
                    ]
                return tokenContract?.name ?? 'Z' // return 'Z' so tokens which name is still unknown appear at end
            },
        ])
    })
    const queryState = useSelector(
        (state: RootState) =>
            state.allowances.allowanceQueryStateByOwner[ownerId]
    )
    const ownerAddress = useSelector(
        (state: RootState) => state.addresses.addressesById[ownerId]
    )
    const mobile = useSelector((state: RootState) => state.respsonsive.mobile)
    const networkId = useSelector((state: RootState) => state.onboard.networkId)

    if (!queryState) {
        console.log(`No querystate available for ${ownerId}`)
        return null
    }

    let message
    const items: Array<React.ReactNode> = []
    for (const tokenAllowances of allowancesByTokenId) {
        const tokenId = tokenAllowances[0].tokenContractId
        const allowanceIds = tokenAllowances.map((allowance) => allowance.id)
        items.push(
            <TokenAllowancesItem
                key={tokenId}
                tokenId={tokenId}
                ownerId={ownerId}
                allowanceIds={allowanceIds}
            />
        )
    }

    switch (queryState.state) {
        case QueryStates.QUERY_STATE_RUNNING:
            message = (
                <DisplayMessage
                    mobile={mobile}
                    header={'Loading events'}
                    body={`Querying dfuse API for ERC20 Approvals, getting page ${
                        queryState.currentPage + 1
                    }...`}
                    warning={true}
                    icon={<Icon name='circle notched' loading />}
                />
            )
            break
        case QueryStates.QUERY_STATE_ERROR:
            message = (
                <DisplayMessage
                    mobile={mobile}
                    error={true}
                    header={'Error'}
                    icon={<Icon name='exclamation triangle' />}
                    body={queryState.error}
                />
            )
            break
        case QueryStates.QUERY_STATE_COMPLETE:
            if (items.length === 0) {
                const body = (
                    <>
                        <AddressDisplay
                            ethAddress={ownerAddress}
                            mobile={mobile}
                            networkId={networkId}
                            inline={true}
                        />{' '}
                        has no approvals.
                    </>
                )
                message = (
                    <DisplayMessage
                        mobile={mobile}
                        success={true}
                        icon={<Icon name='info' />}
                        header={'No Approvals'}
                        body={body}
                    />
                )
            }
            break
        case QueryStates.QUERY_STATE_INITIAL:
        default:
            return <div>Unhandled state!</div>
    }

    return (
        <>
            {message}
            {items}
        </>
    )
}

export default AllowancesListContainer
