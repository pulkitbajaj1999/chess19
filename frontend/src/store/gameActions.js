import io from 'socket.io-client'

import { initialize, updateFen } from './game'
import { flipBoard, setGameMode } from './common'

import { COLOR, MODE, START_FEN } from '../constants'

const BASE_URL = process.env.REACT_APP_BASE_URL || ''
const socket = io(BASE_URL)

export const createGame = () => async (dispatch) => {
  socket.emit('client:game:new', { playAs: COLOR.WHITE })
  socket.once('server:game:initialize', (data) => {
    console.log('-----------server-game-initialize---')
    console.log('data:', data)
    dispatch(
      initialize({
        playerId: socket.id,
        roomId: data?.roomId,
        playAs: data?.playAs,
        fen: data?.fen,
      })
    )
    // dispatch(setChess(fen))
    dispatch(setGameMode(MODE.SESSION_ACTIVE))
  })
  socket.on('server:game:update', (data) => {
    dispatch(updateFen(data?.fen))
  })
}

export const joinGame = (roomId) => async (dispatch) => {
  socket.emit('client:game:join', { roomId })
  socket.once('server:game:initialize', (data) => {
    console.log('-----------server-game-initialize---')
    console.log('data:', data)
    dispatch(
      initialize({
        playerId: socket.id,
        roomId: roomId,
        playAs: data?.playAs,
        fen: data?.fen,
      })
    )
    // dispatch(setChess(fen))
    dispatch(setGameMode(MODE.SESSION_ACTIVE))
    dispatch(flipBoard())
  })
  socket.on('server:game:update', (data) => {
    dispatch(updateFen(data?.fen))
  })
}

export const updateGame = (updatedFen) => async (dispatch, getState) => {
  const gameState = getState().game
  socket.emit('client:game:update', {
    roomId: gameState.roomId,
    fen: updatedFen,
  })
}
