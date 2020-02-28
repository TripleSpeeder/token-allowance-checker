import React, {useContext, useEffect, useState} from 'react'
import ERC20Data from '@openzeppelin/contracts/build/contracts/ERC20Detailed.json'
import PropTypes from 'prop-types'
import TokenAllowanceItemContainer from './TokenAllowanceItemContainer'
import wellKnownContracts from './wellKnownContracts'
const contract = require('@truffle/contract')
const namehash = require('eth-ens-namehash')


/*
    TokenAllowanceListContainer:
    - stores token contract address and instance
    - list of addresses that have an allowance
    - Renders TokenAllowanceListItem for each address having an allowance
 */
const TokenAllowanceListContainer = ({contractAddress, owner, spenders, showZeroAllowances, addressFilter}) => {
    const web3Context = undefined // (Web3Context)
    const [contractInstance, setContractInstance] = useState(null)
    const [tokenDecimals, setTokenDecimals] = useState()
    const [tokenSupply, setTokenSupply] = useState()
    const [tokenName, setTokenName] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [addressAllowances, setAddressAllowances] = useState({})
    const [, setLoading] = useState(true)
    const [reverseNames, setReverseNames] = useState({})
    const [ownerBalance, setOwnerBalance] = useState()
    const [erc20Compliant, setErc20Compliant] = useState(true)

    useEffect(() => {
        let cancelled = false
        const getAllowances = async () => {
            setLoading(true)

            // initialize contract
            let isCompliant = true
            const erc20Contract = contract(ERC20Data)
            erc20Contract.setProvider(web3Context.web3.currentProvider)
            const contractInstance = await erc20Contract.at(contractAddress)
            let tokenName = ''
            let tokenSymbol = ''
            // Some contracts like MKR and SAI do not implement the correct ERC20 name and symbol.
            // Get their data from hardocded fallback
            if (Object.keys(wellKnownContracts[web3Context.networkId]).includes(contractAddress.toLowerCase())) {
                tokenName = wellKnownContracts[web3Context.networkId][contractAddress.toLowerCase()].name
                tokenSymbol = wellKnownContracts[web3Context.networkId][contractAddress.toLowerCase()].symbol
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
            let decimals = web3Context.web3.utils.toBN('0')
            try {
                decimals = await contractInstance.decimals()
            } catch(error) {
                console.warn(`Contract at ${contractAddress} does not provide decimals(). Assuming 0.`)
            }
            let totalSupply, balance
            try {
                totalSupply = await contractInstance.totalSupply()
                balance = await contractInstance.balanceOf(owner)
            } catch (error) {
                console.warn(`Contract at ${contractAddress} is not ERC20. Ignoring.`)
                isCompliant = false
            }
            if (cancelled)
                return
            setErc20Compliant(isCompliant)
            setContractInstance(contractInstance)
            setTokenDecimals(decimals)
            setTokenSupply(totalSupply)
            setOwnerBalance(balance)
            setTokenName(tokenName)
            setTokenSymbol(tokenSymbol)

            // for each allowedAddress, get current allowance of spender
            const allowances = {}
            if (isCompliant) {
                for (const spender of spenders) {
                    const allowance = await contractInstance.allowance(owner, spender)
                    if (cancelled)
                        return
                    allowances[spender] = allowance
                }
                setAddressAllowances(allowances)
            }
            setLoading(false)
        }
        getAllowances()
        return () => {
            cancelled = true
        }
    }, [web3Context.web3, web3Context.networkId, contractAddress, owner, spenders])

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
                    // console.log(`No reverse name found for ${spender}`)
                }
            }
            if (cancelled) {
                return
            }
            setReverseNames(foundNames)
        }
        if (web3Context.web3) {
            getReverseNames(web3Context.web3)
        }
        return () => {
            cancelled = true
        }
    }, [web3Context.web3, spenders])

    const reloadAllowance = async (owner, spender) => {
        try {
            addressAllowances[spender] = undefined
            setAddressAllowances(addressAllowances)
            const allowance = await contractInstance.allowance(owner, spender)
            addressAllowances[spender] = allowance
            setAddressAllowances(addressAllowances)
        }catch(e) {
            console.log(`Error loading allowance: ${e}`)
        }
    }

    let matchedFilter = true
    if (addressFilter.length) {
        const filterString = addressFilter.toLowerCase()
        matchedFilter = (
                tokenName.toLowerCase().includes(filterString) ||
                tokenSymbol.toLowerCase().includes(filterString) ||
                contractAddress.toLowerCase().includes(filterString)
        )
    }

    if (!erc20Compliant || !matchedFilter) {
        return null
    }

    return (<TokenAllowanceItemContainer
                tokenName={tokenName}
                tokenAddress={contractAddress}
                tokenDecimals={tokenDecimals}
                tokenSupply={tokenSupply}
                tokenSymbol={tokenSymbol}
                owner={owner}
                ownerBalance={ownerBalance}
                spenders={spenders}
                spenderENSNames={reverseNames}
                allowances={addressAllowances}
                tokenContractInstance={contractInstance}
                showZeroAllowances={showZeroAllowances}
                addressFilter={addressFilter}
                reloadAllowanceFunc={reloadAllowance}
            />)
}

TokenAllowanceListContainer.propTypes = {
    contractAddress: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    spenders: PropTypes.array.isRequired,
    showZeroAllowances: PropTypes.bool.isRequired,
    addressFilter: PropTypes.string.isRequired,
}

export default TokenAllowanceListContainer