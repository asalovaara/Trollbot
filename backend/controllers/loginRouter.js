const loginRouter = require('express').Router()
const logger = require('../utils/logger')
const { getUsers, login } = require('../services/userService')

loginRouter.post('/', async (request, response) => {
  const body = request.body
  const logginUser = login(body.username)
  logger.info('Logged in as:', logginUser)
  response.status(200).send(logginUser)
})

loginRouter.get('/', (request, response) => {
  response.json(getUsers())
})

// id changes not handeled 
/*
loginRouter.delete('/', (request, response) => {
  const body = request.body
  removeUser(body.id)
  response.json(getUsers())
})
*/

module.exports = loginRouter