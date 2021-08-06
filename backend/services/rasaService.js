const axios = require('axios')
const { inspect } = require('util')
const logger = require('../utils/logger')

/**
 * Gets the Rasa text response from the Rasa HTTP server.
 * @param {*} room 
 * @param {*} param1 
 * @returns 
 */
const getRasaRESTResponse = async (room, { body, user}) => {
  logger.info('Entered rasaController:getRasaRESTResponse(): ', body, user.name)
  try {
    logger.info(inspect(body))
    const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
      'sender': room,
      'message': body,
    })
    logger.info(`response: ${inspect(response.data[0].text)}`)

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
  logger.info(`Entered rasaController:setRasaUsersSlot().`)
  try {
    let rasa_users = {};
    for (const user of users) {
      if (user.room === channel_id) {
        rasa_users[user.senderId] = user
      }
    }
    let response = await axios.post(`http://localhost:5005/conversations/${channel_id}/tracker/events`, {
      "event": "slot",
      "name": "users",
      "value": rasa_users
    })
    if (response) {
      logger.info(`Set users slot value in Rasa server for channel ${channel_id}`)
      return true;
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
    
    let tracker = await axios.get(`http://localhost:5005/conversations/${channel_id}/tracker`)
    let users = tracker.data.slots.users

    for (const user in users) {
      console.log(user)
      users[user].active = false
    }
    users[user_id].active = true
    
    await axios.post(`http://localhost:5005/conversations/${channel_id}/tracker/events`, {
      "event": "slot",
      "name": "last_message_sender",
      "value": user_id
    })
    let response = await axios.post(`http://localhost:5005/conversations/${channel_id}/tracker/events`, {
      "event": "slot",
      "name": "users",
      "value": users
    })
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