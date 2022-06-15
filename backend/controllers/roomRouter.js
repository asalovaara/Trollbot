const roomRouter = require('express').Router()
const { getRooms, getRoom, addRoom, getActiveRoom, getMessagesInRoom, getUsersInRoom, getBot, addRoomEnd, getValidLinks, isRoomActive, activateRoom } = require('../services/roomService')

roomRouter.get('/', (req, res) => {
  res.json(getRooms())
})

roomRouter.post('/', (req, res) => {
  const body = req.body
  const addedRoom = addRoom(body)
  return res.status(200).send(addedRoom)
})

roomRouter.get('/activeRoom', (req, res) => {
  const roomCode = getActiveRoom()
  return res.send(roomCode)
})

roomRouter.get('/:roomId', (req, res) => {
  const room = getRoom(req.params.roomId)
  return res.json({ room })
})

roomRouter.get('/:roomId/users', (req, res) => {
  const users = getUsersInRoom(req.params.roomId)
  return res.json({ users })
})

roomRouter.get('/:roomId/bot', (req, res) => {
  const bot = getBot(req.params.roomId)
  return res.json({ bot })
})

roomRouter.get('/:roomId/messages', (req, res) => {
  const messages = getMessagesInRoom(req.params.roomId)
  return res.json({ messages })
})

roomRouter.post('/:roomId/link', (req, res) => {
  const addedLink = addRoomEnd(req.params.roomId)
  return res.status(200).send(addedLink)
})

roomRouter.get('/:roomId/link', (req, res) => {
  const validLinks = getValidLinks(req.params.roomId)
  return res.json(validLinks)
})

roomRouter.get('/:roomId/active', (req, res) => {
  const active = isRoomActive(req.params.roomId)
  return res.send(active)
})

roomRouter.get('/:roomId/activate', (req, res) => {
  const activated = activateRoom(req.params.roomId)
  return res.send(activated)
})

module.exports = roomRouter