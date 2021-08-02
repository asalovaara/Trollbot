const axios = require('axios')
const { inspect } = require('util')
const logger = require('../utils/logger')

const getRasaRESTResponse = async (message) => {
  logger.info('Entered rasaController:getRasaRESTResponse().')
  try {
    const response = await axios.post('http://trollbot:5005/webhooks/rest/webhook', {
      'sender': 'test_user',
      'message': message
    })
    logger.info(`response: ${inspect(response.data[0].text)}`)

    return response.data
    
  } catch (error) {
    logger.error(`An error occurred during rasaController:getRasaRESTResponse: ${error}`)
  }
}

exports.getRasaRESTResponse = getRasaRESTResponse