const loginRouter = require('express').Router()
const logger = require('../utils/logger')
const { login } = require('../services/userService')

loginRouter.post('/', async (request, response) => {
  const body = request.body
  const logginUser = await login(body)
  logger.info('Logged in as:', logginUser)
  response.status(200).send(logginUser)

})

module.exports = loginRouter