var uuid = require('uuid')
const { botAnswer } = require('./services/trollbot')

const messages = []

const addMessage = (room, message) => {
  const msg = { id: uuid.v4(), room, ...message }
  // console.log('addMessage', msg)
  //{ body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }
  messages.push(msg)
  return msg
}

const getAnswer = (message) => {
  console.log('message', message.body)
  const answer = botAnswer(message.body)
  console.log('answer', answer)
  return answer
}

const removeMessage = (id) => {
  const index = messages.findIndex((message) => message.id === id)

  if (index !== -1) return messages.splice(index, 1)[0]
}

const getMessage = (id) => messages.find((message) => message.id === id)

const getMessagesInRoom = (room) =>
  messages.filter((message) => message.room === room)

module.exports = { addMessage, getAnswer, removeMessage, getMessage, getMessagesInRoom }
