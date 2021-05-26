const trollbotRouter = require('express').Router()

trollbotRouter.get('/', (req, res) => {
  res.json(messages)
})

const getGreeting = () => {
  return { body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }
}

// Not working yet. Update this when classification of user messages is ready & when bot replies are ready
// Move to separate file?
const chooseReply = ( {message} ) => {
  if (message.type == 'opening') {
    // todo
    return "Hi"
  }
  if (message.type == 'closing') {
    // todo
    return "Bye"
  }
  if (message.type == 'question') {
    // todo
    return "I don't know"
  }
  if (message.type == 'other') {
    // todo
    return "I don't understand"
  }
}

const botGreeting = getGreeting()

let messages = [botGreeting]

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
    // body: chooseReply
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
