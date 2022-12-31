const User = require('../models/user')
const Artist = require('../models/artist')
const Room = require('../models/room')
const logger = require('../utils/logger')
const mongoose = require('mongoose')

// USER

const getUsers = async () => {
  const users = await User.find()
  return JSON.from(users)
}

const saveUserToDatabase = async (user) => {
  const userModel = new User({
    username: user.name,
    name: user.name,
    senderId: user.senderId
  })
  return await userModel.save()
}

const getUserByName = async (username) => {
  return await User.findOne({ username })
}

const deleteUser = async (username) => {
  return await User.deleteOne({ username: username })
}
// add update senderId to entering room

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
    users: room.users,
    messages: room.messages,
    completed_users: room.completed_users,
    active: room.active,
    in_use: room.in_use
  })
  return await roomModel.save()
}

const getRoomByName = async (roomName) => {
  return await (await Room.findOne({ name: roomName })).populate('users')
}

const getRoomByLink = async (roomId) => {
  return await Room.findOne({ roomLink: roomId }).populate('users')
}

const deleteRoom = async (roomId) => {
  return await Room.deleteOne({ roomLink: roomId })
}

const addUserToRoom = async (roomId, username) => {
  const user = await getUserByName(username)
  logger.info(user._id)
  await Room.updateOne(
    {'roomLink': roomId},
    {'$push': {'users': user._id}}
  )
}

const removeUserFromRoom = async (roomId, username) => {
  const user = await getUserByName(username)
  logger.info(user._id)
  await Room.updateOne(
    {'roomLink': roomId},
    {'$pull': {'users': user._id}}
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
  deleteMessage
}
