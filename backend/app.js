const express = require('express')
const cors = require('cors')
const path = require('path')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const { API_URL } = require('./utils/config')

const botRouter = require('./controllers/botRouter')
const rasaRouter = require('./controllers/rasaRouter')
const loginRouter = require('./controllers/loginRouter')
const roomRouter = require('./controllers/roomRouter')

const app = express()

app.use(express.json()) // for parsing JSON
app.use(express.urlencoded({ extended: true }))
app.use(cors()) // to enable cross-origin resource sharing
app.use(express.static(path.join(__dirname, 'build')))

// Routers
app.use(`${API_URL}/trollbot`, botRouter)
app.use(`${API_URL}/rasa`, rasaRouter)
app.use(`${API_URL}/login`, loginRouter)
app.use(`${API_URL}/rooms`, roomRouter)

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