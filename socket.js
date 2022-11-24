let io

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      origin: '*',
      methods: '*',
    })
    return io
  },
  getIo: () => {
    if (!io) {
      throw Error('socket not initialized')
    }
    return io
  },
}
