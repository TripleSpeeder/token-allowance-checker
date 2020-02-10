import React from 'react'
import './App.css'
import AllowanceLister from './components/AllowanceLister'
import OnboardGate from './components/OnboardGate'


const App = () => {
  return (
    <div className="App">
        <OnboardGate>
            <AllowanceLister/>
        </OnboardGate>
    </div>
  )
}

export default App
