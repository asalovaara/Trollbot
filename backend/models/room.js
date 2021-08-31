const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  botType: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },
  ],
  messages: [String]
})

roomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

roomSchema.plugin(uniqueValidator)

const Room = mongoose.model('Room', roomSchema)

module.exports = Room