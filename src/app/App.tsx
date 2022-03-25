import React from 'react'
import { HashRouter as Router, Link, Route, Routes } from 'react-router-dom'
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Segment
} from 'semantic-ui-react'
import AllowanceLister from '../features/allowancesList/AllowanceLister'
import OnboardGate from '../features/onboard/OnboardGate'
import AddressInputContainer from '../features/addressInput/AddressInputContainer'
import AddressExtractor from '../components/AddressExtractor'
import { RootState } from './rootReducer'
import ResponsiveApp from './ResponsiveApp'
import Footer from './Footer'
import { useAppSelector } from './hooks'

const App = () => {
  const { mobile } = useAppSelector((state: RootState) => state.respsonsive)

  const size = mobile ? 'small' : 'huge'

  const startButton = (
    <Segment basic textAlign='center'>
      <Button primary as={Link} to='/address/' size='massive'>
        Check Allowances
        <Icon name='arrow right' />
      </Button>
    </Segment>
  )

  const addrElem = (
    <Container>
      <OnboardGate>
        <AddressExtractor>
          <AddressInputContainer />
          <AllowanceLister />
        </AddressExtractor>
      </OnboardGate>
    </Container>
  )

  const rootElem = (
    <>
      {startButton}
      <Segment basic vertical size={size}>
        <Grid container stackable verticalAlign='top'>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header>Control your approvals</Header>
              <p>
                <em>Token Allowance Checker</em> shows all approvals for your
                ERC20-compliant tokens, and the option to change the approved
                amount - or completely zero it.
              </p>
            </Grid.Column>
            <Grid.Column width={8}>
              <Header>The unlimited approval problem</Header>
              <p>
                Many DApps have the habit of requiring you to approve
                effectively unlimited amount of tokens. This helps improving the
                user experience, as you only have to sign off an approval once
                and it will be enough for all future transactions.
              </p>
              <p>
                However this also means that the DApp (or the person/entity
                controlling it) can at any time transfer{' '}
                <em>all of your tokens</em>, without requiring any further
                approval.
              </p>
              <p>
                In addition, there is no concept of expiring approvals. Once
                approved, the approval will remain forever. If you do not trust
                a DApp or its operators anymore, there is usually no easy way to
                remove the approval.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </>
  )

  return (
    <Router>
      <ResponsiveApp>
        <Routes>
          <Route path='/address/:address' element={addrElem} />
          <Route path='/address' element={addrElem} />
          <Route path='/' element={rootElem} />
        </Routes>
        <Footer />
      </ResponsiveApp>
    </Router>
  )
}

export default App
