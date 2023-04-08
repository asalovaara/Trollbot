const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

/*
 * This file contains the user model. Note that an user can have a different username to their name. 
 * Currently this is used by bots in order to not run into issues with bot generation (limited pool of bot names).
 */

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  senderId: String,
  pid: String,
  
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist'
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist'
    },
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject.likes
    delete returnedObject.dislikes
  }
})

userSchema.set('toObject', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject.likes
    delete returnedObject.dislikes
  }
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User