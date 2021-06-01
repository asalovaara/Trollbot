const trollbotRouter = require('express').Router()
const {botAnswer, getGreeting, getMessages} = require('./trollbotAnswerController')






trollbotRouter.get('/', (req, res) => {
  res.json(getMessages())
})


trollbotRouter.post('/', (req, res) => {
  const response = botAnswer(req.body)
  res.json(response)
})

trollbotRouter.delete('/', (req, res) => {
  let message = getGreeting()
  res.json(message)
})


module.exports = trollbotRouter
