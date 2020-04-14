import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk } from '../../app/store'
import { addContractThunk } from 'features/tokenContracts/tokenContractsSlice'
import {
    addAddressThunk,
    AddressId,
    EthAddressPayload,
    addAddress,
    fetchEtherscanNameThunk,
} from '../addressInput/AddressSlice'
import BN from 'bn.js'
import {
    TransactionId,
    addTransaction,
    EditAllowanceTransaction,
} from '../transactionTracker/TransactionTrackerSlice'
import ERC20Data from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import { setNetworkId } from '../onboard/onboardSlice'
import { getDfuseClient } from '../../api/dfuse/dfuseio'
import createAndVerifyERC20 from '../../utils/contractVerifier'
import {
    checkLogTopic,
    topicHashApprove,
    decodeLog,
    checkDecodedData,
} from 'utils/logEventVerifier'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contract = require('@truffle/contract')

const searchTransactions = `query ($query: String! $limit: Int64! $cursor: String) {
      searchTransactions(
        indexName: LOGS, 
        query: $query, 
        limit: $limit, 
        sort: DESC,
        cursor: $cursor,
      ) {
        pageInfo {
          endCursor
        }
        edges {
          node {
            hash
            block {
              number
              header {
                timestamp
              }
            }
            matchingLogs {
              data
              topics
              address
            }
          }
        }
      }
    }`

export type AllowanceId = string

export interface Allowance {
    id: AllowanceId
    tokenContractId: AddressId
    ownerId: AddressId
    spenderId: AddressId
    editTransactionId?: TransactionId
    lastChangedTimestamp: number
}

export interface AllowanceValue {
    allowanceId: AllowanceId
    value: BN
    state: QueryStates
}

export enum QueryStates {
    QUERY_STATE_INITIAL,
    QUERY_STATE_RUNNING,
    QUERY_STATE_ERROR,
    QUERY_STATE_COMPLETE,
}

export interface QueryState {
    state: QueryStates
    currentPage: number
    error?: string
}

interface AllowancesState {
    allowancesById: Record<AllowanceId, Allowance>
    allowanceValuesById: Record<AllowanceId, AllowanceValue>
    allowanceIdsByOwnerId: Record<AddressId, AllowanceId[]>
    allowanceQueryStateByOwner: Record<AddressId, QueryState>
}

interface AllowancePayload {
    id: AllowanceId
    allowance: Allowance
}

interface QueryStatePayload {
    ownerId: AddressId
    queryState: QueryState
}

// initial state
const initialState: AllowancesState = {
    allowancesById: {},
    allowanceValuesById: {},
    allowanceIdsByOwnerId: {},
    allowanceQueryStateByOwner: {},
}

const defaultQueryStateByOwner: QueryState = {
    currentPage: 0,
    state: QueryStates.QUERY_STATE_INITIAL,
}

export const buildAllowanceId = (
    tokenContractId: AddressId,
    ownerId: AddressId,
    spenderId: AddressId
) => {
    return `${ownerId}-${tokenContractId}-${spenderId}`
}

