const express = require('express')
const router = express.Router()

const Board = require('../models/board')
const socket = require('../socket')
const boardUtils = require('../utils/board')

// creating a in-memory storage session
const gameSessions = { 1: new Board() }

router.get('/get-existing-session', (req, res, next) => {
  // hardcoding the board id for now
  console.log('get-existing-sessions', 'body:', req.body, 'query:', req.query)
  const sessionId = req.query.sessionId
  if (!gameSessions[sessionId]) {
    return res.status(404).json({
      status: 'error',
      msg: 'No session present with given id',
    })
  } else {
    return res.status(200).json({
      status: 'ok',
      boardState: gameSessions[sessionId],
    })
  }
})

router.get('/get-new-session', (req, res, next) => {
  // hardcoding new session
  const sessionId = '1'
  const currentBoard = new Board()
  gameSessions[sessionId] = currentBoard
  return res.json({
    id: sessionId,
    board: currentBoard,
  })
})

router.post('/update-session', (req, res, next) => {
  console.log('update-session-action', 'body:', req.body)
  const { sessionId, boardState } = req.body
  if (!boardState) return res.status(400).json({ msg: 'failed' })
  else {
    gameSessions[sessionId] = boardState
    return res.status(200).json(gameSessions)
  }
})

module.exports = router
