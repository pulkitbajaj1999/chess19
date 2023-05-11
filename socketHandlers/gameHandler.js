const shortId = require('shortid')
const rooms = require('../rooms')

const COLOR = {
  WHITE: 'WHITE',
  BLACK: 'BLACK',
}
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

module.exports = (io) => {
  const startNewGame = function (data) {
    const socket = this
    const room = {
      roomId: shortId.generate(),
      whiteId: null,
      blackId: null,
      fen: null,
    }
    switch (data.playAs) {
      case COLOR.WHITE:
        room.whiteId = socket.id
        break
      case COLOR.BLACK:
        room.blackId = socket.id
        break
      // defaulting to white if playas not specified
      default:
        room.whiteId = socket.id
        return
    }
    room.fen = START_FEN
    socket.join(room.roomId)
    socket.emit('server:game:initialize', {
      roomId: room.roomId,
      playerId: socket.id,
      fen: room.fen,
      playAs: data.playAs,
    })
    rooms.push(room)
  }

  const joinGame = function (data) {
    function sendError(msg) {
      socket.emit('server:error', {
        msg: msg,
      })
    }
    function joinAs(color) {
      switch (color) {
        case COLOR.WHITE:
          room.whiteId = socket.id
          break
        case COLOR.BLACK:
          room.blackId = socket.id
          break
      }
      socket.join(roomId)
      socket.emit('server:game:initialize', {
        fen: room.fen,
        playAs: color,
      })
    }

    const socket = this
    const { roomId } = data
    const roomIndex = rooms.findIndex((room) => room.roomId === roomId)
    if (roomIndex === -1) {
      sendError('room does not exist')
      return
    }
    const room = rooms[roomIndex]

    // both white and black already joined
    if (room.whiteId && room.blackId) {
      sendError('both players already joined to this room')
      return
    }

    // if no player joined
    if (!room.whiteId && !room.blackId) {
      sendError('room is empty, create a new room')
      return
    }

    // either of room is available
    if (!room.whiteId) {
      joinAs(COLOR.WHITE)
    } else if (!room.blackId) {
      joinAs(COLOR.BLACK)
    }
    // io.to(room.roomId).emit('state', {
    //   state: 'progress',
    // })
  }

  const watchGame = function () {}

  const updateGame = function (data) {
    function sendError(msg) {
      socket.emit('server:error', {
        msg: msg,
      })
    }
    const socket = this
    const { roomId, fen } = data
    const roomIndex = rooms.findIndex((room) => room.roomId === roomId)

    // if room is not present send error to client
    if (roomIndex === -1) {
      sendError('room does not exist')
      return
    }
    // else update fen to room and send update to all the sockets in room
    rooms[roomIndex].fen = data?.fen
    io.in(roomId).emit('server:game:update', { fen })
  }

  return { startNewGame, joinGame, watchGame, updateGame }
}
