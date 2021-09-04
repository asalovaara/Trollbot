const logger = require('../utils/logger')
var uuid = require('uuid')
const { createBot } = require('./botFactory')

const testBot = {
  id: 'bot',
  senderId: 'bot',
  name: 'Test Bot',
  type: 'Troll',
}

let users = [testBot,]

let rooms = [{
  id: 1,
  name: 'Test',
  bot: testBot,
  users: [testBot],
  messages: []
},]

const getUsers = () => users

const getRooms = () => rooms

const getRoom = roomName => rooms.find(r => r.name === roomName)

const deleteRoom = roomName => {
  rooms = rooms.filter(r => r.name !== roomName)
  return rooms
}
const getMessagesInRoom = roomName => rooms.find(r => r.name === roomName).messages

const getUsersInRoom = roomName => rooms.find(r => r.name === roomName).users

const getBot = (roomName) => {
  const foundRoom = getRoom(roomName)
  if (foundRoom === undefined) return
  return foundRoom.bot
}

const addUserIntoRoom = (senderId, roomName, name) => {
  const existingUser = getUserInRoom(roomName, name)
  const existingRoom = getRoom(roomName)

  if (!name || !roomName) return { error: 'Username and room are required.' }
  if (!existingRoom) return { error: 'Room not found.' }
  if (existingUser) return { error: 'User is already in this room.' }

  const user = { id: uuid.v4(), senderId, name }

  existingRoom.users.push(user)

  logger.info(`Adding user: '${user.name}' into room: '${roomName}'`)

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
  if (!existingRoom) return
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
  const newRoom = { ...room, id: rooms.length + 1, users: [], messages: [] }

  const bot = createBot(room.botType)

  newRoom.bot = bot
  newRoom.users.push(bot)
  users.push(bot)

  logger.info('Added room:', newRoom)
  rooms.push(newRoom)
  return newRoom
}

const addUser = (senderId, name, room) => {
  if (!name) return { error: 'Username and room are required.' }

  const existingUser = users.find(u => u.name === name)
  if (existingUser) return existingUser

  const user = { id: users.length + 1, senderId, name, room }
  users = users.concat(user)

  return user
}

// Will create new user if none if found with username
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
  getUsersInRoom
}
