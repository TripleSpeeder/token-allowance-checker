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
        let cancelled = false
        const getAllowances = async () => {
            setLoading(true)

            // initialize contract
            const erc20Contract = contract(ERC20Data)
            erc20Contract.setProvider(web3Context.web3.currentProvider)
            const contractInstance = await erc20Contract.at(contractAddress)
            if (cancelled)
                return
            setDecimals(await contractInstance.decimals())
            try {
                setTokenName(await contractInstance.name())
            } catch(error) {
                // Most likely token contract does not implement the name() method. Ignore error.
                console.log(`Failed to get name of contract at ${contractAddress}`)
            }

            // for each allowedAddress, get current allowance of spender
            const allowances = {}
            for (const spender of spenders) {
                const allowance = await contractInstance.allowance(owner, spender)
                if (cancelled)
                    return
                allowances[spender] = allowance
            }
            setAddressAllowances(allowances)

            setLoading(false)
        }
        getAllowances()
        return () => {
            cancelled = true
        }
    }, [web3Context.web3, contractAddress, owner, spenders])

    const listItems = []
    if (loading) {
        listItems.push(<li key={1}>Loading...</li>)
    } else {
        for (const [key, value] of Object.entries(addressAllowances)) {
            listItems.push(<li key={key}>{key}: {value.toString()}</li>)
        }
    }

    return (
        <div>
            <p>{`AllowanceList for ${tokenName ? tokenName : 'unnamed token'} contract at ${contractAddress}`}</p>
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