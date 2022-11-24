const express = require('express')
const router = express.Router()

const Board = require('../models/board')
const socket = require('../socket')
const boardUtils = require('../utils/board')

var board = new Board()

router.get('/', (req, res, next) => {
  console.log(req.query.player)
  return res.render('chessview', {
    board,
    boardMapping: boardUtils.getMapping(board.currentState),
    files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    ranks: ['8', '7', '6', '5', '4', '3', '2', '1'],
  })
})

router.post('/move', (req, res, body) => {
  console.log('move-endpoint; body: ', req.body)
  const action = req.body.action
  const payload = req.body.payload
  switch (action) {
    case 'lock':
      board.setMoveLock(payload)
      break
    case 'unlock':
      board.resetMoveLock()
      break
    case 'move':
      board.makeMove(payload)
      break
    default:
      console.log('unknown-move-action')
  }
  socket.getIo().emit('event', { action: 'reload' })
  return res.status(200).redirect('/')
})

router.post('/action', (req, res, next) => {
  console.log('action-received; body:', req.body)
  const action = req.body.action
  switch (action) {
    case 'undo':
      board.reverseMove()
      break
    case 'flip':
      board.changeView()
      break
    case 'reset':
      board.reset()
      break
    default:
      console.log('test-action-success')
  }
  socket.getIo().emit('event', { action: 'reload' })
  return res.status(200).redirect('/')
})

module.exports = router
