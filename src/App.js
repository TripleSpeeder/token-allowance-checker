import React from 'react'
import './App.css'
import AllowanceLister from './components/AllowanceLister'
import OnboardGate from './components/OnboardGate'
import {Container, Header, Segment} from 'semantic-ui-react'


const App = () => {

    const HomepageHeading =
        <Segment inverted textAlign={'center'} vertical>
            <Container
                text
                style={{marginBottom: '2em'}}
            >
                <Header
                    as='h1'
                    content='Token Allowance checker'
                    inverted
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
        </React.Fragment>
    )
    /*
  return (
    <div className="App">
        <OnboardGate>
            <AllowanceLister/>
        </OnboardGate>
    </div>
  )*/
}

export default App
