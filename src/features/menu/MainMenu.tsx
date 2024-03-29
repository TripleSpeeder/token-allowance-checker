import React from 'react'
import { Container, Icon, Image, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NetworkSelector from '../../components/NetworkSelector'
import WalletSelectorContainer from '../onboard/WalletSelectorContainer'

const MainMenu: React.FC = () => {
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
        <Menu.Item as={Link} to='/' title={'Check Allowances'}>
          <Icon name='search' size={'large'} /> Check Allowances
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <WalletSelectorContainer />
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
