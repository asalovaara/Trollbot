const User = require('../models/user')
const Artist = require('../models/artist')
const Room = require('../models/room')
const logger = require('../utils/logger')
const mongoose = require('mongoose')

/*
 * This file contains all the database-access functions
 */

// USER

const getUsers = async (callback) => {
  const users = await User.find().exec(callback)
  return [...users]
}

const findOneUser = async (condition, callback) => {
  return await User.findOne(condition).exec(callback)
}

const findUsers = async (condition, callback) => {
  return await User.find(condition).exec(callback)
}

const userCount = async (callback) => {
  return await User.countDocuments({}).exec(callback)
}

const saveUserToDatabase = async (user) => {

  // Quick check that the user doesn't exist with a different pid (move elsewhere?) 
  if(user.pid && user.pid !== undefined) {
    logger.info('pid:', user.pid)
    const nameUser = await User.findOne({username: user.name})
    logger.info('saveUsertodatabase:', nameUser)
    if (nameUser && nameUser.pid && user.pid !== nameUser.pid) {
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

const getUserByName = async (username, callback) => {
  return await User.findOne({ username: username }).exec(callback)
}

const deleteUser = async (username, callback) => {
  return await User.deleteOne({ username: username }).exec(callback)
}
// add update senderId to entering room
// should senderId be in the database at all?

// ROOM

const getRooms = async (callback) => {
  const rooms = await Room.find().populate('users').exec(callback)
  return [...rooms]
}

const saveRoomToDatabase = async (room) => {
  const roomModel = new Room({
    name: room.name,
    roomLink: room.roomLink,
    botType: room.botType,
    bot: room.bot,
    completed_users: room.completed_users,
    userCount: 0,
    active: room.active,
    in_use: room.in_use
  })
  return await roomModel.save()
}

const getRoomByName = async (roomName, callback) => {
  return await Room.findOne({ name: roomName }).populate(['users']).exec(callback)
}

const getRoomByLink = async (roomId, callback) => {
  return await Room.findOne({ roomLink: roomId }).populate(['users']).exec(callback)
}

const getRoomWithBot = async (roomId, callback) => {
  return await Room.findOne({ roomLink: roomId }).select('+bot +botType').populate(['users', 'bot']).exec(callback)
}

const getRoomWithMessageUsers = async (roomId, callback) => {
  return await Room.findOne({ roomLink: roomId }).populate(['users', 'messages.user']).exec(callback)
}

const findOneRoom = async (condition, callback) => {
  return await Room.findOne(condition).exec(callback)
}

const findOneRoomWithHighestField = async (field, condition, callback) => {
  return await Room.findOne(condition).sort('-' + field).populate(['users']).exec(callback)
}

const findRooms = async (condition, callback) => {
  return await Room.find(condition).exec(callback)
}

const roomCount = async (callback) => {
  return await Room.countDocuments({}).exec(callback)
}

const deleteRoom = async (roomId, callback) => {
  return await Room.deleteOne({ roomLink: roomId }).exec(callback)
}

// should not be used for arrays
const updateRoomField = async (roomId, update, callback) => {
  return await Room.findOneAndUpdate({roomLink: roomId}, update, { new: true }).exec(callback)
}

const addValueToArray = async (roomId, value, array, callback) => {
  return await Room.updateOne(
    {'roomLink': roomId},
    {'$push': {[array]: value}}
  ).exec(callback)
}

const addValueToArrayIfMissing = async (roomId, value, array, callback) => {
  return await Room.updateOne(
    {'$and': [{'roomLink': roomId}, {[array]: {'$ne': value}}]},
    {'$push': {[array]: value}}
  ).exec(callback)
}

const removeValueFromArray = async (roomId, value, array, callback) => {
  return await Room.updateOne(
    {'roomLink': roomId},
    {'$pull': {[array]: value}}
  ).exec(callback)
}

const addMessage = async (roomId, message, callback) => {
  message.user = mongoose.Types.ObjectId(message.user)
  logger.info('The add message message: ', message)
  return await Room.updateOne(
    {'roomLink': roomId},
    {'$push': {'messages': message}}
  ).exec(callback)
}

const deleteMessage = async (roomId, message, callback) => {
  await Room.updateOne(
    {'roomLink': roomId},
    {'$pull': {'messages': message}}
  ).exec(callback)
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
  getRoomWithBot,
  getRooms,
  deleteRoom,
  addValueToArray,
  removeValueFromArray,
  addMessage,
  deleteUser,
  deleteMessage,
  findOneUser,
  findUsers,
  findOneRoom,
  findRooms,
  userCount,
  roomCount,
  updateRoomField,
  findOneRoomWithHighestField,
  getRoomWithMessageUsers,
  addValueToArrayIfMissing
}
