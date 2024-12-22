import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setGameConfig } from '../store/gameSlice.js';
import '../styles/GameSetup.css';

const GameSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [gameMode, setGameMode] = useState('single');
  const [category, setCategory] = useState('animals');
  const [difficulty, setDifficulty] = useState('easy');
  const [timeLimit, setTimeLimit] = useState(20);

  const categories = [
    'animals', 'countries', 'food', 'colors', 'cities',
    'sports', 'music', 'sci-fi', 'fantasy', 'history'
  ];

  const handleStartGame = () => {
    dispatch(setGameConfig({
      gameMode,
      category,
      difficulty,
      timeLimit
    }));
    navigate('/game');
  };

  return (
    <div className="game-setup">
      <h2>Game Setup</h2>
      <div className="setup-form">
        <div className="form-group">
          <label>Game Mode:</label>
          <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
            <option value="single">Single Player</option>
            <option value="two">Two Players</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Difficulty:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="form-group">
          <label>Time Limit (seconds):</label>
          <select value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value))}>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
          </select>
        </div>

        <button onClick={handleStartGame}>Start Game</button>
      </div>
    </div>
  );
};

export default GameSetup;