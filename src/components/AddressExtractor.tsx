import React, { FunctionComponent, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
    clearCheckAddressId,
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
    const history = useHistory()
    const { address: addressFromParams } = useParams()
    const { walletAddressId: addressFromWallet } = useSelector(
        (state: RootState) => state.addresses
    )
    const { web3 } = useSelector((state: RootState) => state.onboard)

    useEffect(() => {
        if (addressFromParams) {
            if (web3) {
                console.log(
                    `AddressExtractor: Setting new address ${addressFromParams}`
                )
                dispatch(setCheckAddressThunk(addressFromParams.toLowerCase()))
            }
        } else if (addressFromWallet) {
            console.log(
                `AddressExtractor: no address in params. Falling back to walletAddress ${addressFromWallet}`
            )
            history.push(`/address/${addressFromWallet}`)
        } else {
            console.log(`AddressExtractor: Clearing checkAddressId`)
            dispatch(clearCheckAddressId())
        }
    }, [addressFromParams, addressFromWallet, dispatch, history, web3])

    return <React.Fragment>{children}</React.Fragment>
}

export default AddressExtractor
