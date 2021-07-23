var uuid = require('uuid')
const logger = require('../utils/logger')
// const { botAnswer } = require('./trollbot')
const { rasaAnswer } = require('./trollbot')

const messages = []

const addMessage = (room, message) => {
  const msg = { id: uuid.v4(), room, ...message }
  logger.info('addMessage', msg)
  //{ body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }
  messages.push(msg)
  return msg
}

const getAnswer = (message) => {
  const response = rasaAnswer({ message: message.body })

/*   let responses = []
  for (let i = 0; i < response.length; i++) {
    const msg = {
      id: 'botanswerid' + (response[i].id + i),
      room: 'Test',
      body: response[i].body,
      senderId: 'bot',
      user: {
        name: 'Bot'
      }
    }
    responses.push(msg)
  }
 */
  return
}

const removeMessage = (id) => {
  const index = messages.findIndex((message) => message.id === id)

  if (index !== -1) return messages.splice(index, 1)[0]
}

const getMessage = (id) => messages.find((message) => message.id === id)

const getMessagesInRoom = (room) =>
  messages.filter((message) => message.room === room)

module.exports = { addMessage, getAnswer, removeMessage, getMessage, getMessagesInRoom }
