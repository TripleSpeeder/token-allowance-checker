import React from 'react'
import './App.css'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'
import AllowanceLister from './components/AllowanceLister'
import OnboardGate from './components/OnboardGate'
import {Button, Container, Divider, Grid, Header, Icon, List, Menu, Popup, Segment} from 'semantic-ui-react'
import AddressInputContainer from './components/AddressInputContainer'
import OnboardContext from './components/OnboardContext'


const App = () => {

    const HomepageHeading =
        <Segment
            inverted={false}
            textAlign={'center'}
            vertical>
            <Menu fixed='top' inverted size={'huge'}>
                <Container>
                    <Menu.Item
                        header
                        as={Link}
                        to={`/`}
                    >
                        <Icon name={'home'} size={'big'}/> Home
                    </Menu.Item>
                    <Menu.Item
                        as={Link}
                        to={`/address/`}
                    >
                        <Icon name={'search'} size={'big'}/> Check Allowances
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <a href={'https://github.com/TripleSpeeder/allowance-limiter'}
                               title={'github.com/TripleSpeeder/allowance-limiter'}
                            >
                                <Icon name={'github'} size={'big'}/>
                            </a>
                        </Menu.Item>
                    </Menu.Menu>
                </Container>
            </Menu>
            <Container
                text
                style={{
                    marginTop: '4em',
                    marginBottom: '2em'
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
                        powered by <a href={'https://www.dfuse.io/'} rel="noopener noreferrer" target={'_blank'}>dfuse</a>
                    </Header.Subheader>
                </Header>
            </Container>
        </Segment>

    return (
        <Router>
            {HomepageHeading}
            <OnboardContext>
                <Switch>
                <Route path={['/address/:address', '/address']}>
                    <Container>
                        <OnboardGate>
                            <Segment basic padded>
                                <AddressInputContainer/>
                            </Segment>
                            <AllowanceLister/>
                        </OnboardGate>
                    </Container>
                </Route>
                <Route path={'/'}>
                    <Segment basic vertical style={{ paddingTop: '4em' }}>
                        <Grid container stackable verticalAlign='top'>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Header as='h3' style={{ fontSize: '2em' }}>
                                        Do you actually know who can spend your tokens?
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        <em>Token Allowance Checker</em> helps you keep track of which contracts you have approved to spend
                                        your tokens.
                                    </p>
                                    <Header as='h3' style={{ fontSize: '2em' }}>
                                        Control your approvals
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        <em>Token Allowance Checker</em> will show you all approvals for ERC20-compliant tokens, and the option to change
                                        the approved amount - or completely zero it.</p>
                                </Grid.Column>
                                <Grid.Column floated='right' width={7}>
                                    <Header as='h3' style={{ fontSize: '2em' }}>
                                        The unlimited approval problem
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        Many DApps have the habit of requiring you to approve effectively unlimited amount of
                                        tokens. This helps improving the user experience, as you only have to sign off an approval
                                        once and it will be enough for all future transactions.
                                    </p>
                                    <p style={{ fontSize: '1.33em' }}>
                                        However this also means that the DApp (or the person/entity controlling it) can at any time
                                        transfer <em>all of your tokens</em>, without requiring any further approval.
                                    </p>
                                    <p style={{ fontSize: '1.33em' }}>
                                        In addition, there is no concept of expiring approvals. Once approved, the approval will
                                        remain forever. If you do not trust a DApp or its operators anymore, there is usually no
                                        easy way to remove the approval.
                                    </p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    <Segment basic textAlign={'center'}>
                        <Button as={Link} to={`/address/`} primary size={'massive'}>Check Allowances<Icon name='right arrow' /></Button>
                    </Segment>

                </Route>
            </Switch>
            </OnboardContext>
            <Segment basic>
                <Divider></Divider>
                <Container textAlign={'center'}>
                    <List horizontal >
                        <List.Item as={'a'} href={'https://twitter.com/TripleSpeeder'} target={'_blank'}>
                            <Popup content='@triplespeeder' trigger={<Icon size={'big'} name={'twitter'}/>}/>
                        </List.Item>
                        <List.Item as={'a'} href={'https://t.me/triplespeeder'} target={'_blank'}>
                            <Popup content='@triplespeeder' trigger={<Icon size={'big'} name={'telegram'}/>}/>
                        </List.Item>
                        <List.Item as={'a'} href={'mailto:michael@m-bauer.org'}>
                            <Popup content='michael@m-bauer.org' trigger={<Icon size={'big'} name={'mail outline'}/>}/>
                        </List.Item>
                        <List.Item as={'a'} href={'https://github.com/TripleSpeeder'} target={'_blank'}>
                            <Popup content='github.com/TripleSpeeder' trigger={<Icon size={'big'} name={'github'}/>}/>
                        </List.Item>
                        <List.Item as={'a'} href={'https://www.reddit.com/u/TripleSpeeder'} target={'_blank'}>
                            <Popup content='u/TripleSpeeder' trigger={<Icon size={'big'} name={'reddit'}/>}/>
                        </List.Item>
                    </List>
                </Container>
                <Container textAlign={'center'}>
                    <p style={{ fontSize: '1em', float: 'right' }}><Icon name={'copyright outline'}/> Michael Bauer</p>
                </Container>
            </Segment>
        </Router>

    )
}

export default App
