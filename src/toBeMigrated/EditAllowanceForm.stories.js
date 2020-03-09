import React from 'react'
import { action } from '@storybook/addon-actions'
import {Button, Container, Modal} from 'semantic-ui-react'
import BN from 'bn.js'
import EditAllowanceForm from './EditAllowanceForm'

export default {
    title: 'EditAllowanceForm',
    component: EditAllowanceForm,
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
const spenderAddress = '0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b'
const spenderENSName = 'cool.stuff.eth'
const currentAllowance = '455.634'

export const normal = () => (
    <EditAllowanceForm
        showModal={true}
        tokenName={'Dai Stablecoin'}
        tokenSymbol={'Dai'}
        tokenAddress={'0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b'}
        tokenDecimals={decimals}
        tokenSupply={supply}
        spenderAddress={spenderAddress}
        spenderENSName={spenderENSName}
        currentAllowance={currentAllowance}
        handleChange={action('handleChange')}
        handleClose={action('handleClose')}
        handleSubmit={action('handleSubmit')}
    />
)

