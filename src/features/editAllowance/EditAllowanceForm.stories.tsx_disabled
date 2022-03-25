import React from 'react'
import { action } from '@storybook/addon-actions'
import { Container } from 'semantic-ui-react'
import EditAllowanceForm from './EditAllowanceForm'
import { EthAddress, ResolvingStates } from '../addressInput/AddressSlice'

export default {
    title: 'EditAllowanceForm',
    component: EditAllowanceForm,
    decorators: [
        (story: () => React.ReactNode) => <Container>{story()}</Container>,
    ],
}

const spenderAddress = '0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b'
const spenderENSName = 'cool.stuff.eth'
const spender: EthAddress = {
    address: spenderAddress,
    ensName: spenderENSName,
    resolvingState: ResolvingStates.Resolved,
}
const currentAllowance = '455.634'

export const desktop = () => (
    <EditAllowanceForm
        mobile={false}
        tokenName={'Dai Stablecoin'}
        tokenSymbol={'Dai'}
        tokenAddress={'0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b'}
        currentAllowance={currentAllowance}
        newAllowance={'100'}
        spender={spender}
        handleChange={action('handleChange')}
        handleClose={action('handleClose')}
        handleSubmit={action('handleSubmit')}
    />
)

export const mobile = () => (
    <EditAllowanceForm
        mobile={true}
        tokenName={'Dai Stablecoin'}
        tokenSymbol={'Dai'}
        tokenAddress={'0x73FbC940ACcDc620c0D6E27e1511D06Cd406228b'}
        currentAllowance={currentAllowance}
        newAllowance={'100'}
        spender={spender}
        handleChange={action('handleChange')}
        handleClose={action('handleClose')}
        handleSubmit={action('handleSubmit')}
    />
)
