const axios = require('axios')
const { inspect } = require('util')
const logger = require('../utils/logger')
const { RASA_NETWORK } = require('../utils/config')
const { getBot, getRoomName } = require('./roomService')

// Contains all messages sent by Rasa.
let botMessages = []

const saveBotMessage = message => {
  botMessages.push(message)
}

// Returns the oldest message for a given room and removes it from botMessages.
const getBotMessage = roomId => {
  const roomName = getRoomName(roomId)
  const roomMessages = botMessages.filter(m => m.recipient_id === roomName)

  if (roomMessages.length != 0) {
    const reply = roomMessages.shift()
    const index = botMessages.indexOf(reply)
    if (index > -1) {
      botMessages.splice(index, 1)
    }
    const room = reply.recipient_id

    return {
      room: roomId,
      body: reply.text,
    }
  }
}

const buildRasaEndpoint = roomId => `${RASA_NETWORK}:${getBot(roomId).type === 'Troll' ? 5006 : 5005}`

/**
 * Sends a user message to the Rasa HTTP server.
 * @param {*} room 
 * @param {*} param1 
 * @returns 
 */
const sendMessageToRasa = async (roomId, { body, user }) => {
  logger.info('Entered rasaService:sendMessageToRasa(): ', body, user.name)
  const roomName = getRoomName(roomId)
  logger.info('sendMessageToRasa:roomName: ', roomName)
  try {
    logger.info(inspect(body))
    const response = await axios.post(`${buildRasaEndpoint(roomId)}/webhooks/callback/webhook`, {
      'sender': roomName,
      'message': body
    })

    logger.info('sendMessageToRasa:response.data', response.data)
    return response.data

  } catch (error) {
    logger.error(`An error occurred while sending message to Rasa: ${error}`)
  }
}

/**
 * Sets the Rasa users slot to the current list of users.
 * @param {*} roomId 
 * @param {*} users 
 * @returns 
 */
const setRasaUsersSlot = async (roomId, users) => {
  const roomName = getRoomName(roomId)
  const humanUsers = users.slice(1)
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
  const roomName = getRoomName(roomId)
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
  const roomName = getRoomName(roomId)
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
