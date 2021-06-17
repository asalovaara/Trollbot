const trollbotRouter = require('express').Router()
const {botAnswer, getGreeting, getMessages} = require('./trollbotAnswerController')



let messages = [getGreeting()]


trollbotRouter.get('/', (req, res) => {
  res.json(getMessages())
})


trollbotRouter.post('/', async (req, res) => {
  const response = await botAnswer(req.body)
  res.json(response)
})

trollbotRouter.delete('/', (req, res) => {
  message = getGreeting()
  res.json(message)
})


module.exports = trollbotRouter
