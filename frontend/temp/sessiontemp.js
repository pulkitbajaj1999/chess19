import { createSlice } from '@reduxjs/toolkit'
// import { getExpandedState, getFenFromExpandedState } from '../utils/board'

const initialState = {
  current: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  history: [],
  isWhite: true,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    initialize: (state, action) => {
      state.current = action.payload.current
      state.history = []
      state.isWhite = action.payload.isWhite
    },
    makeMove: (state, action) => {
      state.history.push(state.current)
      state.current = action.payload

      // const { row: r1, col: c1 } = action.payload.from
      // const { row: r2, col: c2 } = action.payload.to
      // state.expandedState[r2][c2] = state.expandedState[r1][c1]
      // state.expandedState[r1][c1] = '.'
      // state.prevStates.push(state.currentState)
      // state.currentState = getFenFromExpandedState(state.expandedState)
      // state.totalMoves++
      // state.whiteToMove = !state.whiteToMove
    },
    reverseMove: (state) => {
      if (state.history.length > 0) {
        state.current = state.history.pop()
      }
      // if (state.prevStates.length > 0) {
      //   state.currentState = state.prevStates.pop()
      //   state.expandedState = getExpandedState(state.currentState)
      //   state.whiteToMove = !state.whiteToMove
      //   state.totalMoves--
      // }
    },
    // flipView: (state) => {
    //   state.whiteFaceView = !state.whiteFaceView
    // },
    reset: (state) => {
      return initialState
    },
  },
})

export default sessionSlice.reducer
export const sessionActions = sessionSlice.actions
