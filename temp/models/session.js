const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define model structure
const sessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['INITIALIZED', 'PROGRESS', 'ABORT', 'COMPLETE'],
    default: 'INITIALIZED',
  },
  // ready is when both plaery joined
  result: {
    type: String,
    enum: [null, 'WHITE', 'BLACK', 'DRAW'],
    default: null,
  },
  host: {
    type: String,
    enum: ['WHITE', 'BLACK'],
    default: 'WHITE',
  },
  black: {
    type: String,
  },
  white: {
    type: String,
  },
  fen: {
    type: String,
    required: true,
  },
  history: [{ type: String }],
})

module.exports = mongoose.model('Session', sessionSchema)
