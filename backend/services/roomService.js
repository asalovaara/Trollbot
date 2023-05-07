const logger = require('../utils/logger')
const { createBot } = require('./botFactory')
const addressGen = require('../utils/addressGen')
const crypto = require('crypto')
const dbService = require('../database/databaseService')
const { getUser } = require('./userService')

const { BOT_TYPES } = require('../utils/config')
const { ROOM_DESIRED_USERCOUNT } = require('../utils/config')

/*
 * This file has all of the functions related to managing rooms.
 */

let redirectPoint = ROOM_DESIRED_USERCOUNT

// Callback functions should take the result as an argument

const getRooms = async (callback) => {
  const rooms = await dbService.getRooms()
  if(callback) await callback(rooms)
  return rooms
}

// adds testrooms to database if there are no rooms, as the frontend will not work with an empty room array

const createTestRooms = async (rooms) => {
  if(rooms && rooms.length < 2) {
    logger.info('Adding test rooms')
    await dbService.saveRoomToDatabase({
      name: 'Test_Normal',
      roomLink: 'aaaaaaaaa',
      botType: 'Normal',
      //bot: testBotNormal,  Add later when autogenerating bot users
      users: [],
      completed_users: [],
      messages: [],
      active: true,
      in_use: false
    })
    await dbService.saveRoomToDatabase({
      name: 'Test_Troll',
      roomLink: 'bbbbbbbbb',
      botType: 'Troll',
      // bot: testBotTroll,  Add later when autogenerating bot users
      users: [],
      completed_users: [],
      messages: [],
      active: true,
      in_use: false
    })
  }
}
getRooms(createTestRooms)


// Getters for various things

const getRoom = async roomId => await dbService.getRoomByLink(roomId)

// getRoom, but includes bot information 
const getRoomWithBot = async roomId => await dbService.getRoomWithBot(roomId)

const getMessagesInRoom = async roomId => {
  const foundRoom = await dbService.getRoomWithMessageUsers(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.messages
}

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

const getUsersInRoom = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.users
}
const getBot = async roomId => {
  const foundRoom = await getRoomWithBot(roomId)
  if (!foundRoom || foundRoom === undefined) return undefined 
  return foundRoom.bot
}

// checks if room is active
const isRoomActive = async roomId => {
  const foundRoom = await getRoom(roomId)
  if (!foundRoom || foundRoom === undefined) return false 
  return foundRoom.active
}

// deletes given room
const deleteRoom = async roomId => {
  await dbService.deleteRoom(roomId)
  return getRooms()
}

const getUserInRoom = async (roomName, name) => {
  const existingRoom = await getRoom(roomName)
  if (!existingRoom || !existingRoom.users) return
  return existingRoom.users.find(u => u.name === name) // gets with name instead of username
}

// Room model has seperate user count field that needs to be occasitionally updated.

// Updates the usercount value in room
const updateRoomUserCount = async (roomId) => {
  const users = await getUsersInRoom(roomId)
  const newVal = users.length
  
  await dbService.updateRoomField(roomId, {userCount: newVal})
}

// Gets room while updating the usercount 
const getRoomUpdateFunction = async (roomId) => {
  // to make it easier to update rooms in callback functions
  return async () => {
    logger.info('callback roomId?')
    const users = await getUsersInRoom(roomId)
    const newVal = users.length
  
    await dbService.updateRoomField(roomId, {userCount: newVal})
  }
}

// There is some naming inconsistensies with some variables

/** Adds given user into the room
 * @param {*} roomId room id
 * @param {*} username username of user to be added
 * @returns 
 */

const addUserIntoRoom = async (roomId, username) => {
  logger.info(`User '${username}' is trying to enter room '${roomId}`)
  const existingUser = await getUserInRoom(roomId, username)
  const existingRoom = await getRoom(roomId)
  const user = await getUser(username)
  if (!username || !roomId) return { error: 'Username and room are required.' }
  if (!existingRoom || existingRoom.length === 0) return { error: 'Room not found.' }
  if (existingUser) return { error: 'User is already in this room.' }

  const callback = getRoomUpdateFunction(roomId)
  await dbService.addValueToArrayIfMissing(roomId, user._id, 'users', callback)
  
  logger.info(`'users in room: '${await getUsersInRoom(roomId)}`)
  
  logger.info(`Adding user: '${user.username}' into room: '${existingRoom.name}'`)

  return user
}

/** Removes given user into the room
 * @param {*} roomId room id
 * @param {*} name username of user to be added
 * @returns 
 */
const removeUserFromRoom = async (roomId, name) => {
  const existingRoom = await getRoom(roomId)
  const user = await getUser(name)
  if (!existingRoom || !user) return
  logger.info(`Removing ${user.name} from ${existingRoom}`)

  const callback = getRoomUpdateFunction(roomId)

  return await dbService.removeValueFromArray(roomId, user._id, 'users', callback)
}

/** Adds given user into allowed users
 * @param {*} roomId room id
 * @param {*} user_id users mongoose _id 
 * @returns 
 */
