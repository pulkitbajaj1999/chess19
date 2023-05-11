import { createSlice } from '@reduxjs/toolkit'

const INITIAL_STATE = {
  playerId: null,
  roomId: null,
  fen: null,
  playAs: null,
}

const gameSlice = createSlice({
  name: 'game',
  initialState: INITIAL_STATE,
  reducers: {
    initialize: (state, action) => {
      state.playerId = action.payload?.playerID
      state.roomId = action.payload?.roomId
      state.fen = action.payload?.fen
      state.playAs = action.payload?.playAs
    },
    initializePassive: (state, action) => {
      state.roomId = action.payload?.roomId
      state.fen = action.payload?.fen
    },
    updateFen: (state, action) => {
      state.fen = action.payload
    },
  },
})

export default gameSlice.reducer
export const { initialize, initializePassive, updateFen } = gameSlice.actions
