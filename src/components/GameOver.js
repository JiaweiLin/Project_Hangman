import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetGame } from '../store/gameSlice.js';
import '../styles/Game.css';

const GameOver = () => {
  const dispatch = useDispatch();
  const { currentWord, score } = useSelector((state) => state.game);

  return (
    <div className="game-over">
      <h2>Game Over!</h2>
      <p>The word was: {currentWord}</p>
      <p>Final Score:</p>
      <p>Player 1: {score.player1}</p>
      <p>Player 2: {score.player2}</p>
      <button onClick={() => dispatch(resetGame())}>Play Again</button>
    </div>
  );
};

export default GameOver;