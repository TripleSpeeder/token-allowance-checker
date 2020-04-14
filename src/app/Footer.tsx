import {
    Container,
    Divider,
    Header,
    Icon,
    Image,
    List,
    Popup,
    Segment,
} from 'semantic-ui-react'
import GitcoinIcon from '../icons/gitcoinIcon.png'
import pkg from '../../package.json'
import React from 'react'

const Footer = () => {
    return (
        <Container textAlign='center'>
            <Divider />
            <Segment basic>
                <List horizontal size={'small'} verticalAlign={'top'}>
                    <List.Item
                        as='a'
                        href='https://twitter.com/TripleSpeeder'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Popup
                            content='@triplespeeder'
                            trigger={<Icon size='big' name='twitter' />}
                        />
                    </List.Item>
                    <List.Item
                        as='a'
                        href='https://t.me/triplespeeder'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Popup
                            content='@triplespeeder'
                            trigger={<Icon size='big' name='telegram' />}
                        />
                    </List.Item>
                    <List.Item as='a' href='mailto:michael@m-bauer.org'>
                        <Popup
                            content='michael@m-bauer.org'
                            trigger={<Icon size='big' name='mail outline' />}
                        />
                    </List.Item>
                    <List.Item
                        as='a'
                        href='https://github.com/TripleSpeeder/token-allowance-checker'
                        title='github.com/TripleSpeeder/token-allowance-checker'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Popup
                            content='github.com/TripleSpeeder/token-allowance-checker'
                            trigger={<Icon size='big' name='github' />}
                        />
                    </List.Item>
                    <List.Item
                        as='a'
                        href='https://www.reddit.com/u/TripleSpeeder'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Popup
                            content='u/TripleSpeeder'
                            trigger={<Icon size='big' name='reddit' />}
                        />
                    </List.Item>
                    <List.Item
                        as='a'
                        target='_blank'
                        rel='noopener noreferrer'
                        href={
                            'https://gitcoin.co/grants/480/token-allowance-checker?tab=description'
                        }
                    >
                        <Popup
                            content='Gitcoin grant page'
                            trigger={<Image avatar src={GitcoinIcon} />}
                        />
                    </List.Item>
                    <List.Item>
                        <Popup
                            content='Donate to tac.dappstar.eth'
                            trigger={<Icon size='big' name={'ethereum'} />}
                        />
                    </List.Item>
                </List>
                <Header size={'small'}>
                    powered by{' '}
                    <a
                        href='https://www.dfuse.io/'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        dfuse
                    </a>{' '}
                    technology
                </Header>
                <Header size={'tiny'}>
                    (c) Michael Bauer
                    <Header.Subheader>v{pkg.version}</Header.Subheader>
                </Header>
            </Segment>
        </Container>
    )
}

export default Footer
