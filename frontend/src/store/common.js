import { createSlice } from '@reduxjs/toolkit'
import { Chess } from 'chess.js'
import { START_FEN, MODE } from '../constants'

const INITIAL_STATE = {
  chess: new Chess(START_FEN),
  flip: false,
  mode: MODE.LOCAL,
}

const commonSlice = createSlice({
  name: 'common',
  initialState: INITIAL_STATE,
  reducers: {
    setChess: (state, action) => {
      state.chess = new Chess(action.payload)
    },
    setGameMode: (state, action) => {
      state.mode = action.payload
    },
    flipBoard: (state) => {
      state.flip = !state.flip
    },
  },
})

export default commonSlice.reducer
export const { setChess, setGameMode, flipBoard } = commonSlice.actions
