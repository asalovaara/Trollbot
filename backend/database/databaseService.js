const User = require('../models/user')
const Artist = require('../models/artist')
const Room = require('../models/room')
const logger = require('../utils/logger')
const mongoose = require('mongoose')

// USER

const getUsers = async () => {
  const users = await User.find()
  return [...users]
}

const findOneUser = async condition => {
  return await User.findOne(condition)
}

const findUsers = async condition => {
  return await User.find(condition)
}

const userCount = async () => {
  return await User.countDocuments({})
}

const saveUserToDatabase = async (user) => {

  // Quick check that the user doesn't exist with a different pid (move elsewhere?) 
  if(user.pid) {
    const pidUser = await User.findOne({username: user.name, pid: user.pid})
    const nameUser = await User.findOne({username: user.name})
    logger.info('saveUsertodatabase:', pidUser, nameUser)
    if (pidUser !== nameUser) {
      logger.info('User by that name already exists')
      return 
    }
  }

  const userModel = new User({
    username: `${(user.username)? user.username : user.name}`,
    name: user.name,
    senderId: user.senderId,
    pid: user.pid
  })
  return await userModel.save()
}

const getUserByName = async (username) => {
  return await User.findOne({ username: username })
}

const deleteUser = async (username) => {
  return await User.deleteOne({ username: username })
}
// add update senderId to entering room
// should senderId be in the database at all?

// ROOM

const getRooms = async () => {
  const rooms = await Room.find().populate('users')
  return [...rooms]
}

const saveRoomToDatabase = async (room) => {
  const roomModel = new Room({
    name: room.name,
    roomLink: room.roomLink,
    botType: room.botType,
    bot: room.bot,
    completed_users: room.completed_users,
    active: room.active,
    in_use: room.in_use
  })
  return await roomModel.save()
}

const getRoomByName = async (roomName) => {
  return await (await Room.findOne({ name: roomName })).populate(['users', 'bot'])
}

const getRoomByLink = async (roomId) => {
  return await Room.findOne({ roomLink: roomId }).populate('users')
}

const findOneRoom = async condition => {
  return await Room.findOne(condition)
}

const findRooms = async condition => {
  return await Room.find(condition)
}

const roomCount = async () => {
  return await Room.countDocuments({})
}

const deleteRoom = async (roomId) => {
  return await Room.deleteOne({ roomLink: roomId })
}

// should not be used for arrays
const updateRoomField = async (roomId, update) => {
  return await Room.findOneAndUpdate({roomLink: roomId}, update, { new: true })
}

const addUserToRoom = async (roomId, user_Id) => {
  await Room.updateOne(
    {'roomLink': roomId},
    {'$push': {'users': user_Id}}
  )
}

const removeUserFromRoom = async (roomId, user_Id) => {
  await Room.updateOne(
    {'roomLink': roomId},
    {'$pull': {'users': user_Id}}
  )
}

const addUserToAllowed = async (roomId, user_Id) => {
  await Room.updateOne(
    {'roomLink': roomId},
    {'$push': {'allowedUsers': user_Id}}
  )
}

const removeUserFromAllowed = async (roomId, user_Id) => {
  await Room.updateOne(
    {'roomLink': roomId},
    {'$pull': {'allowedUsers': user_Id}}
  )
}

const addMessage = async (roomId, message) => {
  message.user = mongoose.Types.ObjectId(message.user)
  logger.info('The add message message: ', message)
  await Room.updateOne(
    {'roomLink': roomId},
    {'$push': {'messages': message}}
  )
  logger.info(await getRoomByLink(roomId))
}

const deleteMessage = async (roomId, message) => {
  await Room.updateOne(
    {'roomLink': roomId},
    {'$pull': {'messages': message}}
  )
}

// ARTIST

const saveArtistToDatabase = async (artist) => {
  const artistModel = new Artist({
    professionalName: artist.professionalName,
    firstName: artist.firstName,
    lastName: artist.lastName,
    gender: artist.gender,
    genres: artist.genres,
    area: artist.area,
    begin: artist.begin,
    end: artist.end
  })
  return await artistModel.save()
}

// Added regex to make the search case insensitive? Revert if does not work
const getArtistByName = async (name) => {
  return await Artist.findOne({ professionalName: { $regex: new RegExp(name, 'i')} })
}

const updateArtist = async(professionalName, artist) => {
  return await Artist.findOneAndUpdate(professionalName, artist)
}

const addGenreToArtist = async (professionalName, genre) => {
  return await Artist.findByIdAndUpdate(professionalName, { $push: { genres: genre } }, { new: true })
}

const deleteAllArtists = async () => {
  return await Artist.deleteMany( {} )
}

module.exports = {
  getUsers,
  saveUserToDatabase,
  saveRoomToDatabase,
  saveArtistToDatabase,
  getUserByName,
  getArtistByName,
  updateArtist,
  addGenreToArtist,
  deleteAllArtists,
  getRoomByName,
  getRoomByLink,
  getRooms,
  deleteRoom,
  addUserToRoom,
  removeUserFromRoom,
  addMessage,
  deleteUser,
  deleteMessage,
  findOneUser,
  findUsers,
  findOneRoom,
  findRooms,
  userCount,
  roomCount,
  addUserToAllowed,
  removeUserFromAllowed,
  updateRoomField
}
