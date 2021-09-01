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
  genres: [String],
  area: String,
  begin: Date,
  end: Date
})

artistSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

artistSchema.plugin(uniqueValidator)

const Artist = mongoose.model('Artist', artistSchema)

module.exports = Artist