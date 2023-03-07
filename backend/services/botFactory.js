const logger = require('../utils/logger')
const dbService = require('../database/databaseService')

const names = ['Bob', 'Alice', 'John', 'Dylan']

const generateName = async () => names[Math.floor(Math.random() * names.length)]

const generateUsername = async () => {
  const userCount = await dbService.userCount()

  return `user${userCount+1}`
}

const createBot = async (type) => {
  if (!type) return { error: 'Type is required' }

  const botName = await generateName()
  const botUsername = await generateUsername()
  logger.info(`Created type: '${type}' Bot named '${botName}'.`)

  return {
    id: 'bot',
    senderId: 'bot',
    username: botUsername,
    name: botName,
    type: type,
  }
}

module.exports = {
  createBot
}