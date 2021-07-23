const axios = require('axios')
const { inspect } = require('util')
const logger = require('../utils/logger')
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

const getRasaRESTResponse = async (message) => {
  logger.info('Entered rasaController:getRasaRESTResponse().')
  try {
    const response = await axios.post('http://localhost:5005/webhooks/callback/webhook', {
      'sender': 'test_user',
      'message': message
    })
    
  } catch (error) {
    logger.error(`An error occurred during rasaController:getRasaRESTResponse: ${error}`)
  }
}

module.exports = { saveBotMessage, getBotMessage, getRasaRESTResponse}