const allowancesSlice = createSlice({
    name: 'Allowances',
    initialState: initialState,
    reducers: {
        addAllowance: {
            reducer(state, action: PayloadAction<AllowancePayload>) {
                const { id, allowance } = action.payload
                if (Object.keys(state.allowancesById).includes(id)) {
                    // already known.
                    return
                }
                state.allowancesById[id] = allowance
                state.allowanceIdsByOwnerId[allowance.ownerId].push(
                    allowance.id
                )
                state.allowanceValuesById[id] = {
                    allowanceId: id,
                    state: QueryStates.QUERY_STATE_INITIAL,
                    value: new BN('-1'),
                }
            },
            prepare(
                tokenContractId: AddressId,
                ownerId: AddressId,
                spenderId: AddressId,
                timestamp: number
            ) {
                const id = buildAllowanceId(tokenContractId, ownerId, spenderId)
                return {
                    payload: {
                        id,
                        allowance: {
                            id,
                            tokenContractId,
                            ownerId,
                            spenderId,
                            lastChangedTimestamp: timestamp,
                        },
                    },
                }
            },
        },
        setQueryState(state, action: PayloadAction<QueryStatePayload>) {
            const { ownerId, queryState } = action.payload
            state.allowanceQueryStateByOwner[ownerId] = queryState
        },
        setAllowanceValue(state, action: PayloadAction<AllowanceValue>) {
            const allowanceValue = action.payload
            state.allowanceValuesById[
                allowanceValue.allowanceId
            ] = allowanceValue
        },
    },
    extraReducers: {
        [addAddress.type](state, action: PayloadAction<EthAddressPayload>) {
            const { id: ownerId } = action.payload
            if (Object.keys(state.allowanceIdsByOwnerId).includes(ownerId)) {
                // owner already known.
                return
            }
            state.allowanceIdsByOwnerId[ownerId] = []
            state.allowanceQueryStateByOwner[ownerId] = defaultQueryStateByOwner
        },
        [addTransaction.type](
            state,
            action: PayloadAction<EditAllowanceTransaction>
        ) {
            const { allowanceId, transactionId } = action.payload
            state.allowancesById[allowanceId].editTransactionId = transactionId
        },
        [setNetworkId.type](state, action: PayloadAction<number>) {
            const networkId = action.payload
            console.log(
                `Resetting allowances due to network change to ${networkId}`
            )
            Object.keys(state.allowanceQueryStateByOwner).forEach((ownerId) => {
                state.allowanceQueryStateByOwner[
                    ownerId
                ] = defaultQueryStateByOwner
            })
            Object.keys(state.allowanceIdsByOwnerId).forEach((ownerId) => {
                state.allowanceIdsByOwnerId[ownerId] = []
            })
            state.allowanceValuesById = {}
            state.allowancesById = {}
        },
    },
})

export const {
    addAllowance,
    setQueryState,
    setAllowanceValue,
} = allowancesSlice.actions

export default allowancesSlice.reducer

export const fetchAllowanceValueThunk = (
    allowanceId: AllowanceId
): AppThunk => async (dispatch: AppDispatch, getState) => {
    // indicate start of loading
    dispatch(
        setAllowanceValue({
            allowanceId,
            value: new BN('-1'),
            state: QueryStates.QUERY_STATE_RUNNING,
        })
    )

    const allowance = getState().allowances.allowancesById[allowanceId]
    const owner = getState().addresses.addressesById[allowance.ownerId]
    const spender = getState().addresses.addressesById[allowance.spenderId]
    const tokenContract = getState().tokenContracts.contractsById[
        allowance.tokenContractId
    ]

    try {
        const value = await tokenContract.contractInstance.allowance(
            owner.address,
            spender.address
        )
        dispatch(
            setAllowanceValue({
                allowanceId,
                value,
                state: QueryStates.QUERY_STATE_COMPLETE,
            })
        )
    } catch (error) {
        console.log(
            `Failed to get allowance from token ${tokenContract.addressId}`
        )
        dispatch(
            setAllowanceValue({
                allowanceId,
                value: new BN('-1'),
                state: QueryStates.QUERY_STATE_ERROR,
            })
        )
    }
}

