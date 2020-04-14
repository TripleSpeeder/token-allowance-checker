import React from 'react'
import WalletSelector from './walletSelector'
import { EthAddress, ResolvingStates } from '../addressInput/AddressSlice'
import { action } from '@storybook/addon-actions'

export default {
    title: 'WalletSelector',
    component: WalletSelector,
    decorators: [],
}

const plainAccount: EthAddress = {
    address: '0x37e13bcd71c65b6657f5d643b3659f4bad693bc2',
    resolvingState: ResolvingStates.Resolved,
}

const ensAccount: EthAddress = {
    address: '0x37e13bcd71c65b6657f5d643b3659f4bad693bc2',
    ensName: 'tac.dappstar.eth',
    resolvingState: ResolvingStates.Resolved,
}

const handleClick = action('handleClick')

export const noWallet = () => <WalletSelector handleClick={handleClick} />

export const noAccount = () => (
    <WalletSelector handleClick={handleClick} walletName={'Metamask'} />
)

export const withPlainAccount = () => (
    <WalletSelector
        handleClick={handleClick}
        walletName={'Metamask'}
        walletAccount={plainAccount}
    />
)

export const withENSAccount = () => (
    <WalletSelector
        handleClick={handleClick}
        walletName={'Metamask'}
        walletAccount={ensAccount}
    />
)
