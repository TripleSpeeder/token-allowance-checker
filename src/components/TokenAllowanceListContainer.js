import React, {ReactElement, useContext, useEffect, useState} from 'react'
import ERC20Data from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import {Web3Context} from './OnboardGate'
import PropTypes from 'prop-types'
import TokenAllowanceItem from './TokenAllowanceItem'
const contract = require('@truffle/contract')
const namehash = require('eth-ens-namehash')

/*
    TokenAllowanceListContainer:
    - stores token contract address and instance
    - list of addresses that have an allowance
    - Renders TokenAllowanceListItem for each address having an allowance
 */
const TokenAllowanceListContainer = ({contractAddress, owner, spenders}) => {
    const web3Context = useContext(Web3Context)
    const [contractInstance, setContractInstance] = useState(null)
    const [tokenDecimals, setTokenDecimals] = useState()
    const [tokenSupply, setTokenSupply] = useState()
    const [tokenName, setTokenName] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [addressAllowances, setAddressAllowances] = useState({})
    const [loading, setLoading] = useState(true)
    const [reverseNames, setReverseNames] = useState({})
    const [ownerBalance, setOwnerBalance] = useState()

    useEffect(() => {
        let cancelled = false
        const getAllowances = async () => {
            setLoading(true)

            // initialize contract
            const erc20Contract = contract(ERC20Data)
            erc20Contract.setProvider(web3Context.web3.currentProvider)
            const contractInstance = await erc20Contract.at(contractAddress)
            const decimals = await contractInstance.decimals()
            const totalSupply = await contractInstance.totalSupply()
            const balance = await contractInstance.balanceOf(owner)
            if (cancelled)
                return
            setTokenDecimals(decimals)
            setTokenSupply(totalSupply)
            setOwnerBalance(balance)
            try {
                setTokenName(await contractInstance.name())
                setTokenSymbol(await contractInstance.symbol())
            } catch(error) {
                // Most likely token contract does not implement the name() method. Ignore error.
                console.log(`Failed to get name/symbol of contract at ${contractAddress}`)
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

    useEffect(() => {
        let cancelled = false
        const getReverseNames = async(web3) => {
            const foundNames = {}
            for (const spender of spenders) {
                try {
                    const lookup = spender.toLowerCase().substr(2) + '.addr.reverse'
                    const ResolverContract = await web3.eth.ens.resolver(lookup)
                    const nh = namehash.hash(lookup)
                    const reverseName = await ResolverContract.methods.name(nh).call()
                    foundNames[spender] = reverseName
                } catch(error) {
                    console.log(`No reverse name found for ${spender}`)
                }
            }
            console.log(`Found reverse names: `)
            console.log(foundNames)
            setReverseNames(foundNames)
        }
        if (web3Context.web3) {
            getReverseNames(web3Context.web3)
        }
        return () => {
            cancelled = true
        }
    }, [web3Context.web3, spenders])

    return <TokenAllowanceItem
        tokenName={tokenName}
        tokenAddress={contractAddress}
        tokenDecimals={tokenDecimals}
        tokenSupply={tokenSupply}
        tokenSymbol={tokenSymbol}
        ownerBalance={ownerBalance}
        spenders={spenders}
        spenderENSNames={reverseNames}
        allowances={addressAllowances}
    />
}

TokenAllowanceListContainer.propTypes = {
    contractAddress: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    spenders: PropTypes.array.isRequired,
}

export default TokenAllowanceListContainer