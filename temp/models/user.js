const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define model structure
const userSchema = new Schema({
  profile: {
    name: {
      type: String,
      required: false,
    },
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('User', userSchema)
