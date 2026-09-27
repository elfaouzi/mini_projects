import React from 'react';
import Game from './Game';

const App: React.FC = () => (
  <div className="app-container">
    <div className="game-info">
      <span>Level: 1</span>
      {/* Health bar, score, etc. will go here */}
    </div>
    <Game />
  </div>
);

export default App;
