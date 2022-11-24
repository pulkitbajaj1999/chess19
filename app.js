// import node-inbuilt modules
require('dotenv').config()
const path = require('path')

// import installed modules
const express = require('express')
const bodyParser = require('body-parser')

// file imports
const chessRoutes = require('./routes/chess')

// define variables and methods
const app = express()

// using body parser to parse body-content
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// serving static files
app.use(express.static(path.join(__dirname, 'public')))

// setting view engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// handling routes
app.use('/', chessRoutes)

// handling errors
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500
  console.log('-----error------\n', error)
  return res.status(statusCode).json({
    message: error.message,
    data: error.data,
  })
})

var PORT = process.env.PORT || 3000
const server = app.listen(PORT)

// initialize socket connection and check connection
const io = require('./socket').init(server)
io.on('connection', () => {
  console.log('Client connected!')
})
