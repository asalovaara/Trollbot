const logger = require('../utils/logger')
const dbService = require('../database/databaseService')

/*
 * This file contains functions related to bot generation.
 */

const names = ['Bob', 'Alice', 'John', 'Dylan']

// generates the visible name of the bot, (selects random one from the list above)
const generateName = async () => names[Math.floor(Math.random() * names.length)]

// generates bots username
const generateUsername = async () => {
  const userCount = await dbService.userCount()

  return `user${userCount+1}`
}

// main creation function
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