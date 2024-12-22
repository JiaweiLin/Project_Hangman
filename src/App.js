import React from 'react';
import { Route, Routes } from 'react-router';
import GameSetup from './components/GameSetup.js';
import Game from './components/Game.js';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<GameSetup />} />
          <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;