const logger = require('../utils/logger')
var uuid = require('uuid')
const { createBot } = require('./botFactory')
const addressGen = require('../utils/addressGen')
const crypto = require('crypto')
const dbService = require('../database/databaseService')

// Callback functions should take the result as an argument

const getUsers = async (callback) => {
  const users = await dbService.getUsers()
  if(callback) callback(users)
  return users
}

const getUser = userName => dbService.getUserByName(userName)

const getSenderId = userName => {
  const foundUser = getUser(userName)
  if (foundUser === undefined) return undefined 
  return foundUser.senderId
}

const deleteUser = userName => {
  dbService.deleteUser(userName)
  return getUsers()
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
const login = async username => {
  const user = await dbService.getUserByName(username)
  if (!user || user === undefined) {
    const newUser = {
      name: username,
      senderId: 'placeholder'
    }
    logger.info(newUser)
    await dbService.saveUserToDatabase(newUser)
    return await dbService.getUserByName(username)
  }
  return user
}



module.exports = {
  login,
  addUser,
  getUsers,
  deleteUser,
  getSenderId,
  getUser
}
