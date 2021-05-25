const trollbotRouter = require('express').Router()

const botGreeting = { body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }

let messages = [botGreeting]

trollbotRouter.get('/', (req, res) => {
  res.json(messages)
})

// Adds given message and a answer from bot to the list and returns it
trollbotRouter.post('/', (req, res) => {
  const body = req.body

  const messageObject = {
    body: body.message,
    user: 'Human',
    date: new Date().toISOString(),
    id: messages.length + 1
  }
  const replyObject = {
    body: `You said "${body.message}".`,
    user: 'Bot',
    date: new Date().toISOString(),
    id: messages.length + 2
  }

  messages = messages.concat(messageObject)
  messages = messages.concat(replyObject)
  res.json(messages)
})

trollbotRouter.delete('/', (req, res) => {
  messages = [botGreeting]
  res.json(messages)
})

module.exports = trollbotRouter
