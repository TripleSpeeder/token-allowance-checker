import React from 'react'
import { Icon, Popup, Item } from 'semantic-ui-react'
import { EthAddress } from 'features/addressInput/AddressSlice'

interface AddressDisplayProps {
    ethAddress: EthAddress
    mobile: boolean
    networkId: number
    inline?: boolean
}

const AddressDisplay = ({
    ethAddress,
    mobile,
    networkId,
    inline,
}: AddressDisplayProps) => {
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
        contractName = `${ensName}`
    } else if (esContractName) {
        contractName = `${esContractName}`
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

    if (mobile) {
        const shortAddress =
            address.substr(0, 6) + '...' + address.substr(-6, 6)
        const contractNameString = esContractName && (
            <div>
                Contract name: <strong>{esContractName}</strong>
            </div>
        )
        const ensNameString = ensName && (
            <div>
                ENS name: <strong>{ensName}</strong>
            </div>
        )
        const popupContent = (
            <Item>
                <Item.Content>
                    <Item.Header>{address}</Item.Header>
                    <Item.Content>
                        {contractNameString}
                        {ensNameString}
                    </Item.Content>
                    <Item.Extra>
                        <Icon
                            link
                            circular
                            name={'copy outline'}
                            onClick={() => {
                                setClipboard(address)
                            }}
                        />
                        <Icon
                            link
                            circular
                            name={'external square'}
                            onClick={() => {
                                window.open(etherscanUrl, '_blank')
                            }}
                        />
                    </Item.Extra>
                </Item.Content>
            </Item>
        )
        let popupTrigger
        if (inline) {
            popupTrigger = <strong>{contractName ?? shortAddress}</strong>
        } else {
            popupTrigger = (
                <div>
                    <strong>{contractName ?? shortAddress}</strong>
                </div>
            )
        }
        return (
            <Popup
                on={'click'}
                content={popupContent}
                trigger={popupTrigger}
            ></Popup>
        )
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
