import React from 'react'
import './App.css'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'
import AllowanceLister from './components/AllowanceLister'
import OnboardGate from './components/OnboardGate'
import {Button, Container, Grid, Header, Icon, List, Popup, Segment} from 'semantic-ui-react'
import AddressInputContainer from './components/AddressInputContainer'


const App = () => {

    const HomepageHeading =
        <Segment
            inverted={false}
            textAlign={'center'}
            vertical>
            <Container
                text
                style={{marginBottom: '2em'}}
            >
                <Header
                    as='h1'
                    content='Token Allowance checker'
                    inverted={false}
                    subheader='Keep allowances in check!'
                    style={{
                        fontSize: '2em',
                        fontWeight: 'normal',
                        marginTop: '0.5em',
                    }}
                />
            </Container>
        </Segment>

    return (
        <Router>
            {HomepageHeading}
            <Switch>
                <Route path={['/address/:address', '/address']}>
                    <Container>
                        <OnboardGate>
                            <AddressInputContainer/>
                            <AllowanceLister/>
                        </OnboardGate>
                    </Container>
                </Route>
                <Route path={'/'}>
                    <Container>
                        <Segment basic style={{ paddingTop: '4em' }} vertical>
                        <Grid container stackable verticalAlign='top'>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Header as='h3' style={{ fontSize: '2em' }}>
                                        Do you actually know who can spend your tokens?
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        This site helps you keep track of which contracts you have approved to spend
                                        your tokens.
                                    </p>
                                    <Header as='h3' style={{ fontSize: '2em' }}>
                                        Control your approvals
                                    </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        This site will show you all approvals for ERC20-compliant tokens, and the option to change
                                        the approved amount, or completely remove it.</p>
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
                        <Button as={Link} to={`/address/`} positive size={'big'}>test me</Button>
                    </Container>
                </Route>
            </Switch>

            <Segment basic>
                <Container textAlign={'center'}>
                    <List horizontal size={'huge'}>
                        <List.Item as={'a'} href={'https://github.com/TripleSpeeder/allowance-limiter'} target={'_blank'}>
                            <Popup content='github.com/TripleSpeeder/allowance-limiter' trigger={<Icon size={'big'} name={'github'}/>}/>
                        </List.Item>
                        <List.Item as={'a'} href={'mailto:michael@m-bauer.org'}>
                            <Popup content='michael@m-bauer.org' trigger={<Icon size={'big'} name={'mail outline'}/>}/>
                        </List.Item>
                    </List>
                </Container>
            </Segment>
        </Router>

    )
}

export default App
