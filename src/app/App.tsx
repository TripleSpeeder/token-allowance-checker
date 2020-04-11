import React, { useState } from 'react'
import './App.css'
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom'
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    List,
    Popup,
    Responsive,
    Segment,
    Image,
} from 'semantic-ui-react'
import AllowanceLister from '../features/allowancesList/AllowanceLister'
import OnboardGate from '../features/onboard/OnboardGate'
import AddressInputContainer from '../features/addressInput/AddressInputContainer'
import pkg from '../../package.json'
import AddressExtractor from '../components/AddressExtractor'
import { ResponsiveOnUpdateData } from 'semantic-ui-react/dist/commonjs/addons/Responsive/Responsive'
import { useDispatch, useSelector } from 'react-redux'
import { setMobile } from 'features/responsiveLayout/responsiveSlice'
import { RootState } from './rootReducer'
import GitcoinIcon from '../icons/gitcoinIcon.png'
import MainMenu from '../features/menu/MainMenu'

const App: React.FC = () => {
    const [prevMobile, setPrevMobile] = useState<boolean | undefined>(undefined)
    const { mobile } = useSelector((state: RootState) => state.respsonsive)
    const dispatch = useDispatch()

    const onResponsiveUpdate = (
        event: React.SyntheticEvent<HTMLElement>,
        data: ResponsiveOnUpdateData
    ) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const isMobile = data.width <= Responsive.onlyMobile.maxWidth
        if (isMobile !== prevMobile) {
            dispatch(setMobile(isMobile))
            setPrevMobile(isMobile)
        }
    }

    const DesktopHeading = (
        <Segment textAlign='center' vertical>
            <MainMenu />
            <Container
                text
                style={{
                    marginTop: '4em',
                    marginBottom: '2em',
                }}
            >
                <Header
                    as='h1'
                    inverted={false}
                    style={{
                        fontSize: '3em',
                        marginTop: '0.5em',
                    }}
                >
                    Token Allowance Checker
                    <Header.Subheader>
                        Control your token approvals
                    </Header.Subheader>
                </Header>
            </Container>
        </Segment>
    )

    const MobileHeading = (
        <>
            <Container
                text
                style={{
                    marginBottom: '1em',
                }}
            >
                <Header
                    as='h1'
                    inverted={false}
                    style={{
                        marginTop: '0.2em',
                    }}
                >
                    <Link to={'/'}>Token Allowance Checker</Link>
                    <Header.Subheader>
                        <p>Keep track of your token approvals</p>
                    </Header.Subheader>
                </Header>
            </Container>
        </>
    )

    const startButton = (
        <Segment basic textAlign='center'>
            <Button primary as={Link} to='/address/' size='massive'>
                Check Allowances
                <Icon name='arrow right' />
            </Button>
        </Segment>
    )

    const footer = (
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

    const size = mobile ? 'small' : 'huge'

    return (
        <Responsive
            as={Router}
            fireOnMount={true}
            onUpdate={onResponsiveUpdate}
        >
            <Responsive {...Responsive.onlyMobile}>{MobileHeading}</Responsive>
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                {DesktopHeading}
            </Responsive>
            <Switch>
                <Route path={['/address/:address', '/address']}>
                    <Container>
                        <OnboardGate>
                            <AddressExtractor>
                                <AddressInputContainer />
                                <AllowanceLister />
                            </AddressExtractor>
                        </OnboardGate>
                    </Container>
                </Route>
                <Route path='/'>
                    {startButton}
                    <Segment basic vertical size={size}>
                        <Grid container stackable verticalAlign='top'>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Header>Control your approvals</Header>
                                    <p>
                                        <em>Token Allowance Checker</em> shows
                                        all approvals for your ERC20-compliant
                                        tokens, and the option to change the
                                        approved amount - or completely zero it.
                                    </p>
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Header>
                                        The unlimited approval problem
                                    </Header>
                                    <p>
                                        Many DApps have the habit of requiring
                                        you to approve effectively unlimited
                                        amount of tokens. This helps improving
                                        the user experience, as you only have to
                                        sign off an approval once and it will be
                                        enough for all future transactions.
                                    </p>
                                    <p>
                                        However this also means that the DApp
                                        (or the person/entity controlling it)
                                        can at any time transfer{' '}
                                        <em>all of your tokens</em>, without
                                        requiring any further approval.
                                    </p>
                                    <p>
                                        In addition, there is no concept of
                                        expiring approvals. Once approved, the
                                        approval will remain forever. If you do
                                        not trust a DApp or its operators
                                        anymore, there is usually no easy way to
                                        remove the approval.
                                    </p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Route>
            </Switch>
            {footer}
        </Responsive>
    )
}

export default App
