const express = require('express')
const socket = require('../socket')

const router = express.Router()

const Session = require('../models/session')

const gameSessions = require('../models/gameSessions')
const BoardState = require('../models/BoardState')

router.post('/new', (req, res, next) => {
  const { playAs } = req.body
  if (!['WHITE', 'BLACK'].includes(playAs))
    return res.status(400).json({
      status: 'error',
      msg: 'Invalid color to play as',
    })
  const session = new Session({
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    state: 'INITIALIZED',
  })
  session
    .save()
    .then((session) => {
      return res.status(200).json({
        status: 'ok',
        msg: 'Session created',
        session,
        playAs: playAs,
      })
    })
    .catch((err) => {
      return res.status(400).json({
        status: 'error',
        msg: err.message,
      })
    })
})

router.get('/join/:sessionId', (req, res, next) => {
  const { sessionId } = req.params
  if (!sessionId)
    return res.status(400).json({
      status: 'error',
      msg: 'SessionId not provided',
    })

  Session.findById(sessionId).then((session) => {
    if (!session)
      return res.status(404).json({
        status: 'error',
        msg: 'Invalid Session',
      })
    if (session.state != 'INITIALIZED')
      return res.status(400).json({
        status: 'error',
        msg: 'Session is already joined',
      })

    // move the session to PROGRESS
    session.state = 'PROGRESS'
    const playAs = host === 'WHITE' ? 'BLACK' : 'WHITE'
    session.save().then((session) => {
      return res.status(200).json({
        status: 'ok',
        msg: 'Session started',
        session,
        playAs,
      })
    })
  })
})

router.patch('/update', (req, res, next) => {
  const { sessionId, fen } = req.body
  if (!sessionId || !fen)
    return res.status(400).json({
      status: 'error',
      msg: 'Insufficient payload',
    })
  Session.findById(sessionId).then((session) => {
    if (!session)
      return res.status(400).json({
        status: 'error',
        msg: 'Session does not exist',
      })
    session.history.push(session.fen)
    session.fen = fen
    session
      .save()
      .then((session) => {
        return res.status(400).json({
          status: 'ok',
          msg: 'Session updated',
          session: session,
        })
      })
      .catch((err) => {
        return res.status(400).json({
          status: 'error',
          msg: err.message,
        })
      })
  })
})

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
