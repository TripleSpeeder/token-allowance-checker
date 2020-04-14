import React, { useState } from 'react'
import WalletConfigModal from './WalletConfigModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/rootReducer'
import { selectWallet } from './onboardSlice'
import { useHistory } from 'react-router-dom'
import WalletSelector from './walletSelector'

const WalletSelectorContainer = () => {
    const [showWalletConfig, setShowWalletConfig] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const { wallet, onboardAPI, networkId } = useSelector(
        (state: RootState) => state.onboard
    )
    const walletAddress = useSelector((state: RootState) => {
        if (state.addresses.walletAddressId) {
            return state.addresses.addressesById[
                state.addresses.walletAddressId
            ]
        } else {
            return undefined
        }
    })
    const { mobile } = useSelector((state: RootState) => state.respsonsive)
    const handleWalletConfig = () => {
        setShowWalletConfig(true)
    }

    const handleCloseWalletConfig = () => {
        setShowWalletConfig(false)
    }

    const handleSelectWallet = () => {
        setShowWalletConfig(false)
        dispatch(selectWallet(history))
    }

    const handleSelectAddress = () => {
        setShowWalletConfig(false)
        onboardAPI?.accountSelect()
    }

    return (
        <>
            <WalletSelector
                handleClick={handleWalletConfig}
                walletName={wallet?.name}
                walletAccount={walletAddress}
            />
            {showWalletConfig && (
                <WalletConfigModal
                    handleClose={handleCloseWalletConfig}
                    handleChangeWallet={handleSelectWallet}
                    handleChangeAddress={handleSelectAddress}
                    mobile={mobile}
                    networkId={networkId}
                    wallet={wallet}
                    walletAddress={walletAddress}
                />
            )}
        </>
    )
}

export default WalletSelectorContainer
