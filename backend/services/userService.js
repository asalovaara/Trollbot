const logger = require('../utils/logger')
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
const login = async loginInfo => {
  logger.info('login info: ', loginInfo)
  const username = loginInfo.name
  const pid = loginInfo.pid

  const condition = {username: username, pid: pid}
  const user = await dbService.findOneUser(condition)
  if (!user || user === undefined) {
    const newUser = {
      name: username,
      senderId: 'placeholder',
      pid: pid
    }
    logger.info('User set to log in: ', newUser)
    await dbService.saveUserToDatabase(newUser)
    return await dbService.findOneUser(condition)
  }
  return user
}

module.exports = {
  login,
  addUser,
  getUsers,
  deleteUser,
  getSenderId,
  getUser,
}
