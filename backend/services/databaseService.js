const User = require('../models/user')
const Artist = require('../models/artist')

const saveUserToDatabase = async (user) => {
  const userModel = new User({
    username: user.name
  })
  const savedUser = await userModel.save().then(u => { u.toJSON() })

  return savedUser
}

const saveArtistToDatabase = async (artist) => {
  const artistModel = new Artist({
    professionalName: artist.professionalName
  })
  const savedArtist = await artistModel.save().then(a => { a.toJSON() })

  return savedArtist
}


module.exports = {
  saveUserToDatabase,
  saveArtistToDatabase,
}