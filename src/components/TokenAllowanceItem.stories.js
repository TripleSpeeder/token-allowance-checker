import React from 'react'
import { action } from '@storybook/addon-actions'
import {Button, Container, Modal} from 'semantic-ui-react'
import TokenAllowanceItem from './TokenAllowanceItem'
import BN from 'bn.js'

export default {
    title: 'TokenAllowanceItem',
    component: TokenAllowanceItem,
    decorators: [
        story => (
            <Container>
                {story()}
            </Container>
        )
    ]}

const unlimitedAllowance = new BN(2).pow(new BN(256)).subn(1)
const decimals = new BN(12)
const supply = new BN('51696243591050228877165296')

const spenderAddresses = [
    '0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b',
    '0xBA9262578EFef8b3aFf7F60Cd629d6CC8859C8b5',
    '0x493C57C4763932315A328269E1ADaD09653B9081',
]
const spenderENSNames = {
    '0xBA9262578EFef8b3aFf7F60Cd629d6CC8859C8b5': 'cool.stuff.eth',
    '0x493C57C4763932315A328269E1ADaD09653B9081': 'dai.eth'
}
const allowances = {
    '0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b': new BN(52552832434),
    '0xBA9262578EFef8b3aFf7F60Cd629d6CC8859C8b5': unlimitedAllowance,
    '0x493C57C4763932315A328269E1ADaD09653B9081': new BN(783442234523412)
}
const partAllowances = {
    '0x493C57C4763932315A328269E1ADaD09653B9081': new BN(783442234576453)
}

export const loaded = () => (
    <TokenAllowanceItem
        tokenName={'Dai Stablecoin'}
        tokenSymbol={'DAI'}
        tokenAddress={'0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b'}
        tokenDecimals={decimals}
        tokenSupply={supply}
        spenders={spenderAddresses}
        spenderENSNames={spenderENSNames}
        allowances={allowances}
    />
)

export const loading = () => (
    <TokenAllowanceItem
        tokenName={'Dai Stablecoin'}
        tokenSymbol={'DAI'}
        tokenAddress={'0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b'}
        tokenDecimals={decimals}
        tokenSupply={supply}
        spenders={spenderAddresses}
        spenderENSNames={spenderENSNames}
        allowances={{}}
    />
)

export const partlyLoaded = () => (
    <TokenAllowanceItem
        tokenName={'Dai Stablecoin'}
        tokenSymbol={'DAI'}
        tokenAddress={'0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b'}
        tokenDecimals={decimals}
        tokenSupply={supply}
        spenders={spenderAddresses}
        spenderENSNames={spenderENSNames}
        allowances={partAllowances}
    />
)

export const unknownToken = () => (
    <TokenAllowanceItem
        tokenName={''}
        tokenSymbol={''}
        tokenAddress={'0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b'}
        tokenDecimals={decimals}
        tokenSupply={supply}
        spenders={spenderAddresses}
        spenderENSNames={spenderENSNames}
        allowances={partAllowances}
    />
)