export const fetchAllowancesThunk = (ownerId: AddressId): AppThunk => async (
    dispatch,
    getState
) => {
    const web3 = getState().onboard.web3
    if (!web3) {
        console.log(`Missing web3!`)
        return
    }
    const owner = getState().addresses.addressesById[ownerId]
    const { networkId } = getState().onboard

    let currentPage = 0
    // update query state to indicate start of loading
    dispatch(
        setQueryState({
            ownerId,
            queryState: {
                state: QueryStates.QUERY_STATE_RUNNING,
                currentPage,
            },
        })
    )

    // prepare ERC20 contract
    const erc20Contract = contract(ERC20Data)
    erc20Contract.setProvider(web3.currentProvider)

    // query dfuse API
    try {
        const client = getDfuseClient({ networkId })
        // search page by page until no more results are found
        let cursor = ''
        let numPageResults = 0
        const badContracts: Array<string> = []
        const knownContracts: Array<string> = []
        const knownSpenders: Array<string> = []

        do {
            console.log(
                `Getting page ${currentPage}. Last page result: ${numPageResults}.`
            )
            const response = await client.graphql(searchTransactions, {
                variables: {
                    limit: '50',
                    query: `topic.0:${topicHashApprove} topic.1:${owner.address}`,
                    cursor: cursor,
                },
            })
            // abort if any errors reported
            if (response.errors) {
                throw response.errors
            }

            // get actual results
            const edges = response.data.searchTransactions.edges || []
            for (let edgeIndex = 0; edgeIndex < edges.length; edgeIndex++) {
                const { node } = edges[edgeIndex]
                const timestamp = parseInt(node.block.header.timestamp)
                for (let index = 0; index < node.matchingLogs.length; index++) {
                    const logEntry = node.matchingLogs[index]
                    const tokenContractAddress = logEntry.address.toLowerCase()

                    if (badContracts.includes(tokenContractAddress)) {
                        // skip logEvents created by already-known bad contracts
                        continue
                    }

                    if (!checkLogTopic(logEntry)) {
                        // issues with topic indicate a problem on dfuse side. Ignore this
                        // logEvent, but do not blacklist contract.
                        continue
                    }

                    const decoded = decodeLog(logEntry, web3)
                    if (!decoded) {
                        // If decoding fails, blacklist contract
                        badContracts.push(tokenContractAddress)
                        continue
                    }

                    if (
                        !checkDecodedData(
                            decoded.spender,
                            decoded.owner,
                            owner.address
                        )
                    ) {
                        // ignore logEvents with inplausible data, but do not blacklist contract
                        continue
                    }

                    // pre-checks passed. Now check contract
                    if (!knownContracts.includes(tokenContractAddress)) {
                        const contractInstance = await createAndVerifyERC20({
                            erc20Contract,
                            contractAddress: tokenContractAddress,
                        })
                        if (contractInstance) {
                            knownContracts.push(tokenContractAddress)
                            // console.log(`Adding tokenContract ${tokenContractAddress}`)
                            dispatch(addContractThunk(contractInstance))
                        } else {
                            // contract failed verification
                            badContracts.push(tokenContractAddress)
                            continue
                        }
                    }

                    // All checks passed. Now add spender address and create allowance entry
                    const spenderAddress = decoded.spender.toLowerCase()
                    if (!knownSpenders.includes(spenderAddress)) {
                        knownSpenders.push(spenderAddress)
                        // console.log(`Adding Spender ${spenderAddress} for ${tokenContractAddress}`)
                        dispatch(addAddressThunk(spenderAddress))
                        // look for spender contract name on Etherscan
                        dispatch(fetchEtherscanNameThunk(spenderAddress))
                        // Add allowance entry
                        dispatch(
                            addAllowance(
                                tokenContractAddress,
                                ownerId,
                                spenderAddress,
                                timestamp
                            )
                        )
                    }
                }
            }
            numPageResults = edges.length
            currentPage++
            // get start cursor for next page
            cursor = response.data.searchTransactions.pageInfo.endCursor
            dispatch(
                setQueryState({
                    ownerId,
                    queryState: {
                        state: QueryStates.QUERY_STATE_RUNNING,
                        currentPage,
                    },
                })
            )
        } while (numPageResults > 0)

        dispatch(
            setQueryState({
                ownerId,
                queryState: {
                    state: QueryStates.QUERY_STATE_COMPLETE,
                    currentPage,
                },
            })
        )
    } catch (errors) {
        console.log(errors)
        dispatch(
            setQueryState({
                ownerId,
                queryState: {
                    state: QueryStates.QUERY_STATE_ERROR,
                    currentPage,
                    error: JSON.stringify(errors),
                },
            })
        )
    }
}
