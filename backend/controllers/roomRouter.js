const roomRouter = require('express').Router()
const { getRooms, getRoom, addRoom, getActiveRoom, getMessagesInRoom, getUsersInRoom, getBot, isRoomActive, activateRoom } = require('../services/roomService')
const logger = require('../utils/logger')

roomRouter.get('/', async (req, res) => {
  const rooms = await getRooms()
  res.json(rooms)
})

roomRouter.post('/', async (req, res) => {
  const body = req.body
  const addedRoom =  await addRoom(body)
  return res.status(200).send(addedRoom)
})

roomRouter.get('/activeRoom', async (req, res) => {
  const roomCode =  await getActiveRoom()
  return res.send(roomCode)
})

roomRouter.get('/:roomId', async (req, res) => {
  const room =  await getRoom(req.params.roomId)
  return res.json({ room })
})

roomRouter.get('/:roomId/users', async (req, res) => {
  const users =  await getUsersInRoom(req.params.roomId)
  return res.json({ users })
})

roomRouter.get('/:roomId/bot', async (req, res) => {
  const bot =  await getBot(req.params.roomId)
  return res.json({ bot })
})

roomRouter.get('/:roomId/messages', async (req, res) => {
  const messages = await getMessagesInRoom(req.params.roomId)
  logger.info(`Messages: '${messages}'`)
  return res.json({ messages })
})

roomRouter.get('/:roomId/active', async (req, res) => {
  const active =  await isRoomActive(req.params.roomId)
  return res.send(active)
})

roomRouter.get('/:roomId/activate', async (req, res) => {
  const activated = activateRoom(req.params.roomId)
  return res.send(activated)
})

module.exports = roomRouter