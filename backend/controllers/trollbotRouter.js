const trollbotRouter = require('express').Router()
const {botAnswer, getMessages, clearMessages} = require('./trollbotAnswerController')

trollbotRouter.get('/', (req, res) => {
  res.json(getMessages())
})


trollbotRouter.post('/', (req, res) => {
  const response = botAnswer(req.body)
  res.json(response)
})

trollbotRouter.delete('/', (req, res) => {
  clearMessages()
  res.json(getMessages())
})


module.exports = trollbotRouter
