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
  roomLinkBase: 'aaaaaa',
  acceptedEnds: [ 'aaa', 'aab' ],
  bot: testBotNormal,
  users: [testBotNormal],
  messages: [],
  active: true,
  in_use: false
},
{
  id: 2,
  name: 'Test_Troll',
  roomLinkBase: 'bbbbbb',
  acceptedEnds: [ 'bbb', 'bba' ],
  bot: testBotTroll,
  users: [testBotTroll],
  messages: [],
  active: true,
  in_use: false
}
]

const getUsers = () => users

const getRooms = () => rooms

const getRoom = roomName => {
	if (roomName.length != 9) {
		logger.error('Roomname length error')
		return undefined
	}

	roomCode = roomName.substring(0, 6)
	userCode = roomName.substring(6)
	room = rooms.find(r => r.roomLinkBase === roomCode)

	if(room === undefined || !room.acceptedEnds.includes(userCode)) {
		logger.error('Invalid address in getRoom')
		return undefined
	}

	return room
}

const getRoomName = roomCode => {
  const foundRoom = getRoom(roomCode)
  if(foundRoom === undefined) return ''
  return foundRoom.name
}

const getRoomLinkBase = roomCode => {
  const foundRoom = getRoom(roomCode)
  if(foundRoom === undefined) return ''
  return foundRoom.roomLinkBase
}

const deleteRoom = roomName => {
  rooms = rooms.filter(r => r.name !== roomName)
  return rooms
}
const getMessagesInRoom = roomName => {
   const foundRoom = getRoom(roomName)

	if(foundRoom === undefined) return undefined

	return foundRoom.messages
}

const getUsersInRoom = roomName => {
    const foundRoom = getRoom(roomName)

    if(foundRoom === undefined) return undefined

	return foundRoom.users
}

const getBot = roomName => {
  const foundRoom = getRoom(roomName)
  if (foundRoom === undefined) return
  return foundRoom.bot
}

const isRoomActive = roomId => {
  foundRoom = getRoom(roomId)
  if (foundRoom === undefined || foundRoom.active === undefined) return false
  return foundRoom.active
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
  let roomCode = addressGen.generate(6)

  // In case generates an existing room code
  while (rooms.find(r => r.roomLinkBase === roomCode) !== undefined) {
	roomCode = addressGen.generate(6)
  }
	
  const newRoom = { ...room, id: rooms.length + 1, users: [], messages: [], roomLinkBase: roomCode , acceptedEnds: [addressGen.generate(3)], active: false, in_use: true }

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

  const getSelectedRoomLink = (selectedRoom) => {
    const roomLinks = getValidLinks(selectedRoom.roomLinkBase)

    return roomLinks[0]
  }

  let roomCandidates = rooms.filter(r => r.users.length === 2 && r.in_use === true)
  if (roomCandidates.length > 0) return getSelectedRoomLink(roomCandidates[0])

  roomCandidates = rooms.filter(r => r.users.length === 1 && r.in_use === true)
  if (roomCandidates.length > 0) return getSelectedRoomLink(roomCandidates[0])
  
  return getSelectedRoomLink(autoCreateRoom())

}



const addRoomEnd = roomCode => {

	existingRoom = rooms.find(r => r.roomLinkBase === roomCode)
	logger.info("Adding a new room ending")
	let userCode = addressGen.generate(3)

	// In case generates an existing user code
    while (existingRoom.acceptedEnds.includes(userCode)) {
		userCode = addressGen.generate(3)
	}
	logger.info("Added " + userCode)
	existingRoom.acceptedEnds.push(userCode)
	
	return existingRoom.roomLinkBase + userCode
}

const getValidLinks = roomCode => {
	logger.info("Getting links for code " + roomCode)
	const existingRoom = rooms.find(r => r.roomLinkBase === roomCode)
    if(existingRoom === undefined) return undefined
    
    const linkList = [...existingRoom.acceptedEnds]

	for (let i = 0; i < linkList.length; i++) {
		linkList[i] = existingRoom.roomLinkBase + linkList[i];
	}

    logger.info(linkList)
	return linkList
}

const activateRoom = roomCode => {
  const foundRoom = getRoom(roomCode)

  if (foundRoom === undefined || foundRoom.users.length < 3) return false
  foundRoom.active = true
  return true
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
  addRoomEnd,
  getValidLinks,
  getRoomName,
  getRoomLinkBase,
  isRoomActive,
  autoCreateRoom,
  getActiveRoom,
  activateRoom
}
