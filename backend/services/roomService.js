/* eslint-disable no-unused-vars */
const logger = require('../utils/logger')
var uuid = require('uuid')
const { getRasaRESTResponse } = require('./rasaService')
const { getUser } = require('./userService')

let rooms = [{
  roomId: 123,
  name: 'Test',
  users: [{ name: 'Testuser', id: 123 }, { name: 'Removeme', id: 321 }],
  messages: [{ user: 'Testuser', room: 'Test', id: 123, body: 'Testmessage' },]
}]

const getRoom = (room) => rooms.find(r => r.name === room)

const addUserIntoRoom = (senderId, roomName, name) => {

  const existingUser = getUserInRoom(roomName, name)

  if (!name || !roomName) return { error: 'Username and room are required.' }
  if (existingUser) return { error: 'User is already in this room.' }

  const user = { id: uuid.v4(), senderId, name }

  logger.info(`Add user:${user} into room:${roomName}`)

  // ! This function needs to be fixed !
  // setRasaUsersSlot(room, user)

  return user
}


const removeUserFromRoom = (roomName, id) => {
  console.log('Trying to remove user', id)
  const existingRoom = rooms.find(r => r.name === roomName)
  if (!existingRoom) return
  console.log('Found room', existingRoom)
  const users = existingRoom.users
  const index = users.findIndex((user) => user.id === id)
  console.log('remove index', index, users[index])
  if (index !== -1) return users.splice(index, 1)[0]
}

const getUserInRoom = (roomName, name) => {
  const existingRoom = rooms.find(r => r.name === roomName)
  if (!existingRoom) return
  return existingRoom.users.find(u => u.name === name)
}

const addMessage = (roomName, message) => {
  const existingRoom = rooms.find(r => r.name === roomName)
  if (!existingRoom) return

  const msg = { id: uuid.v4(), room: roomName, ...message }
  logger.info('addMessage', roomName, message)

  existingRoom.messages.push(msg)
  return msg
}

const getMessageInRoom = (roomName) => rooms.find(r => r.name === roomName)?.messages

const getUsersInRoom = (roomName) => rooms.find(r => r.name === roomName)?.users

const getAnswer = async (data) => {
  const response = await getRasaRESTResponse(data)

  logger.info('Rasa Rest Response', response)

  let responses = []

  for (let i = 0; i < response.length; i++) {
    const msg = {
      id: 'botanswerid' + (response[i].id + i),
      room: 'Test',
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

module.exports = {
  getRoom,
  addMessage,
  getAnswer,
  addUserIntoRoom,
  getMessageInRoom,
  removeUserFromRoom,
  getUserInRoom,
  getUsersInRoom
}
