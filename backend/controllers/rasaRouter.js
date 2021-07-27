const rasaRouter = require('express').Router()
const {getRasaRESTResponse} = require('../services/rasaService')
const logger = require('../utils/logger')

rasaRouter.post('/', async (req, res) => {
  const body = req.body
  logger.info('Entered rasaController:getRasaRESTResponse().')
  const rasaResponse = await getRasaRESTResponse(body)
  res.json(rasaResponse.data[0].text)
})

module.exports = rasaRouter
