import { Button } from 'semantic-ui-react'
import React from 'react'
import { EthAddress } from '../addressInput/AddressSlice'

interface WalletSelectorProps {
  walletName?: string | null
  walletAccount?: EthAddress
  handleClick: () => void
}

const WalletSelector = ({ walletName, handleClick }: WalletSelectorProps) => {
  const gotWallet = !!walletName
  const buttonLabel = walletName ? `Wallet: ${walletName}` : 'Connect wallet'

  return (
    <Button fluid positive={gotWallet} onClick={handleClick}>
      {buttonLabel}
    </Button>
  )
}

export default WalletSelector
