const loginRouter = require('express').Router()
const logger = require('../utils/logger')
const { getUsers, login } = require('../services/userService')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body
  const logginUser = login(body.name)

  const userModel = new User({
    username: body.name,
    passwordHash: '123'
  })

  const savedUser = await userModel.save()

  logger.info('Saved user to database', savedUser)
  logger.info('Logged in as:', logginUser)
  response.status(200).send(logginUser)

})

loginRouter.get('/:id', async (request, response) => {
  const user = await User.findOne({}).populate('courses')
  response.json(user)
})

loginRouter.get('/', (request, response) => {
  response.json(getUsers())
})

module.exports = loginRouter