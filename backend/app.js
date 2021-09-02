const express = require('express')
require('express-async-errors')
const cors = require('cors')
const path = require('path')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const { API_URL, MONGODB_URI } = require('./utils/config')
const mongoose = require('mongoose')

const botRouter = require('./controllers/botRouter')
const loginRouter = require('./controllers/loginRouter')
const roomRouter = require('./controllers/roomRouter')
const logfileRouter = require('./controllers/logfileRouter')
const rasaRouter = require('./controllers/rasaRouter')

const app = express()

logger.info('connecting to Mongoose')

mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connection to MongoDB:', error.message)
  })

app.use(express.json()) // for parsing JSON
app.use(express.urlencoded({ extended: true }))
app.use(cors()) // to enable cross-origin resource sharing
app.use(express.static(path.join(__dirname, 'build'))) // find and use static build

// Routers
app.use(`${API_URL}/trollbot`, botRouter)
app.use(`${API_URL}/login`, loginRouter)
app.use(`${API_URL}/rooms`, roomRouter)
app.use(`${API_URL}/log`, logfileRouter)
app.use(`${API_URL}/rasa`, rasaRouter)

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
