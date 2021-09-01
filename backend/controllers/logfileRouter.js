const logfileRouter = require('express').Router()
const logger = require('../utils/logger')
const { runLogger } = require('../services/eventLogger/logWriterService')


logfileRouter.post('/:roomId', async (request, response) => {
  const body = request.body
  logger.info('logfileRouter ', body)
  
  try {
    logger.info('Trying to generate log for ', request.params.roomId)
    const options = {
      source: 'ATLAS',
      room: request.params.roomId,
      delete: false,
      list: false,
      dataFolder: 'data'
    }

    const logGenerated = await runLogger(options)
    logger.info(logGenerated)
    if (!logGenerated) throw 'Ran into an error while generating log.'

    response.status(200).send()
	logger.info('Generated log', request.params.roomId)
  } catch (e) {
    logger.error(e)
    response.status(500).send()
  }
})

logfileRouter.get('/', (request, response) => {
  response.status(403).send()
})

module.exports = logfileRouter