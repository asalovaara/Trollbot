const { addUser, removeUser } = require('../services/userService')
const { addMessage, getAnswer } = require('../services/messagesService')
const {setRasaLastMessageSenderSlot} = require('../services/rasaService')
const logger = require('../utils/logger')
const events = require('../utils/socketEvents')
const {inspect} = require('util')

module.exports = {
  start: (io) => {
    io.on('connection', (socket) => {
      logger.info(`${socket.id} connected`)

      
      // Join a conversation
      const { roomId, name } = socket.handshake.query
      socket.join(roomId)

      const user = addUser(socket.id, roomId, name)
      io.in(roomId).emit(events.USER_JOIN_CHAT_EVENT, user)

      // Listen for new messages
      socket.on(events.NEW_CHAT_MESSAGE_EVENT, (data) => {
        const message = addMessage(roomId, data)
        io.in(roomId).emit(events.NEW_CHAT_MESSAGE_EVENT, message)
      })

      // Bot reply
      socket.on(events.BOT_ANSWER_EVENT, async (data) => {
        await setRasaLastMessageSenderSlot(roomId, data.senderId)
        const answers = await getAnswer(roomId, data)

        // Bot reply timeout chain
        setTimeout(() => {
          logger.info('Bot start typing', { senderId: answers[0].senderId, user: answers[0].user })
          io.in(roomId).emit(events.START_TYPING_MESSAGE_EVENT, { senderId: answers[0].senderId, user: answers[0].user })
          setTimeout(() => {
            logger.info('End typing', { senderId: answers[0].senderId, user: answers[0].user })
            io.in(roomId).emit(events.STOP_TYPING_MESSAGE_EVENT, { senderId: answers[0].senderId, user: answers[0].user })
            answers.map(answer => {
              io.in(roomId).emit(events.BOT_ANSWER_EVENT, answer)
            })
          }, 2000)
        }, 500)

      })

      // Listen typing events
      socket.on(events.START_TYPING_MESSAGE_EVENT, (data) => {
        logger.info('Start typing data:', data)
        io.in(roomId).emit(events.START_TYPING_MESSAGE_EVENT, data)
      })
      socket.on(events.STOP_TYPING_MESSAGE_EVENT, (data) => {
        io.in(roomId).emit(events.STOP_TYPING_MESSAGE_EVENT, data)
      })

      // Leave the room if the user closes the socket
      socket.on('disconnect', () => {
        removeUser(socket.id)
        io.in(roomId).emit(events.USER_LEAVE_CHAT_EVENT, user)
        socket.leave(roomId)
      })
    })
  }
}