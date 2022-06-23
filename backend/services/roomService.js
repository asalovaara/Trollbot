const logger = require('../utils/logger')
var uuid = require('uuid')
const { createBot } = require('./botFactory')
const addressGen = require('../utils/addressGen')
const crypto = require('crypto')

const testBotNormal = {
  id: 'nbot',
  senderId: 'nbot',
  name: 'Normalbot',
  type: 'Normal',
}

const testBotTroll = {
  id: 'tbot',
  senderId: 'tbot',
  name: 'Trollbot',
  type: 'Troll',
}

let users = [testBotNormal, testBotTroll]

let rooms = [{
  id: 1,
  name: 'Test_Normal',
  roomLink: 'aaaaaaaaa',
  bot: testBotNormal,
  users: [testBotNormal],
  completed_users: [],
  messages: [],
  active: true,
  in_use: false
},
{
  id: 2,
  name: 'Test_Troll',
  roomLink: 'bbbbbbbbb',
  bot: testBotTroll,
  users: [testBotTroll],
  completed_users: [],
  messages: [],
  active: true,
  in_use: false
}
]

const getUsers = () => users

const getRooms = () => rooms

const getRoom = roomId => rooms.find(r => r.roomLink === roomId)

const getRoomName = roomId => {
  const foundRoom = getRoom(roomId)
  if (foundRoom === undefined) return undefined 
  return foundRoom.name
}
const getRoomLink = roomId => {
  const foundRoom = getRoom(roomId)
  if (foundRoom === undefined) return undefined 
  return foundRoom.roomLinkBase
}
const getMessagesInRoom = roomId => {
  const foundRoom = getRoom(roomId)
  if (foundRoom === undefined) return undefined 
  return foundRoom.messages
}
const getUsersInRoom = roomId => {
  const foundRoom = getRoom(roomId)
  if (foundRoom === undefined) return undefined 
  return foundRoom.users
}
const getBot = roomId => {
  const foundRoom = getRoom(roomId)
  if (foundRoom === undefined) return undefined 
  return foundRoom.bot
}
const isRoomActive = roomId => {
  const foundRoom = getRoom(roomId)
  if (foundRoom === undefined) return false 
  return foundRoom.active
}
const deleteRoom = roomName => {
  rooms = rooms.filter(r => r.name !== roomName)
  return rooms
}
const addUserIntoRoom = (senderId, roomName, name) => {
  const existingUser = getUserInRoom(roomName, name)
  const existingRoom = getRoom(roomName)

  if (!name || !roomName) return { error: 'Username and room are required.' }
  if (!existingRoom || existingRoom.length === 0) return { error: 'Room not found.' }
  if (existingUser) return { error: 'User is already in this room.' }

  const user = { id: uuid.v4(), senderId, name }

  existingRoom.users.push(user)

  logger.info(`Adding user: '${user.name}' into room: '${getRoomName(roomName)}'`)

  return user
}

const removeUserFromRoom = (roomName, name) => {
  const existingRoom = getRoom(roomName)
  if (!existingRoom) return

  logger.info(`Removing ${name} from ${existingRoom}`)

  const roomUsers = existingRoom.users
  const index = roomUsers.findIndex((user) => user.name === name)

  if (index !== -1) return roomUsers.splice(index, 1)[0]
}

const getUserInRoom = (roomName, name) => {
  const existingRoom = getRoom(roomName)
  if (!existingRoom || !existingRoom.users) return
  return existingRoom.users.find(u => u.name === name)
}

const addMessage = (roomName, message) => {
  const existingRoom = getRoom(roomName)
  if (!existingRoom) return

  const msg = { id: uuid.v4(), room: roomName, ...message }
  logger.info('Add message:', msg)

  existingRoom.messages.push(msg)
  return msg
}

const addRoom = room => {
  let roomCode = addressGen.generate(9)

  // In case generates an existing room code
  while (rooms.find(r => r.roomLink === roomCode) !== undefined) {
    roomCode = addressGen.generate(9)
  }
	
  const newRoom = { ...room, id: rooms.length + 1, users: [], messages: [], completed_users: ['bot'], roomLink: roomCode , active: false, in_use: true }

  const bot = createBot(room.botType)
  
  newRoom.bot = bot
  newRoom.users.push(bot)
  users.push(bot)

  logger.info('Added room:', newRoom)
  rooms.push(newRoom)
  return newRoom
}

const autoCreateRoom = () => {
  const randomInt = crypto.randomInt(2)
  const newBotType = (randomInt === 0)? 'Normal' : 'Troll'
  const newRoom = { name:  `Room ${rooms.length + 1}`, botType: newBotType }
  
  return addRoom(newRoom)
}

const getActiveRoom = () => {
  let roomCandidates = rooms.filter(r => r.users.length === 2 && r.in_use)
  if (roomCandidates.length > 0) return roomCandidates[0].roomLink

  roomCandidates = rooms.filter(r => r.users.length === 1 && r.in_use)
  if (roomCandidates.length > 0) return roomCandidates[0].roomLink
  
  return autoCreateRoom().roomLink
}

const activateRoom = roomCode => {
  const foundRoom = getRoom(roomCode)

  if (foundRoom === undefined || foundRoom.users.length < 3) return false
  foundRoom.in_use = false
  foundRoom.active = true
  return true
}

const manageComplete = (value, roomId) => {
  logger.info(`Task completion requested by ${value}`)
  const foundRoom = getRoom(roomId)
  const completedUsers = foundRoom.completed_users
  logger.info(`${completedUsers.length} vs ${foundRoom.users.length}`)
  if (completedUsers.length === foundRoom.users.length) return true
  if (!value || completedUsers.includes(value)) return false

  completedUsers.push(value)
  logger.info(completedUsers.length)

  return completedUsers.length === foundRoom.users.length
}

const addUser = (senderId, name, room) => {
  if (!name) return { error: 'Username and room are required.' }

  const existingUser = users.find(u => u.name === name)
  if (existingUser) return existingUser

  const user = { id: users.length + 1, senderId, name, room }
  users = users.concat(user)

  return user
}

// Will create a new user if none is found with username.
const login = username => {
  const user = users.find(u => u.name.toLowerCase() == username.toLowerCase())

  if (user === undefined) {
    const newUser = {
      id: users.length + 1,
      name: username,
    }
    users = users.concat(newUser)
    return newUser
  }
  return user
}



module.exports = {
  login,
  addUser,
  addRoom,
  deleteRoom,
  getBot,
  getUsers,
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
  manageComplete
}
