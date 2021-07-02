const trollbotRouter = require('express').Router()
const {botAnswer, getMessages, clearMessages} = require('../services/trollbot')

trollbotRouter.get('/', (req, res) => {
  res.json(getMessages())
})

trollbotRouter.post('/', async (req, res) => {
  const response = await botAnswer(req.body)
  res.json(response)
})

trollbotRouter.delete('/', (req, res) => {
  clearMessages()
  res.json(getMessages())
})


module.exports = trollbotRouter
