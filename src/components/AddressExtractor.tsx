import React, { FunctionComponent, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    CheckAddressStates,
    setCheckAddressThunk,
} from '../features/addressInput/AddressSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../app/rootReducer'

interface AddressExtractorProps {
    children?: React.ReactNode
}

const AddressExtractor: FunctionComponent = ({
    children,
}: AddressExtractorProps) => {
    const dispatch = useDispatch()
    const { address: addressFromParams } = useParams()
    const { checkAddressState } = useSelector(
        (state: RootState) => state.addresses
    )
    const { checkAddressId } = useSelector(
        (state: RootState) => state.addresses
    )

    // watch url params address change
    useEffect(() => {
        if (addressFromParams) {
            console.log(
                `AddressExtractor: Setting new address ${addressFromParams}`
            )
            dispatch(setCheckAddressThunk(addressFromParams))
        }
    }, [addressFromParams, dispatch])

    if (checkAddressState === CheckAddressStates.Invalid) {
        return <div>Address {checkAddressId} is invalid</div>
    }

    if (checkAddressState === CheckAddressStates.Resolving) {
        return <div>Resolving...</div>
    }

    return <React.Fragment>{children}</React.Fragment>
}

export default AddressExtractor
