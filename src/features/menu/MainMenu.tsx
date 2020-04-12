import React, { useState } from 'react'
import { Container, Icon, Image, Menu } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom'
import NetworkSelector from '../../components/NetworkSelector'
import WalletSelector from '../onboard/walletSelector'
import { RootState } from '../../app/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import WalletConfigModal from '../onboard/WalletConfigModal'
import { selectWallet } from '../onboard/onboardSlice'

const MainMenu: React.FC = () => {
    const [showWalletConfig, setShowWalletConfig] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const { wallet } = useSelector((state: RootState) => state.onboard)
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
    const { networkId } = useSelector((state: RootState) => state.onboard)

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

    const walletSelectorItem = wallet ? (
        <Menu.Item>
            <WalletSelector
                handleClick={handleWalletConfig}
                walletName={wallet?.name}
                walletAccount={walletAddress}
            />
        </Menu.Item>
    ) : null

    return (
        <Menu fixed='top' inverted size='huge'>
            <Container>
                <Menu.Item
                    header
                    as={Link}
                    to='/'
                    title={'Home'}
                    style={{ padding: '0px' }}
                >
                    <Image src={'/logo192.png'} width={60} height={60} />
                </Menu.Item>
                <Menu.Item as={Link} to='/address/' title={'Check Allowances'}>
                    <Icon name='search' size={'large'} /> Check Allowances
                </Menu.Item>
                <Menu.Menu position='right'>
                    {walletSelectorItem}
                    <Menu.Item>
                        <NetworkSelector />
                    </Menu.Item>
                    <Menu.Item>
                        <a
                            href='https://github.com/TripleSpeeder/token-allowance-checker'
                            title='github.com/TripleSpeeder/token-allowance-checker'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Icon name='github' size='big' />
                        </a>
                    </Menu.Item>
                </Menu.Menu>
            </Container>
            {showWalletConfig && (
                <WalletConfigModal
                    handleClose={handleCloseWalletConfig}
                    handleChangeWallet={handleSelectWallet}
                    handleChangeAddress={handleSelectWallet}
                    mobile={mobile}
                    networkId={networkId}
                    wallet={wallet}
                    walletAddress={walletAddress}
                />
            )}
        </Menu>
    )
}

export default MainMenu
