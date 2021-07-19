const logger = require('../utils/logger')
var uuid = require('uuid')

let users = [{
  id: 'bot',
  name: 'Bot',
  room: 'Test'
}]

const login = (username) => {
  const user = users.find(u => u.name.toLowerCase() == username.toLowerCase())

  if (user == undefined) {
    const newUser = {
      id: uuid.v4(),
      name: username,
    }
    users = users.concat(newUser)

    logger.info('New user', newUser)
    return newUser
  }

  logger.info('Found user', user)
  return user
}

const addUser = (id, room, name) => {
  const existingUser = users.find((u) => u.room === room && u.name === name)

  if (!name || !room) return { error: 'Username and room are required.' }
  if (existingUser) return { error: 'Username is taken.' }

  const user = { id, name, room }

  users = users.concat(user)

  return { id, name: user.name }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) return users.splice(index, 1)[0]
}

const getUser = (id) => users.find((user) => user.id === id)

const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = { login, addUser, removeUser, getUser, getUsersInRoom }
