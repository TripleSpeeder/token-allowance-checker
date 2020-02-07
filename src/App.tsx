import React from 'react';
import './App.css';
import AllowanceLister from "./components/AllowanceLister";

const App = () => {
  return (
    <div className="App">
      <AllowanceLister address={'0xB349EE9A271921D6606B0FA7748a15B1b93790b9'}/>
    </div>
  );
}

export default App;
