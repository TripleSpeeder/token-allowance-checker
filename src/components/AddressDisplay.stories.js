import React from 'react'
import AddressDisplay from './AddressDisplay'
import {Container} from 'semantic-ui-react'

export default {
    title: 'AddressDisplay',
    component: AddressDisplay,
    decorators: [
        story => (
            <Container>
                {story()}
            </Container>
        )
    ]
}

const AddressDisplayProps = {
    address: '0x0D0707963952f2fBA59dD06f2b425ace40b492Fe',
    ensName: 'cool.stuff.eth'
}

export const noENS = () => (
    <AddressDisplay
        address={AddressDisplayProps.address}
    />
)

export const withENS = () => (
    <AddressDisplay
        address={AddressDisplayProps.address}
        ensName={AddressDisplayProps.ensName}
    />
)
