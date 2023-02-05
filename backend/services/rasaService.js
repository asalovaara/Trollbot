const axios = require('axios')
const { inspect } = require('util')
const logger = require('../utils/logger')
const { RASA_NETWORK } = require('../utils/config')
const { getBot, getRoomName } = require('./roomService')

const { BOT_TYPES, BOT_PORTS } = require('../utils/config')

// Contains all messages sent by Rasa.
let botMessages = [] // move to database?

const saveBotMessage = message => {
  botMessages.push(message)
}

// Returns the oldest message for a given room and removes it from botMessages.
const getBotMessage = async roomId => {
  const roomName = await getRoomName(roomId)
  const roomMessages = botMessages.filter(m => m.recipient_id === roomName)

  if (roomMessages.length != 0) {
    const reply = roomMessages.shift()
    const index = botMessages.indexOf(reply)
    if (index > -1) {
      botMessages.splice(index, 1)
    }

    return {
      room: roomId,
      body: reply.text,
    }
  }
}

const buildRasaEndpoint = async roomId => {
  const bot = await getBot(roomId)
  
  const typePos = BOT_TYPES.indexOf(bot.type)
  const index = (typePos < 0)? 0 : typePos

  return `${RASA_NETWORK}:${BOT_PORTS[index]}`
}

/**
 * Sends a user message to the Rasa HTTP server.
 * @param {*} room room id
 * @param {*} param1 Object with the message body and a user object
 * @returns 
 */
const sendMessageToRasa = async (roomId, { body, user }) => {
  logger.info('Entered rasaService:sendMessageToRasa(): ', body, user.name)
  const roomName = await getRoomName(roomId)
  logger.info('sendMessageToRasa:roomName: ', roomName)
  try {
    logger.info(inspect(body))
    const endPoint = await buildRasaEndpoint(roomId)
    const response = await axios.post(`${endPoint}/webhooks/callback/webhook`, {
      'sender': roomName,
      'message': body
    })

    logger.info('sendMessageToRasa:response.data', response.data)
    return response.data

  } catch (error) {
    logger.error(`An error occurred while sending message to Rasa: ${error}`)
  }
  return false
}

/**
 * Sets the Rasa users slot to the current list of users.
 * @param {*} roomId 
 * @param {*} users 
 * @returns 
 */
const setRasaUsersSlot = async (roomId, users) => {
  const roomName = await getRoomName(roomId)
  const humanUsers = users.slice(1) // Assumes that the bot is in slot 1
  let rasa_users = {}
  for (const user of humanUsers) {
    rasa_users[user.senderId] = user
  }
  logger.info('Entered rasaService:setRasaUsersSlot().', users)
  try {
    logger.info('setRasaUsersSlot:rasa_users', rasa_users)
    let response = await axios.post(`${buildRasaEndpoint(roomId)}/conversations/${roomName}/tracker/events`, {
      'event': 'slot',
      'name': 'users',
      'value': rasa_users
    })
    if (response) {
      logger.info(`Set users slot value in Rasa server for channel ${roomName}`)
      return true
    }

  } catch (e) {
    logger.error(e)
  }
}

/**
 * Sets the Rasa last_message_sender slot to the sender_id of the person sending a message.
 * @param {*} roomId 
 * @param {*} user_id 
 * @returns 
 */
const setRasaLastMessageSenderSlot = async (roomId, user_id) => {
  const roomName = await getRoomName(roomId)
  logger.info(`Entered rasaService:setRasaLastMessageSenderSlot(${roomName}, ${user_id}).`)
  try {
    logger.info('setRasaLastMessageSenderSlot', roomName)
    let tracker = await axios.get(`${buildRasaEndpoint(roomId)}/conversations/${roomName}/tracker`)
    let users = tracker.data.slots.users

    logger.info('setRasaLastMessageSenderSlot:users', users)

    for (const user in users) {
      logger.info(user)
      users[user].active = false
    }
    users[user_id].active = true

    let response = await axios.post(`${buildRasaEndpoint(roomId)}/conversations/${roomName}/tracker/events`, [
      {
        'event': 'slot',
        'name': 'users',
        'value': users
      },
      {
        'event': 'slot',
        'name': 'active_user',
        'value': user_id
      },
      {
        'event': 'slot',
        'name': 'last_message_sender',
        'value': user_id
      }]
    )
    if (response) {
      logger.info(`Set users slot value in Rasa server for channel ${roomName}`)
      logger.info(`Set users slot value in Rasa server for channel ${roomName}`)
      return true
    }
  } catch (e) {
    logger.error(e)
  }

}

// Sets the bot_type slot for Rasa conversation (room). Used for associating logs with stories files.

const setBotType = async (roomId, botType) => {
  const roomName = await getRoomName(roomId)
  logger.info(`Entered rasaService:setBotType(${roomName}, ${botType}).`)

  try {
    let response = await axios.post(`${buildRasaEndpoint(roomId)}/conversations/${roomName}/tracker/events`,
      {
        'event': 'slot',
        'name': 'bot_type',
        'value': botType
      })
    if (response) {
      logger.info(`Set bot_type slot to ${botType} for room ${roomName}.`)
      return true
    }

  } catch (e) {
    logger.error(e)
  }
}

module.exports = { sendMessageToRasa, setRasaUsersSlot, setRasaLastMessageSenderSlot, saveBotMessage, getBotMessage, setBotType }
