const rasaRouter = require('express').Router()
const { saveBotMessage } = require('../services/rasaService')

rasaRouter.post('/bot', (req, res) => {
  const message = req.body
  saveBotMessage(message)
  res.status(200).json({ 'status': 'message sent' })
})


module.exports = rasaRouter