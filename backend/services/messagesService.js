var uuid = require('uuid')
const logger = require('../utils/logger')
const { getRasaRESTResponse } = require('./rasaService')

let messages = []

const addMessage = (room, message) => {
  const msg = { id: uuid.v4(), room, ...message }
  logger.info('addMessage', msg)
  messages.push(msg)
  return msg
}

const getAnswer = async (data) => {
  const response = await getRasaRESTResponse(data)

  let responses = []

  for (let i = 0; i < response.length; i++) {
    const msg = {
      id: 'botanswerid' + (response[i].id + i),
      room: 'Test',
      senderId: 'bot',
      body: response[i].body,
      user: {
        id: 'bot',
        name: 'Bot'
      }
    }
    responses.push(msg)
  }

  return responses
}

const removeMessage = (id) => {
  const index = messages.findIndex((message) => message.id === id)

  if (index !== -1) return messages.splice(index, 1)[0]
}

const getMessage = (id) => messages.find((message) => message.id === id)

const getMessagesInRoom = (room) =>
  messages.filter((message) => message.room === room)

module.exports = { addMessage, getAnswer, removeMessage, getMessage, getMessagesInRoom }
