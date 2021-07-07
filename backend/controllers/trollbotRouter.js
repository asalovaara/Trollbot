const trollbotRouter = require('express').Router()
const {botAnswer, getMessages, clearMessages} = require('../services/trollbot')

trollbotRouter.get('/', (req, res) => {
  res.json(getMessages())
})

trollbotRouter.post('/', async (req, res) => {
  console.log('trollbotrouter', req.body)
  const response = botAnswer(req.body)
  res.json(response)
})

trollbotRouter.delete('/', (req, res) => {
  clearMessages()
  res.json(getMessages())
})


module.exports = trollbotRouter
