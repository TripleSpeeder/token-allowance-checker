import React from 'react'
import {Icon, Popup} from 'semantic-ui-react'
import { AddressId } from 'features/addressInput/AddressSlice'
import {useSelector} from 'react-redux'
import {RootState} from '../app/rootReducer'

interface AddressDisplayProps {
    addressId: AddressId
}

const AddressDisplay = ({addressId}:AddressDisplayProps) => {
    const addressEntry = useSelector((state:RootState) => state.addresses.addressesById[addressId])
    let address:string
    let ensName:string|undefined
    if (!addressEntry) {
        // No addressEntry in store. Should not happen :-(
        console.log(`AddressDisplay: Trying to get non-existing address ${addressId}`)
        address=addressId
    } else {
        address = addressEntry.address
        ensName = addressEntry.ensName
    }

    const setClipboard = (content: string) => {
        navigator.clipboard.writeText(content).then(function() {
            /* clipboard successfully set */
        }, function() {
            console.log(`failed to set clipboard`)
        })
    }

    if (ensName) {
        return <>
            <div>{ensName}</div>
            <div><small>{address}&nbsp;
                <Popup mouseEnterDelay={500} content={'Copy to clipboard'} trigger={<Icon circular name={'copy outline'} size={'small'} onClick={()=>{setClipboard(address)}}/>}/>
                <Popup mouseEnterDelay={500} content={'View on Etherscan'} trigger={<Icon circular name={'external square'} size={'small'} onClick={()=>{window.open(`https://etherscan.io/address/${address}`, '_blank')}}/>}/>
            </small></div>
        </>
    } else {
        return (
            <div>
                {address}&nbsp;
                <Popup mouseEnterDelay={500} content={'Copy to clipboard'} trigger={<Icon circular name={'copy outline'} size={'small'} onClick={()=>{setClipboard(address)}}/>}/>
                <Popup mouseEnterDelay={500} content={'View on Etherscan'} trigger={<Icon circular name={'external square'} size={'small'} onClick={()=>{window.open(`https://etherscan.io/address/${address}`, '_blank')}}/>}/>
            </div>
        )
    }
}

export default AddressDisplay
