import React from 'react'
import { Container, Icon, Image, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NetworkSelector from '../../components/NetworkSelector'
import WalletSelector from '../onboard/walletSelector'
import { RootState } from '../../app/rootReducer'
import { useSelector } from 'react-redux'

const MainMenu: React.FC = () => {
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

    const handleWalletClick = () => {
        console.log('Clicked wallet button')
    }

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
                    <Menu.Item>
                        <WalletSelector
                            handleClick={handleWalletClick}
                            walletName={wallet?.name}
                            walletAccount={walletAddress}
                        />
                    </Menu.Item>
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
        </Menu>
    )
}

export default MainMenu
