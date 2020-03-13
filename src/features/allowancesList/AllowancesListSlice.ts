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
import { createDfuseClient } from '@dfuse/client'
import {
    TransactionId,
    addTransaction,
    EditAllowanceTransaction,
} from '../transactionTracker/TransactionTrackerSlice'
import ERC20Data from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import ERC20Detailed from '../../contracts'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contract = require('@truffle/contract')

const topicHashApprove =
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
const eventABI = [
    {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
    },
    {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
    },
    {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
    },
]

const client = createDfuseClient({
    apiKey: 'web_085aeaac9c520204b1a9dcaa357e5460',
    network: 'mainnet.eth.dfuse.io',
})
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
                spenderId: AddressId
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
    const owner = getState().addresses.addressesById[ownerId]
    const web3 = getState().onboard.web3
    if (!web3) {
        console.log(`Missing web3!`)
        return
    }

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

    // query dfuse API
    let cursor = ''
    try {
        // search page by page until no more results are found
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
                for (let index = 0; index < node.matchingLogs.length; index++) {
                    const logEntry = node.matchingLogs[index]
                    // skip bad contracts
                    if (badContracts.includes(logEntry.address.toLowerCase())) {
                        continue
                    }

                    // Apparently dfuse query results based on topic sometimes return wrong topics. Double-check that the
                    // logEntry actually is of the expected topic.
                    if (logEntry.topics[0] !== topicHashApprove) {
                        console.log(
                            `Skipping log event. Topic is wrong, expected ${topicHashApprove}, got ${logEntry.topics[0]}. Transaction: ${node.hash}`
                        )
                        continue
                    }

                    const tokenContractAddress = logEntry.address.toLowerCase()

                    if (logEntry.data === '0x') {
                        console.log(
                            `Detected bad contract at ${logEntry.address}: LogEntry.data is missing. Transaction: ${node.hash}.`
                        )
                        badContracts.push(tokenContractAddress)
                        continue
                    }

                    let decoded
                    try {
                        decoded = web3.eth.abi.decodeLog(
                            eventABI,
                            logEntry.data,
                            logEntry.topics.slice(1)
                        )
                    } catch (e) {
                        console.log(
                            `Detected bad contract at ${logEntry.address}: Can not decode logEntry from transaction: ${node.hash}:`
                        )
                        console.log(logEntry)
                        badContracts.push(tokenContractAddress)
                        continue
                    }

                    // check if spender is an actual address. Some contracts emit logs with spender 0x0...
                    if (!parseInt(decoded.spender)) {
                        console.log(
                            `Skipping log event: Invalid spender ${decoded.spender}, contract: ${logEntry.address}`
                        )
                        continue
                    }
                    // double-check owner is correct.
                    if (
                        decoded.owner.toLowerCase() !==
                        owner.address.toLowerCase()
                    ) {
                        console.log(
                            `Skipping log event due to owner mismatch. Expected ${owner.address}, got ${decoded.owner}. Transaction: ${node.hash}`
                        )
                        continue
                    }

                    // Add tokenContract
                    if (!knownContracts.includes(tokenContractAddress)) {
                        // Check if the contract really implements the required ERC20 methods.
                        const erc20Contract = contract(ERC20Data)
                        erc20Contract.setProvider(web3.currentProvider)
                        const contractInstance: ERC20Detailed.ERC20DetailedInstance = await erc20Contract.at(
                            tokenContractAddress
                        )
                        try {
                            // these are the required calls
                            await contractInstance.totalSupply()
                            await contractInstance.balanceOf(
                                tokenContractAddress
                            )
                            await contractInstance.allowance(
                                tokenContractAddress,
                                tokenContractAddress
                            )
                            // TODO: Check if approve() method is available!
                        } catch (error) {
                            console.log(
                                `Contract at ${tokenContractAddress} is not ERC20. Ignoring.`
                            )
                            badContracts.push(tokenContractAddress)
                            continue
                        }
                        knownContracts.push(tokenContractAddress)
                        // console.log(`Adding tokenContract ${tokenContractAddress}`)
                        dispatch(addContractThunk(contractInstance))
                    }
                    // Add spender address and create allowance entry
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
                                spenderAddress
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
