import React from 'react'
import WalletConfigModal from './WalletConfigModal'
import { action } from '@storybook/addon-actions'
import { Wallet } from 'bnc-onboard/dist/src/interfaces'
import { EthAddress, ResolvingStates } from '../addressInput/AddressSlice'
import { boolean, withKnobs } from '@storybook/addon-knobs'

export default {
    title: 'WalletConfigModal',
    component: WalletConfigModal,
    decorators: [withKnobs],
}

const metamaskWallet: Wallet = {
    connect: undefined,
    dashboard: () => {
        /* just a dummy*/
    },
    instance: null,
    name: 'Metamask',
    provider: null,
    type: 'injected',
}

const ledgerWallet: Wallet = {
    connect: undefined,
    dashboard: () => {
        /* just a dummy*/
    },
    instance: null,
    name: 'Ledger',
    provider: null,
    type: 'hardware',
}

const addressWithENS: EthAddress = {
    address: '0xa7b0536fb02c593b0dfd82bd65aacbdd19ae4777',
    ensName: 'gimme.more.eth',
    resolvingState: ResolvingStates.Resolved,
}

const address: EthAddress = {
    address: '0xa7b0536fb02c593b0dfd82bd65aacbdd19ae4777',
    resolvingState: ResolvingStates.Resolved,
}

export const noWallet = () => (
    <WalletConfigModal
        handleChangeAddress={action('change address')}
        handleChangeWallet={action('change wallet')}
        handleClose={action('handleClose')}
        mobile={boolean('mobile', false)}
        networkId={1}
    />
)

export const desktopWallet = () => (
    <WalletConfigModal
        handleChangeAddress={action('change address')}
        handleChangeWallet={action('change wallet')}
        handleClose={action('handleClose')}
        mobile={boolean('mobile', false)}
        networkId={1}
        wallet={metamaskWallet}
        walletAddress={addressWithENS}
    />
)

export const hwWallet = () => (
    <WalletConfigModal
        handleChangeAddress={action('change address')}
        handleChangeWallet={action('change wallet')}
        handleClose={action('handleClose')}
        mobile={boolean('mobile', false)}
        networkId={1}
        wallet={ledgerWallet}
        walletAddress={address}
    />
)

export const mobileWallet = () => (
    <WalletConfigModal
        handleChangeAddress={action('change address')}
        handleChangeWallet={action('change wallet')}
        handleClose={action('handleClose')}
        mobile={boolean('mobile', false)}
        networkId={1}
        walletAddress={addressWithENS}
    />
)
