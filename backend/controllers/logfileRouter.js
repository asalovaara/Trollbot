const logfileRouter = require('express').Router()
const logger = require('../utils/logger')
const { runLogger } = require('../services/eventLogger/logWriterService')

logfileRouter.post('/:roomId', async (request, response) => {
  const body = request.body
  logger.info('logfileRouter ', body)

  try {
    logger.info('Trying to generate log for ', request.params.roomId)
    const options = {
      source: 'checked from .env file',
      room: request.params.roomId,
      delete: false,
      list: false,
      dataFolder: null
    }

    const logGenerated = await runLogger(options)
    logger.info(logGenerated)
    if (!logGenerated) throw new Error('Ran into an error while generating log.')

    response.status(200).send()
    logger.info('Generated log for room ', request.params.roomId)
  } catch (e) {
    logger.error(e)
    response.status(500).send()
  }
})

logfileRouter.post('/:roomId/delete', async (request, response) => {
  const body = request.body
  logger.info('logfileRouter ', body)

  try {
    logger.info('Trying to delete tracker store conversation ', request.params.roomId)
    const options = {
      source: 'checked from .env file',
      room: request.params.roomId,
      delete: true,
      list: false,
      dataFolder: null
    }

    const logDeleted = await runLogger(options)
    logger.info(logDeleted)
    if (!logDeleted) throw new Error('Ran into an error while deleting tracker store conversation.')

    response.status(200).send()
    logger.info('Deleted tracker store conversation ', request.params.roomId)
  } catch (e) {
    logger.error(e)
    response.status(500).send()
  }
})

logfileRouter.get('/', (request, response) => {
  response.status(403).send()
})

module.exports = logfileRouter
