var uuid = require('uuid')
const logger = require('../utils/logger')
const { sendMessageToRasa } = require('./rasaService')
// const { rasaAnswer } = require('./trollbot')

let messages = []

const addMessage = (room, message) => {
  const msg = { id: uuid.v4(), room, ...message }
  logger.info('addMessage', msg)
  messages.push(msg)
  return msg
}

const getAnswer = async (roomId, data) => {
  const response = await sendMessageToRasa(roomId, data)

  return response
}

const removeMessage = (id) => {
  const index = messages.findIndex((message) => message.id === id)

  if (index !== -1) return messages.splice(index, 1)[0]
}

const getMessage = (id) => messages.find((message) => message.id === id)

const getMessagesInRoom = (room) =>
  messages.filter((message) => message.room === room)

module.exports = { addMessage, getAnswer, removeMessage, getMessage, getMessagesInRoom }
