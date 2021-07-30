const axios = require('axios')
const { inspect } = require('util')
const logger = require('../utils/logger')

const getRasaRESTResponse = async (data) => {
  logger.info('Entered rasaController:getRasaRESTResponse().', data)
  try {
    const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
      'sender': data.user,
      'message': data.body
    })
    logger.info(`response: ${inspect(response.data[0].text)}`)

    return response.data

  } catch (error) {
    logger.error(`An error occurred during rasaController:getRasaRESTResponse: ${error}`)
  }
}

exports.getRasaRESTResponse = getRasaRESTResponse