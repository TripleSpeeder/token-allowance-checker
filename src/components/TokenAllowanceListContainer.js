import React, {ReactElement, useContext, useEffect, useState} from 'react'
import ERC20Data from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import {Web3Context} from './OnboardGate'
import PropTypes from 'prop-types'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contract = require('@truffle/contract')

/*
    TokenAllowanceListContainer:
    - stores token contract address and instance
    - list of addresses that have an allowance
    - Renders TokenAllowanceListItem for each address having an allowance
 */
const TokenAllowanceListContainer = ({contractAddress, owner, spenders}) => {
    const web3Context = useContext(Web3Context)
    const [contractInstance, setContractInstance] = useState(null)
    const [decimals, setDecimals] = useState(0)
    const [tokenName, setTokenName] = useState('')
    const [addressAllowances, setAddressAllowances] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAllowances = async () => {
            setLoading(true)

            // initialize contract
            const erc20Contract = contract(ERC20Data)
            erc20Contract.setProvider(web3Context.web3.currentProvider)
            const contractInstance = await erc20Contract.at(contractAddress)
            setDecimals(await contractInstance.decimals())
            setTokenName(await contractInstance.name())

            // for each allowedAddress, get current allowance from checkAddress to allowedAddress
            const allowances = {}
            for (const spender of spenders) {
                const allowance = await contractInstance.allowance(owner, spender)
                allowances[spender] = allowance
            }
            setAddressAllowances(allowances)

            setLoading(false)
        }
        getAllowances()
    }, [web3Context.web3, contractAddress, owner, spenders])

    const listItems = []
    for (const [key, value] of Object.entries(addressAllowances)) {
        listItems.push(<li key={key}>{key}: {value.toString()}</li>)
    }

    return (
        <div>
            <p>{`AllowanceList for contract ${contractAddress}`}</p>
            <ul>
                {listItems}
            </ul>
        </div>
    )
}

TokenAllowanceListContainer.propTypes = {
    contractAddress: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    spenders: PropTypes.array.isRequired,
}



export default TokenAllowanceListContainer