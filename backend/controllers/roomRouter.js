const roomRouter = require('express').Router()
const { getRooms, addRoom, getMessagesInRoom, getUsersInRoom } = require('../services/roomService')

roomRouter.get('/', (req, res) => {
  res.json(getRooms())
})

roomRouter.post('/', (req, res) => {
  const body = req.body
  const addedRoom = addRoom(body)
  return res.status(200).send(addedRoom)
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