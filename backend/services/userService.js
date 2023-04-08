const logger = require('../utils/logger')
const dbService = require('../database/databaseService')

const config = require('config')

/*
 * This file contains all the functions related to managing users.
 */

// Getters

// Callback functions should take the result as an argument

const getUsers = async (callback) => {
  const users = await dbService.getUsers()
  if(callback) callback(users)
  return users
}

const getUser = userName => dbService.getUserByName(userName)

// This creates an admin user if it does not exist. Requires admin info in 'config/local.yaml'-file
const autoCreateAdminUser = async () => {

  if(!config.has('Admin')) {
    logger.error('No admin define file found, please define the Admin user in a "local.yaml"-file in the "config"-directory.')
    return
  }

  const defaultAdminUsername = 'Admin'
  const adminUser = getUser(defaultAdminUsername)

  if (!adminUser) {
    logger.info('Admin user not found, generating...')

    const adminInfo = config.get('Admin')

    const newUser = {
      name: 'Admin',
      senderId: 'placeholder',
      pid: adminInfo.password
    }

    await dbService.saveUserToDatabase(newUser)

  }
  
  logger.info('Admin user confirmed with no issues')
}
// runs autocreation
autoCreateAdminUser()

// Gets users senderid 
// SenderId is maybe not very necessary anymore. It existed to identify users before there was a real user system, but user Id could be used instead.
// Actually not sure if the placeholder value is ever replaced with the database.
const getSenderId = userName => {
  const foundUser = getUser(userName)
  if (foundUser === undefined) return undefined 
  return foundUser.senderId
}

// deletes user
const deleteUser = userName => {
  dbService.deleteUser(userName)
  return getUsers()
}


 // Logs user in with given login information
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
  getUsers,
  deleteUser,
  getSenderId,
  getUser,
}
