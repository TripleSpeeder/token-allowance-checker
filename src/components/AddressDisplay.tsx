import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'
import { EthAddress } from 'features/addressInput/AddressSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../app/rootReducer'

interface AddressDisplayProps {
    ethAddress: EthAddress
}

const AddressDisplay = ({ ethAddress }: AddressDisplayProps) => {
    const networkId: number = useSelector(
        (state: RootState) => state.onboard.networkId
    )
    const { address, ensName, esContractName } = ethAddress
    const setClipboard = (content: string) => {
        navigator.clipboard.writeText(content).then(
            function() {
                /* clipboard successfully set */
            },
            function() {
                console.log(`failed to set clipboard`)
            }
        )
    }

    let contractName
    if (ensName) {
        contractName = `Reverse ENS: ${ensName}`
    } else if (esContractName) {
        contractName = `Contract: ${esContractName}`
    }

    let etherscanUrl: string
    switch (networkId) {
        case 3: // Ropsten
            etherscanUrl = `https://ropsten.etherscan.io/address/${address}`
            break
        case 1:
            etherscanUrl = `https://etherscan.io/address/${address}`
            break
        default:
            etherscanUrl = `https://etherscan.io/address/${address}`
    }

    if (contractName) {
        return (
            <>
                <div>
                    <strong>{contractName}</strong>
                </div>
                <div>
                    <small>
                        {address}&nbsp;
                        <Popup
                            mouseEnterDelay={500}
                            content={'Copy to clipboard'}
                            trigger={
                                <Icon
                                    circular
                                    name={'copy outline'}
                                    size={'small'}
                                    onClick={() => {
                                        setClipboard(address)
                                    }}
                                />
                            }
                        />
                        <Popup
                            mouseEnterDelay={500}
                            content={'View on Etherscan'}
                            trigger={
                                <Icon
                                    circular
                                    name={'external square'}
                                    size={'small'}
                                    onClick={() => {
                                        window.open(etherscanUrl, '_blank')
                                    }}
                                />
                            }
                        />
                    </small>
                </div>
            </>
        )
    } else {
        return (
            <div>
                {address}&nbsp;
                <Popup
                    mouseEnterDelay={500}
                    content={'Copy to clipboard'}
                    trigger={
                        <Icon
                            circular
                            name={'copy outline'}
                            size={'small'}
                            onClick={() => {
                                setClipboard(address)
                            }}
                        />
                    }
                />
                <Popup
                    mouseEnterDelay={500}
                    content={'View on Etherscan'}
                    trigger={
                        <Icon
                            circular
                            name={'external square'}
                            size={'small'}
                            onClick={() => {
                                window.open(etherscanUrl, '_blank')
                            }}
                        />
                    }
                />
            </div>
        )
    }
}

export default AddressDisplay
