const express = require('express')
const socket = require('../socket')

const router = express.Router()
const gameSessions = require('../models/gameSessions')

router.get('/new', (req, res) => {
  const sessionID = (Object.keys(gameSessions).length + 1).toString()
  console.log('sessionid', sessionID)
  const boardState = {
    prevStates: [],
    currentState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    expandedState: [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ],
    whiteToMove: true,
    totalMoves: 0,
    whiteFaceView: true,
  }
  gameSessions[sessionID] = { boardState }
  console.log('gameSessions:', gameSessions)

  return res.status(200).json({
    sessionID,
    boardState,
  })
})

router.get('/existing', (req, res) => {
  const { sessionID } = req.query
  const session = gameSessions[sessionID]
  if (!session) {
    return res.status(404).json({
      error: 'session does not exist',
    })
  } else {
    console.log('gameSesssions:', gameSessions)
    return res.status(200).json({
      sessionID,
      boardState: session.boardState,
    })
  }
})

router.post('/update', (req, res) => {
  const { clientID, sessionID, boardState: newBoardState } = req.body
  const currentSession = gameSessions[sessionID]
  if (!currentSession) {
    return res.status(404).json({ error: 'session does not exist' })
  } else {
    console.log('gameSesssions:', gameSessions)
    if (currentSession.boardState.currentState !== newBoardState.currentState) {
      currentSession.boardState = newBoardState
      socket.getIo().emit('event', { clientID, action: 'update' })
      return res.status(200).json({ msg: 'updated' })
    } else {
      return res
        .status(400)
        .json({ msg: 'not-updated as both received and newstate are same' })
    }
  }
})

module.exports = router
