import React from 'react'
import PropTypes from 'prop-types'
import {Icon, Popup} from 'semantic-ui-react'


const AddressDisplay = (props) => {
    const {address, ensName} = props
    const setClipboard = () => {
        navigator.clipboard.writeText(address).then(function() {
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

AddressDisplay.propTypes = {
    address: PropTypes.string.isRequired,
    ensName: PropTypes.string
}


export default AddressDisplay
