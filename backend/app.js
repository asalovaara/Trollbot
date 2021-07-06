const express = require('express')
const cors = require('cors')
const path = require('path')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const trollbotRouter = require('./controllers/trollbotRouter')
const rasaRouter = require('./controllers/rasaRouter')
const loginRouter = require('./controllers/loginRouter')
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