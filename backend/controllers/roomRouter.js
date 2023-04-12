const roomRouter = require('express').Router()
const { getRooms, getRoom, addRoom, getActiveRoom, getMessagesInRoom, getUsersInRoom, getBot, isRoomActive, activateRoom, getRoomSize, setRoomSize } = require('../services/roomService')
const logger = require('../utils/logger')

/*
 * This file contains all room-related functions.
 * When adding new locations, make sure they are added before the locations using '/:roomId', otherwise the requests are handled as rooms.
 */
// gets a list of all rooms
roomRouter.get('/', async (req, res) => {
  const rooms = await getRooms()
  res.json(rooms)
})

// Adds the room in request
roomRouter.post('/', async (req, res) => {
  const body = req.body
  const addedRoom = await addRoom(body)
  return res.status(200).send(addedRoom)
})

// Gets one 'active' room from the list of rooms
roomRouter.get('/activeRoom', async (req, res) => {
  const roomCode =  await getActiveRoom()
  return res.status(200).send(roomCode)
})

// Gets the number of users per room
roomRouter.get('/roomSize', async (req, res) => {
  const size = await getRoomSize()
  return res.send(size + '')
})

// Sets the number of users per room
roomRouter.post('/roomSize', async (req, res) => {
  const body = req.body
  const size = await setRoomSize(body.size)
  return res.send(size + '')
})

// Gets room with link
roomRouter.get('/:roomId', async (req, res) => {
  const room =  await getRoom(req.params.roomId)
  return res.json({ room })
})

// Gets users in room
roomRouter.get('/:roomId/users', async (req, res) => {
  const users =  await getUsersInRoom(req.params.roomId)
  return res.json({ users })
})

// gets bot in room
roomRouter.get('/:roomId/bot', async (req, res) => {
  const bot =  await getBot(req.params.roomId)
  return res.json({ bot })
})

// Gets messages in room
roomRouter.get('/:roomId/messages', async (req, res) => {
  const messages = await getMessagesInRoom(req.params.roomId)
  logger.info(`Messages: '${messages}'`)
  return res.json({ messages })
})

// Checks whether the room is active
roomRouter.get('/:roomId/active', async (req, res) => {
  const active = await isRoomActive(req.params.roomId)
  return res.send(active)
})

// Activates the given room
roomRouter.get('/:roomId/activate', async (req, res) => {
  const activated = await activateRoom(req.params.roomId)
  return res.send(activated)
})



module.exports = roomRouter