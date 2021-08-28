const { addUser, removeUser } = require('../services/userService')
const { addMessage, getAnswer } = require('../services/messagesService')
const { getBotMessage, setRasaLastMessageSenderSlot } = require('../services/rasaService')
const logger = require('../utils/logger')
const events = require('../utils/socketEvents')

module.exports = {
  start: (io) => {
    io.on('connection', (socket) => {
      logger.info(`${socket.id} connected`)

      
      // Join a conversation
      const { roomId, name } = socket.handshake.query
      socket.join(roomId)

      const user = addUser(socket.id, roomId, name)
      console.log('user', user)
      io.in(roomId).emit(events.USER_JOIN_CHAT_EVENT, user)

      setInterval(() => {
        const botMessage = getBotMessage()
        
        if (typeof botMessage !== 'undefined') {

          // Bot reply timeout chain

          setTimeout(() => {
            logger.info('Bot start typing', { senderId: botMessage.senderId, user: botMessage.user })
            io.in(botMessage.room).emit(events.START_TYPING_MESSAGE_EVENT, { senderId: botMessage.senderId, user: botMessage.user })
            setTimeout(() => {
              logger.info('End typing', { senderId: botMessage.senderId, user: botMessage.user })
              io.in(botMessage.room).emit(events.STOP_TYPING_MESSAGE_EVENT, { senderId: botMessage.senderId, user: botMessage.user })
              io.in(botMessage.room).emit(events.BOT_SENDS_MESSAGE_EVENT, botMessage)
            }, 2000)
          }, 500)
        }
      }, 3000)

      // Listen for new messages
      socket.on(events.NEW_CHAT_MESSAGE_EVENT, (data) => {
        const message = addMessage(roomId, data)
        io.in(roomId).emit(events.NEW_CHAT_MESSAGE_EVENT, message)
      })

      // Bot reply
      socket.on(events.SEND_MESSAGE_TO_BOT_EVENT, async (data) => {
        await setRasaLastMessageSenderSlot(roomId, data.senderId)
        const answers = getAnswer(roomId, data)
        logger.info('Bot answer', answers)
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