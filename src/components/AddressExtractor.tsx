import React, {useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {setCheckAddressThunk, clearCheckAddressId} from '../features/addressInput/AddressSlice'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../app/rootReducer'


const AddressExtractor = (props: React.PropsWithChildren<any>) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const {address: addressFromParams} = useParams()
    const {walletAddressId: addressFromWallet} = useSelector((state:RootState) => state.addresses)
    const {web3} = useSelector((state:RootState) => state.onboard)

    useEffect(()=> {
        if (addressFromParams) {
            if (web3) {
                console.log(`AddressExtractor: Setting new address ${addressFromParams}`)
                dispatch(setCheckAddressThunk(addressFromParams.toLowerCase()))
            }
        } else if (addressFromWallet) {
            console.log(`AddressExtractor: no address in params. Falling back to walletAddress ${addressFromWallet}`)
            history.push(`/address/${addressFromWallet}`)
        } else {
            console.log(`AddressExtractor: Clearing checkAddressId`)
            dispatch(clearCheckAddressId())
        }
    }, [addressFromParams, addressFromWallet, dispatch, history, web3])

    return <React.Fragment>
            {props.children}
        </React.Fragment>

}

export default AddressExtractor