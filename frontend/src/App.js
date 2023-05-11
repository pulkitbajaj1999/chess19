import React, { useState } from 'react'
import Game from './components/Game/Game'

import Navigation from './components/Navigation/Navigation'
import Sidebar from './components/Sidebar/Sidebar'
// import GameLocal from './components/Game/GameLocal'
// import GameSession from './components/Game/GameSession'

function App() {
  return (
    <React.Fragment>
      <Navigation />
      <Game />
      <Sidebar />
    </React.Fragment>
  )
}

export default App
