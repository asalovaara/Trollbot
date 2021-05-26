const trollbotRouter = require('express').Router()
const {botAnswer, getGreeting, getAllMessages, deleteAllMessages} = require('./trollbotAnswerController')


trollbotRouter.get('/', (req, res) => {
  res.json(getAllMessages())
})

trollbotRouter.post('/', (req, res) => {
  botAnswer(req.body.message)
  res.json(getAllMessages())
})

trollbotRouter.delete('/', (req, res) => {
  deleteAllMessages()
  res.json(getAllMessages())
})

module.exports = trollbotRouter
