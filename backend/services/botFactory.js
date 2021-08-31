const logger = require('../utils/logger')

const names = ['Bob', 'Alice', 'John', 'Dylan']

const generateName = () => names[Math.floor(Math.random() * names.length)]

const createBot = (type) => {
  if (!type) return { error: 'Type is required' }

  const botName = generateName()

  logger.info(`Created type: '${type}' Bot named '${botName}'.`)

  return {
    id: 'bot',
    senderId: 'bot',
    name: botName,
    type,
  }
}

module.exports = {
  createBot
}