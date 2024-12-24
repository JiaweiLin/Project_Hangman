import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameMode: 'single',
  category: 'animals',
  difficulty: 'easy',
  timeLimit: 20,
  currentRound: 1,
  currentWord: '',
  guessedLetters: [],
  remainingLives: 6,
  score: {
    player1: 0,
    player2: 0
  },
  currentPlayer: 1,
  wordList: [],
  gameStatus: 'setup' // setup, playing, roundEnd, gameEnd, gameOver
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameConfig: (state, action) => {
      const { gameMode, category, difficulty, timeLimit } = action.payload;
      state.gameMode = gameMode;
      state.category = category;
      state.difficulty = difficulty;
      state.timeLimit = timeLimit;
    },
    setWordList: (state, action) => {
      state.wordList = action.payload;
      state.currentWord = state.wordList[0];
    },
    guessLetter: (state, action) => {
      const letter = action.payload;
      if (!state.guessedLetters.includes(letter)) {
        state.guessedLetters.push(letter);
      }
      if (!state.currentWord.toLowerCase().includes(letter.toLowerCase())){
          state.remainingLives--;
          if(state.remainingLives == 0) {
            state.gameStatus = 'gameOver';
          }
      } else {
          const uniqueChars = [...new Set(state.currentWord.toLowerCase())];
          const isComplete = uniqueChars.every(char => 
          state.guessedLetters.some(l => l.toLowerCase() === char)
          );
          if (isComplete) {
            const currentPlayerKey = `player${state.currentPlayer}`;
            state.score[currentPlayerKey] += state.remainingLives * 10;
            if (state.currentRound >= 6) {
              state.gameStatus = 'gameOver';
            } else {
              state.gameStatus = 'roundEnd';
              gameSlice.caseReducers.nextRound(state);
            }
          }
      }
    },
    guessWord: (state, action) => {
      if (action.payload.toLowerCase() !== state.currentWord.toLowerCase()) {
        state.remainingLives--;
        if(state.remainingLives == 0) {
          state.gameStatus = 'gameOver';
        }
      }
      else if (action.payload.toLowerCase() == state.currentWord.toLowerCase()){
        const currentPlayerKey = `player${state.currentPlayer}`;
        state.score[currentPlayerKey] += state.remainingLives * 10;
        if (state.currentRound >= 6) {
          state.gameStatus = 'gameOver';
        } else {
          state.gameStatus = 'roundEnd';
          gameSlice.caseReducers.nextRound(state);
        }
      }
    },
    nextRound: (state) => {
      if (state.currentRound >= 6) {
        state.gameStatus = 'gameOver';
        return;
      }
      state.currentRound++;
      state.currentWord = state.wordList[state.currentRound - 1];
      state.guessedLetters = [];
      state.remainingLives = 6;
      if (state.gameMode === 'two') {
        state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
      }
    },
    resetGame: (state) => {
      const savedWordList = [...state.wordList];
      const savedGameMode = state.gameMode;
      Object.assign(state, initialState);
      state.wordList = savedWordList;
      state.currentWord = savedWordList[0];
      state.gameMode = savedGameMode;
      state.gameStatus = 'playing';
    },
    setGameOver: (state) => {
      state.gameStatus = 'gameOver';
    }
  }
});

export const {
  setGameConfig,
  setWordList,
  guessLetter,
  guessWord,
  nextRound,
  resetGame,
  setGameOver
} = gameSlice.actions;

export default gameSlice.reducer;