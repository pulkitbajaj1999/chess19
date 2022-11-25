const express = require('express')
const router = express.Router()

const gameSessions = require('../models/gameSessions')

router.post('/move', (req, res) => {
  const { sessionID, boardState } = req.body
  const session = gameSessions[sessionID]
  if (!session) {
    return res.status(404).json({
      error: 'session not found',
    })
  } else {
    gameSessions[sessionID].boardState = boardState
    console.log('game-session-after-move', gameSessions)
    return res.status(200).json({
      msg: 'session updated successfully',
    })
  }
})

module.exports = router
