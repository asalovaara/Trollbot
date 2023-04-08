const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const User = require('./user')

/*
 * This file has the schemas for rooms and messages. Note that bot information is not returned by default. If bot data is needed, it needs to be specified in the request. 
 */

const messageSchema = new mongoose.Schema({
  body: String,
  senderId: String,
  room: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

})

messageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
messageSchema.set('toObject', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  roomLink: {
    type: String,
    unique: true
  },
  botType: {
    type: String,
    select: false
  },
  bot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false
  },
  userCount: Number, 
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  ],
  allowedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  ],
  completed_users: [String],
  messages: [messageSchema],
  active: Boolean,
  in_use: Boolean
})

roomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
roomSchema.set('toObject', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

roomSchema.plugin(uniqueValidator)

const Room = mongoose.model('Room', roomSchema)

module.exports = Room