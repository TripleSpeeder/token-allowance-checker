import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../../app/store'
import { NavigateFunction } from 'react-router-dom'
import Web3 from 'web3'

export const zeroAddress = '0x0000000000000000000000000000000000000000'

export enum ResolvingStates {
  Initial,
  ResolvingForward,
  ResolvingReverse,
  Resolved
}

export enum CheckAddressStates {
  Initial,
  Resolving,
  Valid,
  Invalid
}

export type AddressId = string

// the plain address data without internal info like ID or resolving state
export interface EthAddress {
  address: string // the actual address
  ensName?: string // ensName for this address
  resolvingState: ResolvingStates
  esContractName?: string
}

export interface EthAddressPayload {
  id: AddressId
  ethAddress: EthAddress
}

interface EtherscanContractNamePayload {
  id: AddressId
  esContractName: string
}

interface ResolvingStatePayload {
  id: AddressId
  resolvingState: ResolvingStates
}

interface ENSNamePayload {
  id: AddressId
  ensName: string
}

// The state contains all known EthAddressess, indexed by the address id
interface EthAddressesState {
  addressesById: Record<AddressId, EthAddress>
  checkAddressId: AddressId | undefined
  checkAddressState: CheckAddressStates
  walletAddressId: AddressId | undefined
  prevWalletAddressId: AddressId | undefined
}

// initial state
const initialState: EthAddressesState = {
  addressesById: {},
  walletAddressId: undefined,
  prevWalletAddressId: undefined,
  checkAddressId: undefined,
  checkAddressState: CheckAddressStates.Initial
}

const addressSlice = createSlice({
  name: 'ethAddresses',
  initialState: initialState,
  reducers: {
    addAddress: {
      reducer(state, action: PayloadAction<EthAddressPayload>) {
        const { id, ethAddress } = action.payload
        state.addressesById[id] = ethAddress
      },
      prepare(address: string, ensName?: string) {
        address = address.toLowerCase()
        return {
          payload: {
            id: address,
            ethAddress: {
              address: address,
              resolvingState: ResolvingStates.Initial,
              ensName
            }
          }
        }
      }
    },
    setResolvingState(state, action: PayloadAction<ResolvingStatePayload>) {
      const { id, resolvingState } = action.payload
      state.addressesById[id].resolvingState = resolvingState
    },
    setENSName(state, action: PayloadAction<ENSNamePayload>) {
      const { id, ensName } = action.payload
      state.addressesById[id].ensName = ensName
    },
    setCheckAddressId(state, action: PayloadAction<AddressId>) {
      state.checkAddressId = action.payload
    },
    setCheckAddressState(state, action: PayloadAction<CheckAddressStates>) {
      state.checkAddressState = action.payload
    },
    setWalletAddressId(state, action: PayloadAction<AddressId>) {
      state.prevWalletAddressId = state.walletAddressId
      state.walletAddressId = action.payload
    },
    setEtherscanContractName(
      state,
      action: PayloadAction<EtherscanContractNamePayload>
    ) {
      const { id, esContractName } = action.payload
      state.addressesById[id].esContractName = esContractName
    }
  }
})

export const {
  addAddress,
  setResolvingState,
  setENSName,
  setCheckAddressId,
  setCheckAddressState,
  setWalletAddressId,
  setEtherscanContractName
} = addressSlice.actions

export default addressSlice.reducer

export const fetchEtherscanNameThunk =
  (addressId: AddressId): AppThunk =>
  async (dispatch, getState) => {
    const { chainId } = getState().onboard
    const apiKey = 'THS8KWYM6KZ8WBP3DXKUDR7UKCRB8YIRGH'
    let apiHost
    switch (chainId) {
      case '0x1':
        // mainnet
        apiHost = 'api.etherscan.io'
        break
      case '0x3':
        // Ropsten
        apiHost = 'api-ropsten.etherscan.io'
        break
      default:
        throw Error(`Chain ${chainId} not supported`)
    }
    const requestUrl = `https://${apiHost}/api?module=contract&action=getsourcecode&address=${addressId}&apikey=${apiKey}`
    const response = await fetch(requestUrl)
    const data = await response.json()
    if (data.message === 'OK') {
      const contractName: string = data?.result[0]?.ContractName
      if (contractName?.length) {
        dispatch(
          setEtherscanContractName({
            id: addressId,
            esContractName: contractName
          })
        )
      }
    } else {
      console.log(
        `Got message ${data.message} fetching contract data from Etherscan API.`
      )
    }
  }

/*
 *  Lookup ENS name and add resolved address if successfull
 */
const resolveAndAddENSName = (ensName: string, web3: Web3) => {
  return new Promise<AddressId>(async (resolve, reject) => {
    console.log(`Start resolveAndAddENSName for ${ensName}`)
    let resolvedAddress
    try {
      resolvedAddress = (await web3.eth.ens.getAddress(ensName)).toLowerCase()
      console.log(`Resolved ${ensName} to ${resolvedAddress}`)
    } catch (e) {
      console.log('Could not resolve ' + ensName)
      reject('Could not resolve ' + ensName)
    }
    console.log(`End resolveAndAddENSName for ${ensName}`)
    if (resolvedAddress) {
      resolve(resolvedAddress)
    } else {
      reject('Could not resolve ' + ensName)
    }
  })
}

/*
 * Add address and do reverse ENS lookup in background
 */
