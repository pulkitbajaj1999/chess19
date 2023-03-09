const express = require('express')
const socket = require('../socket')

const router = express.Router()
const gameSessions = require('../models/gameSessions')
const BoardState = require('../models/BoardState')

router.get('/new', (req, res) => {
  const sessionID = (Object.keys(gameSessions).length + 1).toString()
  const boardState = new BoardState()
  gameSessions[sessionID] = { boardState }
  return res.status(200).json({
    sessionID,
    currentState: boardState.getCurrentState(),
  })
})

router.get('/existing', (req, res) => {
  const { sessionID } = req.query
  const session = gameSessions[sessionID]
  if (!session) {
    return res.status(400).json({
      error: 'session does not exist',
    })
  } else {
    return res.status(200).json({
      currentState: session.boardState.getCurrentState(),
    })
  }
})

module.exports = router
