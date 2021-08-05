const rasaRouter = require('express').Router()
const { getRasaRESTResponse, saveBotMessage } = require('../services/rasaService')
const logger = require('../utils/logger')

rasaRouter.post('/', async (req, res) => {
  const body = req.body
  logger.info('Entered rasaController:getRasaRESTResponse().')
  const rasaResponse = await getRasaRESTResponse(body)
  res.json(rasaResponse.data[0].text)
})

rasaRouter.post('/bot', (req, res) => {
  const message = req.body
  console.log(message)
  saveBotMessage(message)
  res.status(200).json({'status': 'message sent'})
})


module.exports = rasaRouter