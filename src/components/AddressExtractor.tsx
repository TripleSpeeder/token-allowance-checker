import React, { FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    CheckAddressStates,
    redirectToAddress,
    setAddressFromParamsThunk,
} from '../features/addressInput/AddressSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../app/rootReducer'
import { Icon, Message, Segment } from 'semantic-ui-react'
import { useHistory } from 'react-router'

interface AddressExtractorProps {
    children?: React.ReactNode
}

const AddressExtractor: FunctionComponent = ({
    children,
}: AddressExtractorProps) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { address: addressFromParams } = useParams()
    const { checkAddressState } = useSelector(
        (state: RootState) => state.addresses
    )
    const walletAddressId = useSelector(
        (state: RootState) => state.addresses.walletAddressId
    )
    const [prevAddressFromParams, setPrevAddressFromParams] = useState('')

    // watch url params address change
    useEffect(() => {
        if (addressFromParams) {
            if (prevAddressFromParams !== addressFromParams) {
                console.log(
                    `AddressExtractor: Setting new address ${addressFromParams}`
                )
                dispatch(setAddressFromParamsThunk(addressFromParams))
                setPrevAddressFromParams(addressFromParams)
            } else {
                console.log(
                    `AddressExtractor: ${addressFromParams} already dispatched.`
                )
            }
        } else if (walletAddressId) {
            console.log(`No address in params. Trying fallback to wallet.`)
            // no address provided via url. Fall back to wallet address.
            dispatch(redirectToAddress(walletAddressId, history))
        }
    }, [
        addressFromParams,
        prevAddressFromParams,
        walletAddressId,
        history,
        dispatch,
    ])

    if (checkAddressState === CheckAddressStates.Invalid) {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message error icon size={'huge'}>
                    <Icon name='exclamation triangle' />
                    <Message.Content>
                        <Message.Header>Invalid address</Message.Header>
                        {`Address ${addressFromParams} is invalid`}
                    </Message.Content>
                </Message>
            </Segment>
        )
    }

    if (checkAddressState === CheckAddressStates.Resolving) {
        return (
            <Segment basic padded='very' textAlign={'center'}>
                <Message icon warning size={'huge'}>
                    <Icon name='circle notched' loading />
                    <Message.Content>
                        <Message.Header>Checking address</Message.Header>
                        <div>{`Checking address ${addressFromParams}`}</div>
                    </Message.Content>
                </Message>
            </Segment>
        )
    }

    return <React.Fragment>{children}</React.Fragment>
}

export default AddressExtractor
