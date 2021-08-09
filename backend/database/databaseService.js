const User = require('../models/user')
const Artist = require('../models/artist')

const getUsers = async () => {
  const users = await User.find()
  console.log(users.toJSON())
  return users
}

const saveUserToDatabase = async (user) => {
  const userModel = new User({
    username: user.name
  })
  return await userModel.save()
}

const saveArtistToDatabase = async (artist) => {
  const artistModel = new Artist({
    professionalName: artist.professionalName,
    genres: []
  })
  return await artistModel.save()
}

const getUserByName = async (username) => {
  return await User.findOne({ username })
}

const getArtistByName = async (name) => {
  return await Artist.findOne({ professionalName: name })
}

const addGenreToArtist = async (professionalName, genre) => {
  return await Artist.findByIdAndUpdate(professionalName, { $push: { genres: genre } }, { new: true })
}

module.exports = {
  getUsers,
  saveUserToDatabase,
  saveArtistToDatabase,
  getUserByName,
  getArtistByName,
  addGenreToArtist,
}
