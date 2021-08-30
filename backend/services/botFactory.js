const logger = require('../utils/logger')

const names = ['Bob', 'Alice', 'John', 'Dylan']

const generateName = () => names[Math.floor(Math.random() * names.length)]

const createBot = (type, room) => {
  if (!room && !type) return { error: 'Room and Type are required' }

  const botName = generateName()

  logger.info(`Created type: '${type}' Bot named '${botName}' that was added into room '${room}'`)

  return {
    id: 'bot',
    senderId: 'bot',
    name: botName,
    type,
    room,
  }
}

module.exports = {
  createBot
}