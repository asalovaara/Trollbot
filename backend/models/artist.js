const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const artistSchema = mongoose.Schema({
  professionalName: {
    type: String,
    unique: true
  },
  firstname: String,
  lastname: String,
  gender: String,
  role: String,
  genres: [String]
})

artistSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

artistSchema.plugin(uniqueValidator)

const Artist = mongoose.model('Artist', artistSchema)

module.exports = Artist