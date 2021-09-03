const axios = require('axios')
const { inspect } = require('util')
const logger = require('../utils/logger')
const { RASA_ENDPOINT } = require('../utils/config')
var bot_messages = []

const saveBotMessage = (message) => {
  bot_messages.push(message)
}

const getBotMessage = () => {

  if (bot_messages.length != 0) {

    const reply = bot_messages.shift()
    const room = reply.recipient_id

    return {
      room: room,
      body: reply.text,
      senderId: 'bot',
      user: {
        name: 'Bot'
      }
    }
  }
}

/**
 * Sends a user message to the Rasa HTTP server.
 * @param {*} room 
 * @param {*} param1 
 * @returns 
 */
const sendMessageToRasa = async (roomId, { body, user }) => {
  logger.info('Entered rasaService:sendMessageToRasa(): ', body, user.name)
  logger.info('sendMessageToRasa:roomId', roomId)
  try {
    logger.info(inspect(body))
    const response = await axios.post(RASA_ENDPOINT + '/webhooks/callback/webhook', {
      'sender': roomId,
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
 * @param {*} channel_id 
 * @param {*} users 
 * @returns 
 */
const setRasaUsersSlot = async (channel_id, users) => {
  const humanUsers = users.slice(1)
  let rasa_users = {}
  for (const user of humanUsers) {
    rasa_users[user.senderId] = user
  }
  logger.info('Entered rasaService:setRasaUsersSlot().', users)
  try {
    logger.info('setRasaUsersSlot:rasa_users', rasa_users)
    let response = await axios.post(RASA_ENDPOINT + `/conversations/${channel_id}/tracker/events`, {
      'event': 'slot',
      'name': 'users',
      'value': rasa_users
    })
    if (response) {
      logger.info(`Set users slot value in Rasa server for channel ${channel_id}`)
      return true
    }

  } catch (e) {
    logger.error(e)
  }
}

/**
 * Sets the Rasa last_message_sender slot to the sender_id of the person sending a message.
 * @param {*} channel_id 
 * @param {*} user_id 
 * @returns 
 */
const setRasaLastMessageSenderSlot = async (channel_id, user_id) => {
  logger.info(`Entered rasaService:setRasaLastMessageSenderSlot(${channel_id}, ${user_id}).`)
  try {
    logger.info('setRasaLastMessageSenderSlot', channel_id)
    let tracker = await axios.get(RASA_ENDPOINT + `/conversations/${channel_id}/tracker`)
    let users = tracker.data.slots.users

    logger.info('setRasaLastMessageSenderSlot:users', users)

    for (const user in users) {
      logger.info(user)
      users[user].active = false
    }
    users[user_id].active = true

    let response = await axios.post(RASA_ENDPOINT + `/conversations/${channel_id}/tracker/events`, [
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
      logger.info(`Set users slot value in Rasa server for channel ${channel_id}`)
      return true
    }
  } catch (e) {
    logger.error(e)
  }

}

// Sets the bot_type slot for Rasa conversation (room). Used for associating logs with stories files.

const setBotType = async (channel_id, botType) => {
  logger.info(`Entered rasaService:setBotType(${channel_id}, ${botType}).`)

  try {
    let response = await axios.post(RASA_ENDPOINT + `/conversations/${channel_id}/tracker/events`,
      {
        'event': 'slot',
        'name': 'bot_type',
        'value': botType
      })
    if (response) {
      logger.info(`Set bot_type slot to ${botType} for room ${channel_id}.`)
      return true
    }

  } catch (e) {
    logger.error(e)
  }
}

module.exports = { sendMessageToRasa, setRasaUsersSlot, setRasaLastMessageSenderSlot, saveBotMessage, getBotMessage, setBotType }
