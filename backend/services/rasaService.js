const axios = require('axios')
const { inspect } = require('util')
const logger = require('../utils/logger')
const { RASA_ENDPOINT } = require('../utils/config')
var bot_messages = []

const saveBotMessage = (message) => {

  console.log(message.text)
  bot_messages.push(message)

}

const getBotMessage = () => {

  if (bot_messages.length != 0) {

    const reply = bot_messages.shift()

    let replies = []
    const replyObject = {
      body: reply.text,
      user: 'Bot',
      date: new Date().toISOString(),
      id: 111
    }

    replies.push(replyObject)

    let responses = []
    for (let i = 0; i < replies.length; i++) {
      const msg = {
        id: 'botanswerid' + (replies[i].id + i),
        room: 'Test',
        body: replies[i].body,
        senderId: 'bot',
        user: {
          name: 'Bot'
        }
      }
      responses.push(msg)
    }

    console.log(responses)
    return responses
  } 
}

/**
 * Gets the Rasa text response from the Rasa HTTP server.
 * @param {*} room 
 * @param {*} param1 
 * @returns 
 */
const getRasaRESTResponse = async (roomId, { body, user }) => {
  logger.info('Entered rasaController:getRasaRESTResponse(): ', body, user.name)
  logger.info('getRasaRESTResponse:roomId', roomId)
  try {
    logger.info(inspect(body))
    const response = await axios.post(RASA_ENDPOINT + '/webhooks/callback/webhook', {
      'sender': roomId,
      'message': body
    })
      .then(res => logger.info('res:', res))

    logger.info(`response: ${inspect(response.data[0].text)}`)
    logger.info('getRasaRESTResponse:response.data', response.data)
    return response.data

  } catch (error) {
    logger.error(`An error occurred during rasaController:getRasaRESTResponse: ${error}`)
  }
}

/**
 * Sets the Rasa users slot to the current list of users.
 * @param {*} channel_id 
 * @param {*} users 
 * @returns 
 */
const setRasaUsersSlot = async (channel_id, users) => {
  logger.info('Entered rasaController:setRasaUsersSlot().')
  try {
    let rasa_users = {}
    for (const user of users) {
      logger.info('setRasaUsersSlot:user.room', user.room)
      logger.info('setRasaUsersSlot:channel_id', channel_id)    
      if (user.room === channel_id) {
        rasa_users[user.senderId] = user
      }
    }
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
  logger.info(`Entered rasaController:setRasaLastMessageSenderSlot(${channel_id}, ${user_id}).`)
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

exports.getRasaRESTResponse = getRasaRESTResponse
exports.setRasaUsersSlot = setRasaUsersSlot
exports.setRasaLastMessageSenderSlot = setRasaLastMessageSenderSlot
exports.saveBotMessage = saveBotMessage
exports.getBotMessage = getBotMessage
