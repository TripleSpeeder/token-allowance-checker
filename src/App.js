import React from 'react'
import './App.css'
import AllowanceLister from './components/AllowanceLister'
import OnboardGate from './components/OnboardGate'
import {Container, Grid, Header, Icon, List, Popup, Segment} from 'semantic-ui-react'


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
        <React.Fragment>
            {HomepageHeading}
            <Container>
                <OnboardGate>
                    <AllowanceLister/>
                </OnboardGate>
            </Container>

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
        </React.Fragment>

    )
}

export default App
