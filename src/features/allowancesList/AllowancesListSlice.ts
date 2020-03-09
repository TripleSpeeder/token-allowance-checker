import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {AppDispatch, AppThunk} from '../../app/store'
import {addContractThunk, ContractAddress} from 'features/tokenContracts/tokenContractsSlice'
import {addAddressThunk, AddressId, EthAddressPayload, addAddress} from '../addressInput/AddressSlice'
import BN from 'bn.js'
import {createDfuseClient, GraphqlResponse, SearchTransactionRow} from '@dfuse/client'

const topicHashApprove = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
const eventABI = [
    {
        'indexed': true,
        'internalType': 'address',
        'name': 'owner',
        'type': 'address',
    },
    {
        'indexed': true,
        'internalType': 'address',
        'name': 'spender',
        'type': 'address',
    },
    {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256',
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
    tokenContractId: AddressId,
    ownerId: AddressId,
    spenderId: AddressId,
}

export interface AllowanceValue {
    allowanceId: AllowanceId,
    value: BN,
    state: QueryStates
}

export enum QueryStates {
    QUERY_STATE_INITIAL,
    QUERY_STATE_RUNNING,
    QUERY_STATE_ERROR,
    QUERY_STATE_COMPLETE
}

export interface QueryState {
    state: QueryStates,
    currentPage: number,
    error?: string
}

interface AllowancesState {
    allowancesById: Record<AllowanceId, Allowance>
    allowanceValuesById: Record<AllowanceId, AllowanceValue>
    allowancesByOwnerId: Record<AddressId, AllowanceId[]>
    allowanceQueryStateByOwner: Record<AddressId, QueryState>
}

interface AllowancePayload {
    id: AllowanceId,
    allowance: Allowance
}

interface QueryStatePayload {
    ownerId: AddressId,
    queryState: QueryState,
}

// initial state
let initialState:AllowancesState = {
    allowancesById: {},
    allowanceValuesById: {},
    allowancesByOwnerId: {},
    allowanceQueryStateByOwner: {}
}

let defaultQueryStateByOwner:QueryState = {
    currentPage: 0,
    state:QueryStates.QUERY_STATE_INITIAL
}

export const buildAllowanceId = (tokenContractId: AddressId, ownerId: AddressId, spenderId: AddressId) => {
    return `${ownerId}-${tokenContractId}-${spenderId}`
}

const allowancesSlice = createSlice({
    name: 'Allowances',
    initialState: initialState,
    reducers: {
        addAllowance: {
            reducer(state, action: PayloadAction<AllowancePayload>) {
                const {id, allowance} = action.payload
                if (Object.keys(state.allowancesById).includes(id)) {
                    // already known.
                    return
                }
                state.allowancesById[id] = allowance
                // should not be necessary anymore since i create this entry in extraReducers below
                // if (!Object.keys(state.allowancesByOwnerId).includes(allowance.ownerId)) {
                //    state.allowancesByOwnerId[allowance.ownerId] = []
                //}
                state.allowancesByOwnerId[allowance.ownerId].push(allowance.id)
                state.allowanceValuesById[id] = {
                    allowanceId: id,
                    state: QueryStates.QUERY_STATE_INITIAL,
                    value: new BN('-1')
                }
            },
            prepare(tokenContractId: AddressId, ownerId: AddressId, spenderId: AddressId) {
                const id = buildAllowanceId(tokenContractId, ownerId, spenderId)
                return {
                    payload: {
                        id,
                        allowance: {
                            id,
                            tokenContractId,
                            ownerId,
                            spenderId,
                        }
                    }
                }
            }
        },
        setQueryState(state, action: PayloadAction<QueryStatePayload>) {
            const {ownerId, queryState} = action.payload
            state.allowanceQueryStateByOwner[ownerId] = queryState
        },
        setAllowanceValue(state, action: PayloadAction<AllowanceValue>) {
            const allowanceValue = action.payload
            state.allowanceValuesById[allowanceValue.allowanceId] = allowanceValue
        }
    },
    extraReducers: {
        [addAddress.type](state, action:PayloadAction<EthAddressPayload>){
            const {id:ownerId} = action.payload
            if (Object.keys(state.allowancesByOwnerId).includes(ownerId)) {
                // owner already known.
                return
            }
            state.allowancesByOwnerId[ownerId] = []
            state.allowanceQueryStateByOwner[ownerId] = defaultQueryStateByOwner
        }
    }
})

export const { addAllowance, setQueryState, setAllowanceValue } = allowancesSlice.actions

export default allowancesSlice.reducer

export const fetchAllowanceValueThunk = (
    allowanceId: AllowanceId
):AppThunk => async (dispatch:AppDispatch, getState) => {
    // indicate start of loading
    dispatch(setAllowanceValue({
        allowanceId,
        value: new BN('-1'),
        state: QueryStates.QUERY_STATE_RUNNING
    }))

    const allowance = getState().allowances.allowancesById[allowanceId]
    const owner = getState().addresses.addressesById[allowance.ownerId]
    const spender = getState().addresses.addressesById[allowance.spenderId]
    const tokenContract = getState().tokenContracts.contractsById[allowance.tokenContractId]

    try {
        const value = await tokenContract.contractInstance.allowance(owner.address, spender.address)
        dispatch(setAllowanceValue({
            allowanceId,
            value,
            state: QueryStates.QUERY_STATE_COMPLETE
        }))
    }catch(error) {
        console.log(`Failed to get allowance from token ${tokenContract.addressId}`)
        dispatch(setAllowanceValue({
            allowanceId,
            value: new BN('-1'),
            state: QueryStates.QUERY_STATE_ERROR
        }))
    }
}

export const fetchAllowancesThunk = (
    ownerId: AddressId
):AppThunk => async (dispatch, getState) =>{

    const owner = getState().addresses.addressesById[ownerId]
    const web3 = getState().onboard.web3
    if (!web3) {
        console.log(`Missing web3!`)
        return
    }

    let currentPage = 0

    // update query state to indicate start of loading
    dispatch(setQueryState({
        ownerId,
        queryState: {
            state: QueryStates.QUERY_STATE_RUNNING,
            currentPage,
        },
    }))

    // query dfuse API
    let cursor = ''
    const tokenSpenders = {}
    try {
        // search page by page until no more results are found
        let numPageResults = 0
        let allEdges:any[] = []
        do {
            console.log(`Getting page ${currentPage}. Last page result: ${numPageResults}. Total results so far: ${allEdges.length}`)
            const response = await client.graphql(searchTransactions, {
                variables: {
                    limit: '50',
                    query: `topic.0:${topicHashApprove} topic.1:${owner.address}`,
                    cursor: cursor,
                },
            })
            // any errors reported?
            if (response.errors) {
                throw response.errors
            }
            // get start cursor for next page
            cursor = response.data.searchTransactions.pageInfo.endCursor
            // get actual results
            const edges = response.data.searchTransactions.edges || []
            numPageResults = edges.length
            allEdges = allEdges.concat(edges)
            currentPage++
            dispatch(setQueryState({
                ownerId,
                queryState: {
                    state: QueryStates.QUERY_STATE_RUNNING,
                    currentPage,
                },
            }))
        } while (numPageResults>0)

        const knownContracts:Array<string> = []
        const knownSpenders:Array<string> = []
        allEdges.forEach(({node}) => {
            node.matchingLogs.forEach((logEntry:any) => {
                // Seems the dfuse query based on topic is not working correctly. Double-check that the logEntry
                // actually is of the expected topic.
                if (logEntry.topics[0] !== topicHashApprove) {
                    console.warn(`Skipping wrong topic ${logEntry.topics[0]}`)
                    return
                }
                const decoded = web3.eth.abi.decodeLog(eventABI, logEntry.data, logEntry.topics.slice(1))
                // double-check owner
                if (decoded.owner.toLowerCase() === owner.address.toLowerCase()) {
                    // Add tokenContract
                    const tokenContractAddress = logEntry.address.toLowerCase()
                    if (!knownContracts.includes(tokenContractAddress)) {
                        knownContracts.push(tokenContractAddress)
                        // console.log(`Adding tokenContract ${tokenContractAddress}`)
                        dispatch(addContractThunk(tokenContractAddress))
                    }
                    // Add spender address and create allowance entry
                    const spenderAddress = decoded.spender.toLowerCase()
                    if (!knownSpenders.includes(spenderAddress)) {
                        knownSpenders.push(spenderAddress)
                        // console.log(`Adding Spender ${spenderAddress} for ${tokenContractAddress}`)
                        dispatch(addAddressThunk(spenderAddress))
                        // Add allowance entry
                        dispatch(addAllowance(tokenContractAddress, ownerId, spenderAddress))
                    }
                } else {
                    console.log(`Skipping log event due to owner mismatch. Expected ${owner.address}, got ${decoded.owner}`)
                }
            })
        })
        dispatch(setQueryState({
            ownerId,
            queryState: {
                state: QueryStates.QUERY_STATE_COMPLETE,
                currentPage,
            },
        }))
    } catch (errors) {
        console.log(errors)
        dispatch(setQueryState({
            ownerId,
            queryState: {
                state: QueryStates.QUERY_STATE_ERROR,
                currentPage,
                error: JSON.stringify(errors),
            },
        }))
    }
}