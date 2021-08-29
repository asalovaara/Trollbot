/* eslint-disable no-unused-vars */
const logger = require('../utils/logger')
var uuid = require('uuid')
const { setRasaUsersSlot, getRasaRESTResponse } = require('./rasaService')

// let users = [{ name: 'Testuser', id: 1 }, { name: 'Removeme', id: 2 },]
let users = []

let rooms = [{
  id: 1,
  name: 'Test',
  users: [],
  messages: []
}]

const getUsers = () => users

const getRooms = () => rooms

const getRoom = (room) => rooms.find(r => r.name === room)

const getMessagesInRoom = (roomName) => {
  return rooms.find(r => r.name === roomName).messages
}

const getUsersInRoom = (roomName) => {
  return rooms.find(r => r.name === roomName).users
}

const addUserIntoRoom = (senderId, roomName, name) => {
  const existingUser = getUserInRoom(roomName, name)
  const existingRoom = getRoom(roomName)

  if (!name || !roomName) return { error: 'Username and room are required.' }
  if (!existingRoom) return { error: 'Room not found.' }
  if (existingUser) return { error: 'User is already in this room.' }

  const room = roomName
  const user = { id: uuid.v4(), senderId, name, room }
  logger.info('addUser:user', user)
  // const user = addUser(senderId, name, roomName)
  // user.room = roomName

  existingRoom.users.push(user)

  logger.info(`Adding user: '${user.name}' into room: '${roomName}'`)

  setRasaUsersSlot(roomName, existingRoom.users)

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

const addRoom = (room) => {
  const newRoom = { ...room, id: rooms.length + 1, users: [], messages: [] }
  logger.info('Added room:', newRoom)
  rooms.push(newRoom)
  return newRoom
}

const getAnswer = async (roomName, data) => {
  let responses = []
  const response = await getRasaRESTResponse(data)

  for (let i = 0; i < response.length; i++) {
    const msg = {
      id: 'botanswerid' + (response[i].id + i),
      room: roomName,
      senderId: 'bot',
      body: response[i].text,
      user: {
        id: 'bot',
        name: 'Bot'
      }
    }
    responses.push(msg)
  }
  return responses
}

const addUser = (senderId, name, room) => {
  if (!name) return { error: 'Username and room are required.' }

  const existingUser = users.find((u) => u.name === name)
  if (existingUser) return existingUser

  const user = { id: users.length + 1, senderId, name, room }
  // const user = { id: users.length + 1, name, room }
  users = users.concat(user)
  return user
}

const login = (username) => {
  const user = users.find(u => u.name.toLowerCase() == username.toLowerCase())

  if (user == undefined) {
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
  getUsers,
  getRooms,
  getRoom,
  addMessage,
  getAnswer,
  addUserIntoRoom,
  getMessagesInRoom,
  removeUserFromRoom,
  getUserInRoom,
  getUsersInRoom
}
