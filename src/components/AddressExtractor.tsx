import React, { FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    CheckAddressStates,
    redirectToAddress,
    setAddressFromParamsThunk,
} from '../features/addressInput/AddressSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../app/rootReducer'
import { Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import DisplayMessage from './DisplayMessage'

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
    const mobile = useSelector((state: RootState) => state.respsonsive.mobile)
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
            dispatch(redirectToAddress(walletAddressId, history, true))
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
            <DisplayMessage
                mobile={mobile}
                header={'Invalid address'}
                body={`Address ${addressFromParams} is invalid`}
                icon={<Icon name='exclamation triangle' />}
                error={true}
            />
        )
    }

    if (checkAddressState === CheckAddressStates.Resolving) {
        return (
            <DisplayMessage
                mobile={mobile}
                header={'Checking address'}
                body={`Checking address ${addressFromParams}`}
                icon={<Icon name='circle notched' loading />}
                warning={true}
            />
        )
    }

    return <React.Fragment>{children}</React.Fragment>
}

export default AddressExtractor
