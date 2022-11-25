// import node-inbuilt modules
require('dotenv').config()
const path = require('path')

// import installed modules
const express = require('express')
const bodyParser = require('body-parser')

// file imports
// const chessRoutes = require('./routes/chess')
const sessionRoutes = require('./routes/session')
// const actionRoutes = require('./routes/action')

// define variables and methods
const app = express()

// using body parser to parse body-content
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// serving static files
app.use(express.static(path.join(__dirname, 'react-build')))
app.use(express.static(path.join(__dirname, 'public')))

// setting view engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// handling cors policy
app.use('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

// serving react-app
app.get('/', (req, res) => {
  return res
    .status(200)
    .send(path.join(__dirname, 'frontend-build', 'index.html'))
})

// serving routes
app.use('/api/v1/session', sessionRoutes)
// app.use('/api/v1/action', actionRoutes)

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
