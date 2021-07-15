const express = require('express')
const cors = require('cors')
const path = require('path')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const trollbotRouter = require('./controllers/trollbotRouter')
const rasaRouter = require('./controllers/rasaRouter')
const loginRouter = require('./controllers/loginRouter')
const { getUsersInRoom } = require('./users')
const { getMessagesInRoom } = require('./messages')
const { API_URL } = require('./utils/config')

const app = express()

app.use(express.json()) // for parsing JSON
app.use(express.urlencoded({ extended: true }))
app.use(cors()) // to enable cross-origin resource sharing
app.use(express.static(path.join(__dirname, 'build')))

// Routers
app.use(`${API_URL}/trollbot`, trollbotRouter)
app.use(`${API_URL}/rasa`, rasaRouter)
app.use(`${API_URL}/login`, loginRouter)

app.get('/rooms/:roomId/users', (req, res) => {
  const users = getUsersInRoom(req.params.roomId)
  return res.json({ users })
})

app.get('/rooms/:roomId/messages', (req, res) => {
  const messages = getMessagesInRoom(req.params.roomId)
  return res.json({ messages })
})

// Static Build
app.get('/*', (request, response) => {
  response.sendFile(path.join(__dirname, './build/index.html'), (error) => {
    if (error) {
      logger.error('Error finding static build')
      response.status(500).send(error)
    }
  })
})

if (process.env.NODE_ENV === 'test') {
  logger.info('Testing mode detected')
}

// Errors and Unknown endpoints
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app