const addUserToAllowed = async (roomId, user_id) => {
  dbService.addValueToArrayIfMissing(roomId, user_id, 'allowedUsers')
}

/** Adds message to rooms messages
 * @param {*} roomId room id
 * @param {*} message the message 
 * @returns 
 */
const addMessage = async (roomId, message) => {
  const existingRoom = await getRoom(roomId)
  if (!existingRoom) return

  const msg = { room: roomId, ...message }
  if(!message.user || !message.user.id || message.user.id === undefined) return
  msg.user = message.user.id
  logger.info('Add message:', msg)

  await dbService.addMessage(roomId, msg)
  return { room: roomId, ...message }
}

/** Adds message to rooms messages
 * @param {*} room room object
 * @returns 
 */

const addRoom = async room => {
  let roomCode = (room.roomLink !== undefined)? room.roomLink : addressGen.generate(9)
  let existingRoom = await dbService.findOneRoom({roomLink: roomCode})
  // In case generates an existing room code
  while (existingRoom) {
    roomCode = addressGen.generate(9)
    existingRoom = await dbService.findOneRoom({roomLink: roomCode})
  }

  const newRoom = { ...room, completed_users: ['default'], roomLink: roomCode , active: false, in_use: true }

  const bot = await createBot(room.botType)
  logger.info('bot info:', bot)
  // Saves the room and the generated bot as a new user
  await dbService.saveUserToDatabase(bot)
  const bot_id = await dbService.getUserByName(bot.username)
  newRoom.bot = bot_id
  logger.info('addroom newRoom bot:', newRoom.bot)
  
  const callback = getRoomUpdateFunction(roomCode)

  await dbService.saveRoomToDatabase(newRoom)
  await dbService.addValueToArray(roomCode, bot_id, 'users', callback)

  logger.info('Added room:', newRoom)
  return newRoom
}

/** Automatically creates a room
 * @returns the new room
 */
const autoCreateRoom = async () => {
  const randomInt = crypto.randomInt(BOT_TYPES.length)
  const newBotType = BOT_TYPES[randomInt]
  const roomCount = await dbService.roomCount()

  const newRoom = { name:  `Room ${roomCount + 1}`, botType: newBotType }
  
  return await addRoom(newRoom)
}


const getActiveRoom = async () => {
  // This can be optimised by requesting active rooms sorted by number of users and then selecting the first one

  // Get an in-use room with most users 
  let condition = {in_use: true}
  let roomCandidate = await dbService.findOneRoomWithHighestField('userCount', condition)
  logger.info('roomCandidate:', roomCandidate)
  if (roomCandidate) return roomCandidate.roomLink

  // else create new room
  const autocreatedRoom = await autoCreateRoom()
  return autocreatedRoom.roomLink
}

/** Activates room if room has enough users
 * @param {*} roomCode room id
 * @returns boolean on whether the room was activated successfully
 */
const activateRoom = async roomCode => {
  const foundRoom = await getRoom(roomCode)
  // usercount + 1 for the bot
  logger.info('users in room:', foundRoom.users.length, 'compared to', Number(redirectPoint) + 1)
  if (!foundRoom || foundRoom.users.length < Number(redirectPoint) + 1) return false
  logger.info('Activating room')
  await dbService.updateRoomField(roomCode, {in_use: false})
  await dbService.updateRoomField(roomCode, {active: true})

  return true
}

/** Adds the value (completing user's info) to the completed, and checks if the room is ready to complete the task
 * @param {*} value the value used to complete
 * @param {*} roomId room id
 * @returns boolean on whether the task is complete
 */
const manageComplete = async (value, roomId) => {
  logger.info(`Task completion requested by ${value}`)
  let foundRoom = await getRoom(roomId)

  // returns true if the room has already completed its assignment
  if (foundRoom.completed_users.length === foundRoom.users.length) return true
  logger.info('Validating check..')
  // returns false if the user requesting has already requested completion
  if (!value || foundRoom.completed_users.includes(value)) return false
  logger.info('Adding complete..')

  await dbService.addValueToArrayIfMissing(roomId, value, 'completed_users')

  foundRoom = await getRoom(roomId)
  logger.info(`${foundRoom.completed_users.length} vs ${foundRoom.users.length}`)

  return foundRoom.completed_users.length === foundRoom.users.length
}

/** Checks whether the user is allowed into the room
 * @param {*} room_id Rooms mongoose _id
 * @param {*} user_id Users mongoose _id
 * @returns boolean on whether the task is complete
 */
const userAllowedIn = async (room_id, user_id) =>  {
  const condition = {_id: room_id, allowedUsers: {$elemMatch: {_id: user_id}}}
  
  const rooms = await dbService.findRooms(condition)
  return rooms && rooms.length > 0
}

// gets the room size
const getRoomSize = async () => {
  return redirectPoint
}

// sets the room size
const setRoomSize = async size => {
  redirectPoint = size
  logger.info('Redirection point changed:', redirectPoint)
  return redirectPoint
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
  userAllowedIn,
  getRoomSize,
  setRoomSize,
  updateRoomUserCount
}
