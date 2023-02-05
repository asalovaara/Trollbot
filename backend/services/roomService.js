const logger = require('../utils/logger')
const { createBot } = require('./botFactory')
const addressGen = require('../utils/addressGen')
const crypto = require('crypto')
const dbService = require('../database/databaseService')
const { getUser } = require('./userService')

const { BOT_TYPES } = require('../utils/config')
let { ROOM_DESIRED_USERCOUNT } = require('../utils/config')

// Callback functions should take the result as an argument

const getRooms = async (callback) => {
  const rooms = await dbService.getRooms()
  if(callback) callback(rooms)
  return rooms
}

// adds testrooms to database if there are no rooms, as the frontend will not work with an empty room array

const createTestRooms = (rooms) => {
  logger.info(rooms)
  logger.info(rooms.length)
  if(rooms.length < 2) {
    logger.info('Adding test rooms')
    dbService.saveRoomToDatabase({
      name: 'Test_Normal',
      roomLink: 'aaaaaaaaa',
      bot: testBotNormal,
      users: [],
      completed_users: [],
      messages: [],
      active: true,
      in_use: false
    })
    dbService.saveRoomToDatabase({
      name: 'Test_Troll',
      roomLink: 'bbbbbbbbb',
      bot: testBotTroll,
      users: [],
      completed_users: [],
      messages: [],
      active: true,
      in_use: false
    })
  }
}
getRooms(createTestRooms)


const getRoom = roomId => dbService.getRoomByLink(roomId)

const getRoomName = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.name
}
const getRoomLink = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.roomLinkBase
}
const getMessagesInRoom = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.messages
}
const getUsersInRoom = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.users
}
const getBot = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.bot
}
const isRoomActive = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return false 
  return foundRoom.active
}
const deleteRoom = async roomId => {
  await dbService.deleteRoom(roomId)
  return getRooms()
}

const getUserInRoom = (roomName, name) => {
  const existingRoom = getRoom(roomName)
  if (!existingRoom || !existingRoom.users) return
  return existingRoom.users.find(u => u.name === name)
}


const addUserIntoRoom = async (roomName, username) => {
  logger.info(`User '${username}' is trying to enter room '${roomName}`)
  const existingUser = await getUserInRoom(roomName, username)
  const existingRoom = await getRoom(roomName)
  const user = await getUser(username)
  if (!username || !roomName) return { error: 'Username and room are required.' }
  if (!existingRoom || existingRoom.length === 0) return { error: 'Room not found.' }
  if (existingUser) return { error: 'User is already in this room.' }

  await dbService.addUserToRoom(roomName, user._id)
  
  logger.info(`'users in room: '${await getUsersInRoom(roomName)}`)
  
  logger.info(`Adding user: '${user.username}' into room: '${existingRoom.name}'`)

  return user
}

const removeUserFromRoom = async (roomName, name) => {
  const existingRoom = await getRoom(roomName)
  const user = await getUser(name)
  if (!existingRoom || !user) return

  logger.info(`Removing ${user.name} from ${existingRoom}`)

  return await dbService.removeUserFromRoom(roomName, user._id)
}

const addUserToAllowed = async (roomId, user_id) => {
  dbService.addUserToAllowed(roomId, user_id)
}

const addMessage = async (roomName, message) => {
  const existingRoom = await getRoom(roomName)
  if (!existingRoom) return

  const msg = { room: roomName, ...message }
  logger.info('id?:', message.user.id)
  if(!message.user.id || message.user.id === undefined) return
  msg.user = message.user.id
  logger.info('Add message:', msg)

  await dbService.addMessage(roomName, msg)
  return msg
}

const addRoom = async room => {
  let roomCode = (room.roomLink !== undefined)? room.roomLink : addressGen.generate(9)
  let existingRoom = await dbService.findOneRoom({roomLink: roomCode})
  // In case generates an existing room code
  while (existingRoom) {
    roomCode = addressGen.generate(9)
    existingRoom = await dbService.findOneRoom({roomLink: roomCode})
  }

  const newRoom = { ...room, completed_users: ['bot'], roomLink: roomCode , active: false, in_use: true }

  const bot = createBot(room.botType)

  // Saves the room and the generated bot as a new user
  await dbService.saveUserToDatabase(bot)
  const bot_id = await dbService.getUserByName(bot.username)
  newRoom.bot = bot_id

  await dbService.saveRoomToDatabase(newRoom)

  await dbService.addUserToRoom(roomCode, bot.bot_id)


  logger.info('Added room:', newRoom)
  return newRoom
}

const autoCreateRoom = async () => {
  const randomInt = crypto.randomInt(BOT_TYPES.length)
  const newBotType = BOT_TYPES[randomInt]
  const roomCount = await dbService.roomCount()

  const newRoom = { name:  `Room ${roomCount + 1}`, botType: newBotType }
  
  return await addRoom(newRoom)
}

const getActiveRoom = async () => {
  // This can be optimised by requesting active rooms sorted by number of users and then selecting the first one

  // Check if there are active rooms with 2 people 
  let condition = {$and: [ {$eq:[{$size:'users'}, 2]}, {in_use: true}] }
  let roomCandidates = await dbService.findRooms(condition)
  
  if (roomCandidates.length > 0) return roomCandidates[0].roomLink

  // Check if there are active rooms with 1 person
  condition = {$and: [ {$eq:[{$size:'users'}, 1]}, {in_use: true}] }
  roomCandidates = await dbService.findRooms(condition)

  if (roomCandidates.length > 0) return roomCandidates[0].roomLink
  
  // else create new room
  return await autoCreateRoom().roomLink
}

const activateRoom = async roomCode => {
  const foundRoom = await getRoom(roomCode)
  // usercount + 1 for the bot
  if (!foundRoom || foundRoom.users.length < ROOM_DESIRED_USERCOUNT + 1) return false

  await dbService.updateRoomField(roomCode, {in_use: false})
  await dbService.updateRoomField(roomCode, {active: true})

  return true
}

const manageComplete = async (value, roomId) => {
  logger.info(`Task completion requested by ${value}`)
  const foundRoom = await getRoom(roomId)
  const completedUsers = foundRoom.completed_users
  logger.info(`${completedUsers.length} vs ${foundRoom.users.length}`)

  // returns true if the room has already completed its assignment
  if (completedUsers.length === foundRoom.users.length) return true
  // returns false if the user requesting has already requested completion
  if (!value || completedUsers.includes(value)) return false

  completedUsers.push(value) // I think this won't work
  logger.info(completedUsers.length)

  return completedUsers.length === foundRoom.users.length
}

const userAllowedIn = async (room_id, user_id) =>  {
  const condition = {_id: room_id, allowedUsers: {$elemMatch: {_id: user_id}}}
  
  const rooms = await dbService.findRooms(condition)
  return rooms && rooms.length > 0
}




module.exports = {
  addRoom,
  deleteRoom,
  getBot,
  getRooms,
  getRoom,
  addMessage,
  addUserIntoRoom,
  getMessagesInRoom,
  removeUserFromRoom,
  getUserInRoom,
  getUsersInRoom,
  getRoomName,
  getRoomLink,
  isRoomActive,
  autoCreateRoom,
  getActiveRoom,
  activateRoom,
  manageComplete,
  addUserToAllowed,
  userAllowedIn
}
