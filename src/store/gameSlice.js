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
            gameSlice.caseReducers.resetGame(state);
          }
      } else {
          const uniqueChars = [...new Set(state.currentWord.toLowerCase())];
          const isComplete = uniqueChars.every(char => 
          state.guessedLetters.some(l => l.toLowerCase() === char)
          );
          if (isComplete) {
            const currentPlayerKey = `player${state.currentPlayer}`;
          state.score[currentPlayerKey] += state.remainingLives * 10;
          state.gameStatus = 'roundEnd';
          gameSlice.caseReducers.nextRound(state);
        }
      }
    },
    guessWord: (state, action) => {
      if (action.payload.toLowerCase() !== state.currentWord.toLowerCase()) {
        state.remainingLives--;
        if(state.remainingLives == 0) {
          state.gameStatus = 'gameOver';
          gameSlice.caseReducers.resetGame(state);
        }
      }
      else if (action.payload.toLowerCase() == state.currentWord.toLowerCase()){
        const currentPlayerKey = `player${state.currentPlayer}`;
        state.score[currentPlayerKey] += state.remainingLives * 10;
        state.gameStatus = 'roundEnd';
        gameSlice.caseReducers.nextRound(state);
      }
    },
    nextRound: (state) => {
      state.currentRound++;
      state.currentWord = state.wordList[state.currentRound - 1];
      state.guessedLetters = [];
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