const rasaRouter = require('express').Router()
const { saveBotMessage } = require('../services/rasaService')
const logger = require('../utils/logger')

rasaRouter.post('/bot', (req, res) => {
  const message = req.body
  logger.info('rasaRouter reveived a message from Rasa: ' + message)
  saveBotMessage(message)
  res.status(200).json({'status': 'message sent'})
})


module.exports = rasaRouter