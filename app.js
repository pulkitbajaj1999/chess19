// import node-inbuilt modules
require('dotenv').config()
const path = require('path')
const cors = require('cors')

// import installed modules
const express = require('express')
const bodyParser = require('body-parser')

// file imports
const sessionRoutes = require('./routes/session')
const actionRoutes = require('./routes/action')

// define variables and methods
const app = express()

// handling cors policy
app.use(cors())
// app.use('/*', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', '*')
//   next()
// })

// serving static files
app.use(express.static(path.join(__dirname, 'public')))

// using body parser to parse body-content
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// serving routes
app.use('/api/v1/session', sessionRoutes)
app.use('/api/v1/action', actionRoutes)

// handling errors
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500
  console.log('-----error------\n', error)
  return res.status(statusCode).json({
    message: error.message,
    data: error.data,
  })
})

// serving fronend
app.use(express.static(path.join(__dirname, 'frontend', 'build')))
app.get('/', (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})

var PORT = process.env.PORT || 8000
const server = app.listen(PORT)

// initialize socket connection and check connection
const io = require('./socket').init(server)
io.on('connection', () => {
  console.log('Client connected!')
})
