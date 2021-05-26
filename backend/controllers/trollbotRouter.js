const trollbotRouter = require('express').Router()
const {botAnswer, getGreeting} = require('./trollbotAnswerController')


/* trollbotRouter.get('/', (req, res) => {
  res.json(messages)
}) */



trollbotRouter.post('/', (req, res) => {
  const response = botAnswer(req.body)
  res.json(botAnswer(response)
})

trollbotRouter.delete('/', (req, res) => {
  message = getGreeting()
  res.json(message)
})


module.exports = trollbotRouter