const resolveAndAddAddress = (
  address: string,
  dispatch: any /*AppDispatch*/,
  web3: Web3
) => {
  return new Promise<AddressId>(async (resolve) => {
    // first add plain address
    dispatch(addAddress(address))

    /*
    // look for reverse ENS name
    dispatch(
      setResolvingState({
        id: address,
        resolvingState: ResolvingStates.ResolvingReverse
      })
    )
    try {
      const reverseENSLookupName = address.slice(2) + '.addr.reverse'
      console.log(`Getting resolver for ${reverseENSLookupName}`)
      const ResolverContract = await web3.eth.ens.getResolver(
        reverseENSLookupName
      )
      const reverseENS = await ResolverContract.methods
        .name(namehash.hash(reverseENSLookupName))
        .call()
      console.log(`Got reverseENS: ${reverseENS}`)
      // add ENS name to plain address
      dispatch(
        setENSName({
          id: address,
          ensName: reverseENS
        })
      )
    } catch (error) {
      console.log(`Error getting reverse ENS: ${error}`)
      console.log(error)
    }

     */
    dispatch(
      setResolvingState({
        id: address,
        resolvingState: ResolvingStates.Resolved
      })
    )
    resolve(address)
  })
}

export const redirectToAddress =
  (
    addressId: AddressId,
    navigate: NavigateFunction,
    replace = false
  ): AppThunk =>
  (dispatch, getState) => {
    addressId = addressId.toLowerCase()
    const checkAddress = getState().addresses.addressesById[addressId]
    // history.push(`/address/${checkAddress.ensName ?? checkAddress.address}`)
    if (checkAddress.ensName) {
      console.log(`Routing to /address/${checkAddress.ensName}`)
      navigate(`/address/${checkAddress.ensName}`, { replace })
    } else {
      console.log(`Routing to /address/${checkAddress.address}`)
      navigate(`/address/${checkAddress.address}`, { replace })
    }
  }

export const addAddressThunk =
  (
    address: string,
    navigate: NavigateFunction | undefined = undefined
  ): AppThunk =>
  async (dispatch, getState) => {
    const web3 = getState().onboard.web3
    if (!web3) {
      console.log(`Can't add address - No Web3!`)
      return
    }
    address = address.toLowerCase()
    let addressId
    if (address.endsWith('.eth')) {
      // is ENS name already known?
      const known = Object.values(getState().addresses.addressesById).filter(
        (addressEntry) => addressEntry?.ensName?.toLowerCase() === address
      )
      addressId = known.length ? known[0].address : undefined
      if (!addressId) {
        // not known, try to resolve it
        try {
          addressId = await resolveAndAddENSName(address, web3)
          dispatch(addAddress(addressId, address))
        } catch (e) {
          // provided name can not be resolved
          return
        }
      }
    } else {
      // address is plain eth address
      addressId = address
      // is address already known?
      if (!Object.keys(getState().addresses.addressesById).includes(address)) {
        // add address and look for reverse ENS in background
        addressId = await resolveAndAddAddress(address, dispatch, web3)
      }
    }
    // redirect to address if requested
    navigate && dispatch(redirectToAddress(addressId, navigate))
  }

export const setAddressFromParamsThunk =
  (checkAddress: string): AppThunk =>
  async (dispatch, getState) => {
    const web3 = getState().onboard.web3
    if (!web3) {
      console.log(`Cant set address ${checkAddress} - web3 missing!`)
      return
    }

    if (checkAddress.endsWith('.eth')) {
      // checkAddress is ENS name
      // TODO: dispatch(setCheckAddressENSName(checkAddress)
      dispatch(setCheckAddressState(CheckAddressStates.Resolving))
      try {
        const addressId = await resolveAndAddENSName(checkAddress, web3)
        if (addressId === zeroAddress) {
          throw Error(`${checkAddress} resolved to ${zeroAddress}`)
        } else {
          dispatch(addAddress(addressId.toLowerCase(), checkAddress))
          dispatch(setCheckAddressId(addressId))
          dispatch(setCheckAddressState(CheckAddressStates.Valid))
        }
      } catch (e) {
        dispatch(setCheckAddressState(CheckAddressStates.Invalid))
      }
    } else {
      // checkAddress is plain eth address.
      checkAddress = checkAddress.toLowerCase()
      const validAddress = /^(0x)?[0-9a-f]{40}$/i.test(checkAddress)
      if (validAddress) {
        await resolveAndAddAddress(checkAddress, dispatch, web3)
        dispatch(setCheckAddressState(CheckAddressStates.Valid))
        dispatch(setCheckAddressId(checkAddress))
      } else {
        dispatch(setCheckAddressState(CheckAddressStates.Invalid))
      }
    }
  }

export const setWalletAddressThunk =
  (walletAddressId: string, navigate: NavigateFunction): AppThunk =>
  async (dispatch, getState) => {
    if (
      !Object.keys(getState().addresses.addressesById).includes(walletAddressId)
    ) {
      console.log(`Got new address from wallet: ${walletAddressId}`)
      const web3 = getState().onboard.web3
      if (web3) {
        await resolveAndAddAddress(walletAddressId, dispatch, web3)
      }
    } else {
      console.log(`Got known address from wallet: ${walletAddressId}`)
    }
    dispatch(setWalletAddressId(walletAddressId))

    // When user changes the wallet address, assume that he wants to check the selected address
    const prevWalletAddressId = getState().addresses.prevWalletAddressId
    if (prevWalletAddressId && prevWalletAddressId !== walletAddressId) {
      console.log(
        `setWalletAddressThunk: redirecting to new wallet address ${walletAddressId}`
      )
      dispatch(redirectToAddress(walletAddressId, navigate))
    }
  }
