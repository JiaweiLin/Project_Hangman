import React, { useEffect, useState } from 'react';
import GameOver from './GameOver.js';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { generateWordList } from '../services/bedrockService.js';
import { 
  setWordList, 
  guessLetter, 
  guessWord, 
  nextRound, 
  resetGame 
} from '../store/gameSlice.js';
import '../styles/Game.css';

const Game = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(null);
  const [guess, setGuess] = useState('');
  
  const {
    gameMode,
    category,
    difficulty,
    timeLimit,
    currentRound,
    currentWord,
    guessedLetters,
    remainingLives,
    score,
    currentPlayer,
    wordList,
    gameStatus,
  } = useSelector((state) => state.game);

  useEffect(() => {
    const initializeGame = async () => {
      const words = await generateWordList(category, difficulty);
      dispatch(setWordList(words));
    };
    initializeGame();
  }, []);

  useEffect(() => {
    if (currentWord && gameMode === 'two') {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 0) {
            clearInterval(countdown);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimer(timeLimit);

      return () => clearInterval(countdown);
    }
  }, [currentWord, currentPlayer]);

  const handleTimeUp = () => {
    dispatch(nextRound());
  };

  const handleLetterClick = (letter) => {
    dispatch(guessLetter(letter));
  };

  const handleWordGuess = (e) => {
    e.preventDefault();
    const lowercaseGuess = guess.toLowerCase();
    dispatch(guessWord(lowercaseGuess));
    setGuess('');
  };

  const renderWord = () => {
    return currentWord.split('').map((letter, index) => (
      <span key={index} className="letter">
        {guessedLetters.includes(letter.toLowerCase()) ? letter : '_'}
      </span>
    ));
  };

  const renderLetterGrid = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return (
      <div className="letter-grid">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter.toLowerCase())}
            disabled={guessedLetters.includes(letter.toLowerCase())}
            className="letter-button"
          >
            {letter}
          </button>
        ))}
      </div>
    );
  };

  if (gameStatus === 'gameOver') {
    return <GameOver />;
  }

  return (
    <div className="game">
      <div className="game-info">
        <div>Round: {currentRound}/6</div>
        <div>Lives: {'❤️'.repeat(remainingLives)}</div>
        {gameMode === 'two' && (
          <>
            <div>Current Player: {currentPlayer}</div>
            <div>Timer: {timer}s</div>
            <div>Score - P1: {score.player1} | P2: {score.player2}</div>
          </>
        )}
      </div>

      <div className="word-display">{renderWord()}</div>

      {renderLetterGrid()}

      <form onSubmit={handleWordGuess} className="guess-form">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Guess the whole word..."
        />
        <button type="submit">Guess</button>
      </form>
    </div>
  );
};

export default Game;