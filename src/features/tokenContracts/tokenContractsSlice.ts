import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import ERC20Data from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import {AppThunk} from '../../app/store'
import wellKnownContracts from '../../components/wellKnownContracts'
const contract = require('@truffle/contract')

type contractAddress = string

interface tokenContract {
    address: contractAddress,
    name: string
    symbol: string
    contractInstance: object
}

interface tokenContractPayload {
    id: contractAddress,
    tokenContract: tokenContract
}

interface tokenContractsState {
    contractsByToken: Record<contractAddress, tokenContract>
}

let initialState:tokenContractsState = {
    contractsByToken: {
        '0x123': {
            address: '0x123',
            name: 'test contract',
            symbol: 'TCT',
            contractInstance: {}
        }
    }
}

const tokenContractSlice = createSlice({
    name: 'tokenContracts',
    initialState: initialState,
    reducers: {
        addContract(state, action: PayloadAction<tokenContractPayload>) {
            const {id, tokenContract} = action.payload
            state.contractsByToken[id] = tokenContract
        }
    }
})

export const { addContract } = tokenContractSlice.actions

export default tokenContractSlice.reducer

export const addContractThunk = (contractAddress: string): AppThunk => async (dispatch, getState) => {
    const {web3, networkId} = getState().onboard
    if (web3) {
        // initialize contract
        let isCompliant = true
        const erc20Contract = new contract(ERC20Data)
        erc20Contract.setProvider(web3.currentProvider)
        const contractInstance = await erc20Contract.at(contractAddress)
        let tokenName = ''
        let tokenSymbol = ''
        // Some contracts like MKR and SAI do not implement the correct ERC20 name and symbol.
        // Get their data from hardocded fallback
        if (Object.keys(wellKnownContracts[networkId]).includes(contractAddress.toLowerCase())) {
            tokenName = wellKnownContracts[networkId][contractAddress.toLowerCase()].name
            tokenSymbol = wellKnownContracts[networkId][contractAddress.toLowerCase()].symbol
        } else {
            try {
                tokenName = await contractInstance.name()
                tokenSymbol = await contractInstance.symbol()
            } catch(error) {
                // Most likely token contract does not implement the name() method. Ignore error.
                console.warn(`Failed to get name/symbol of contract at ${contractAddress}. Please raise
                    an issue to add this token at https://github.com/TripleSpeeder/token-allowance-checker/issues!`)
            }
        }
        let decimals = web3.utils.toBN('0')
        try {
            decimals = await contractInstance.decimals()
        } catch(error) {
            console.warn(`Contract at ${contractAddress} does not provide decimals(). Assuming 0.`)
        }
        let totalSupply, balance
        try {
            totalSupply = await contractInstance.totalSupply()
            // balance = await contractInstance.balanceOf(owner)
        } catch (error) {
            console.warn(`Contract at ${contractAddress} is not ERC20. Ignoring.`)
            return
        }
        dispatch(addContract({
            id: contractAddress,
            tokenContract: contractInstance
        }))
    }
}