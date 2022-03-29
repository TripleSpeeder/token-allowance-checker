import React from 'react'
import { Button, Icon, Message, Modal } from 'semantic-ui-react'
import AddressDisplay from '../../components/AddressDisplay'
import { EthAddress } from '../addressInput/AddressSlice'
import { WalletState } from '@web3-onboard/core'

interface WalletConfigModalProps {
  handleChangeWallet: () => void
  handleChangeAddress: () => void
  handleClose: () => void
  wallet?: WalletState
  walletAddress?: EthAddress
  mobile: boolean
  chainId: string
}

const WalletConfigModal = ({
  handleChangeWallet,
  handleChangeAddress,
  handleClose,
  mobile,
  chainId,
  wallet,
  walletAddress
}: WalletConfigModalProps) => {
  const currentWallet = wallet?.label ? (
    <p>
      Connected to <strong>{wallet.label}</strong>.
    </p>
  ) : (
    <p>No wallet connected.</p>
  )

  const walletMsgIcon = wallet?.label ? 'linkify' : 'unlinkify'

  const currentAddress = walletAddress ? (
    <AddressDisplay
      ethAddress={walletAddress}
      mobile={mobile}
      chainId={chainId}
    />
  ) : (
    'None'
  )

  const size = mobile ? 'small' : 'large'
  const supportsMultipleAddresses = false
  /*
  if (wallet?.type === 'hardware') {
    if (wallet.name?.toLowerCase() === 'lattice') {
      console.log(
        `Lattice wallet currently does not support multiple addresses`
      )
      supportsMultipleAddresses = false
    } else {
      supportsMultipleAddresses = true
    }
  }

   */

  const msgs = []
  msgs.push(
    <Message icon info size={size} key={1}>
      <Icon name={walletMsgIcon} />
      <Message.Content>
        <Message.Header>Wallet</Message.Header>
        {currentWallet}
        <Button primary size={'small'} onClick={handleChangeWallet}>
          Change Wallet
        </Button>
      </Message.Content>
    </Message>
  )
  if (supportsMultipleAddresses) {
    msgs.push(
      <Message icon info size={size} key={2}>
        <Icon name='id card outline' />
        <Message.Content>
          <Message.Header>Wallet address</Message.Header>
          <p>{wallet?.label} wallet supports multiple addresses.</p>
          <p>Current address: {currentAddress}</p>
          <Button primary size={'small'} onClick={handleChangeAddress}>
            Change Address
          </Button>
        </Message.Content>
      </Message>
    )
  }

  return (
    <Modal open={true} size={size} onClose={handleClose}>
      <Modal.Header>Wallet configuration</Modal.Header>
      <Modal.Content>{msgs}</Modal.Content>
      <Modal.Actions>
        <Button size={'small'} onClick={handleClose}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default WalletConfigModal
