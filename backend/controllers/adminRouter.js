const adminRouter = require('express').Router()
const logger = require('../utils/logger')
const { addRoom, getRooms } = require('../services/adminService')

adminRouter.post('/', async (request, response) => {
  const body = request.body
  const addedRoom = addRoom(body)
  logger.info('Room added:', addedRoom)
  response.status(200).send(addedRoom)
})

adminRouter.get('/', (request, response) => {
  response.json(getRooms())
})

module.exports = adminRouter
