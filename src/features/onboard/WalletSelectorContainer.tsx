import React, { useState } from 'react'
import WalletConfigModal from './WalletConfigModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/rootReducer'
import { selectWallet } from './onboardSlice'
import WalletSelector from './walletSelector'
import { useNavigate } from 'react-router'
import { useAppSelector } from '../../app/hooks'

const WalletSelectorContainer = () => {
    const [showWalletConfig, setShowWalletConfig] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { wallet, onboardAPI, networkId } = useAppSelector(
        (state: RootState) => state.onboard
    )
    const walletAddress = useAppSelector((state: RootState) => {
        if (state.addresses.walletAddressId) {
            return state.addresses.addressesById[
                state.addresses.walletAddressId
            ]
        } else {
            return undefined
        }
    })
    const { mobile } = useAppSelector((state: RootState) => state.respsonsive)
    const handleWalletConfig = () => {
        setShowWalletConfig(true)
    }

    const handleCloseWalletConfig = () => {
        setShowWalletConfig(false)
    }

    const handleSelectWallet = () => {
        setShowWalletConfig(false)
        dispatch(selectWallet(navigate))
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
