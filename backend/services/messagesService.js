var uuid = require('uuid')
const logger = require('../utils/logger')
const { botAnswer } = require('./trollbot')

const messages = []

const addMessage = (room, message) => {
  const msg = { id: uuid.v4(), room, ...message }
  logger.info('addMessage', msg)
  //{ body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }
  messages.push(msg)
  return msg
}

const getAnswer = async (message) => {
  logger.info('message', message.body)
  const response = await botAnswer({ message: message.body })
  const res = response[response.length - 1]
  const msg = {
    id: 'botanswerid' + res.id,
    room: 'Test',
    body: res.body,
    senderId: 'bot',
    user: {
      name: 'Bot'
    }
  }
  logger.info('answer', msg)
  messages.push(msg)
  return msg
}

const removeMessage = (id) => {
  const index = messages.findIndex((message) => message.id === id)

  if (index !== -1) return messages.splice(index, 1)[0]
}

const getMessage = (id) => messages.find((message) => message.id === id)

const getMessagesInRoom = (room) =>
  messages.filter((message) => message.room === room)

module.exports = { addMessage, getAnswer, removeMessage, getMessage, getMessagesInRoom }
