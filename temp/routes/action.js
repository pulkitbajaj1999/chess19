const express = require('express')
const socket = require('../socket')
const gameSessions = require('../models/gameSessions')
const BoardState = require('../models/BoardState')

const router = express.Router()

router.post('/', (req, res) => {
  const { sessionID, action } = req.body
  const { type, payload } = action
  const session = gameSessions[sessionID]
  if (!session) {
    return res.status(400).json({
      error: 'Session does not exists',
    })
  }
  switch (type) {
    case 'move':
      session.boardState.makeMove(payload.from, payload.to)
      break

    case 'undo':
      session.boardState.reverseMove()
      break

    case 'reset':
      session.boardState = new BoardState()
      break

    default:
      return res.status(400).json({
        error: 'unknown action',
      })
  }
  socket.getIo().emit('event', {
    actionType: type,
    currentState: session.boardState.getCurrentState(),
  })
  return res.status(200).json({
    msg: `${type} action completed`,
  })
})

module.exports = router
