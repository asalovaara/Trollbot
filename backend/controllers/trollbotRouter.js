const trollbotRouter = require('express').Router()
const {botAnswer, getGreeting, getMessages} = require('./trollbotAnswerController')



let messages = [getGreeting()]


trollbotRouter.get('/', (req, res) => {
  res.json(getMessages())
})

trollbotRouter.get('/', (req, res) => {
  res.json(getAllMessages())
})

trollbotRouter.post('/', (req, res) => {
  const response = botAnswer(req.body)
  res.json(response)
})

trollbotRouter.delete('/', (req, res) => {
  deleteAllMessages()
  res.json(getAllMessages())
})

module.exports = trollbotRouter
