import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameMode: 'single',
  category: 'animals',
  difficulty: 'easy',
  timeLimit: 20,
  currentRound: 1,
  currentWord: '',
  guessedLetters: [],
  remainingLives: 5,
  score: {
    player1: 0,
    player2: 0
  },
  currentPlayer: 1,
  wordList: [],
  gameStatus: 'setup' // setup, playing, roundEnd, gameEnd
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
      if (!state.currentWord.includes(letter)) {
        state.remainingLives--;
      }
    },
    guessWord: (state, action) => {
      if (action.payload !== state.currentWord) {
        state.remainingLives--;
      } else {
        const currentPlayerKey = `player${state.currentPlayer}`;
        state.score[currentPlayerKey] += state.remainingLives * 10;
      }
    },
    nextRound: (state) => {
      state.currentRound++;
      state.currentWord = state.wordList[state.currentRound - 1];
      state.guessedLetters = new Set();
      state.remainingLives = 5;
      if (state.gameMode === 'two') {
        state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
      }
    },
    resetGame: () => initialState
  }
});

export const {
  setGameConfig,
  setWordList,
  guessLetter,
  guessWord,
  nextRound,
  resetGame
} = gameSlice.actions;

export default gameSlice.reducer;