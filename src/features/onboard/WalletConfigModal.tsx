import React from 'react'
import { Button, Message, Modal, Icon } from 'semantic-ui-react'
import AddressDisplay from '../../components/AddressDisplay'
import { Wallet } from 'bnc-onboard/dist/src/interfaces'
import { EthAddress } from '../addressInput/AddressSlice'

interface WalletConfigModalProps {
    handleChangeWallet: () => void
    handleChangeAddress: () => void
    handleClose: () => void
    wallet?: Wallet
    walletAddress?: EthAddress
    mobile: boolean
    networkId: number
}

const WalletConfigModal = ({
    handleChangeWallet,
    handleChangeAddress,
    handleClose,
    mobile,
    networkId,
    wallet,
    walletAddress,
}: WalletConfigModalProps) => {
    const currentWallet = wallet?.name ? (
        <p>
            Connected to <strong>{wallet.name}</strong>.
        </p>
    ) : (
        <p>No wallet connected.</p>
    )
    const currentAddress = walletAddress ? (
        <AddressDisplay
            ethAddress={walletAddress}
            mobile={mobile}
            networkId={networkId}
        />
    ) : (
        'None'
    )
    const size = mobile ? 'small' : 'large'

    const msgs = []
    msgs.push(
        <Message icon info size={size} key={1}>
            <Icon name='linkify' />
            <Message.Content>
                <Message.Header>Wallet</Message.Header>
                {currentWallet}
                <Button primary size={'small'} onClick={handleChangeWallet}>
                    Change Wallet
                </Button>
            </Message.Content>
        </Message>
    )
    if (wallet?.type === 'hardware') {
        msgs.push(
            <Message icon info size={size} key={2}>
                <Icon name='id card outline' />
                <Message.Content>
                    <Message.Header>Wallet address</Message.Header>
                    <p>{wallet?.name} wallet supports multiple addresses.</p>
                    <p>Current address: {currentAddress}</p>
                    <Button
                        primary
                        size={'small'}
                        onClick={handleChangeAddress}
                    >
                        Change Address
                    </Button>
                </Message.Content>
            </Message>
        )
    }

    const modal = (
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

    return modal
}

export default WalletConfigModal
