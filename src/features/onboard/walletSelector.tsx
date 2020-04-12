import { Button } from 'semantic-ui-react'
import React from 'react'
import { EthAddress } from '../addressInput/AddressSlice'

interface WalletSelectorProps {
    walletName?: string
    walletAccount?: EthAddress
    handleClick: () => void
}

const WalletSelector = ({
    walletName,
    walletAccount,
    handleClick,
}: WalletSelectorProps) => {
    let buttonLabel
    if (walletAccount) {
        const shortAddress =
            walletAccount.address.substr(0, 6) +
            '...' +
            walletAccount.address.substr(-6, 6)
        buttonLabel = walletAccount.ensName ?? shortAddress
    } else if (walletName) {
        // Wallet connected, but no access to account
        buttonLabel = 'no wallet account'
    } else {
        // No wallet connected
        buttonLabel = 'connect wallet'
    }

    return (
        <Button primary onClick={handleClick}>
            {buttonLabel}
        </Button>
    )
}

export default WalletSelector
