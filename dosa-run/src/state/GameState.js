/**
 * In-memory only — no localStorage, by request. The best score lives for the
 * lifetime of the page and resets on reload.
 */
const state = {
  bestScore: 0,
  lastScore: 0,
  runs: 0,
};

export const GameState = {
  get bestScore() {
    return state.bestScore;
  },
  get lastScore() {
    return state.lastScore;
  },
  get runs() {
    return state.runs;
  },

  /** Records a finished run. Returns true if it beat the previous best. */
  submitScore(score) {
    state.lastScore = score;
    state.runs += 1;
    if (score > state.bestScore) {
      state.bestScore = score;
      return true;
    }
    return false;
  },
};
