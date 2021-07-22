const roomRouter = require('express').Router()
const { getUsersInRoom } = require('../services/userService')
const { getMessagesInRoom } = require('../services/messagesService')

roomRouter.get('/', (req, res) => {
  return res.send('<h2>Rooms API</h2>')
})

roomRouter.get('/:roomId/users', (req, res) => {
  const users = getUsersInRoom(req.params.roomId)
  return res.json({ users })
})

roomRouter.get('/:roomId/messages', (req, res) => {
  const messages = getMessagesInRoom(req.params.roomId)
  return res.json({ messages })
})

module.exports = roomRouter