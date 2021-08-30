const { addUserIntoRoom, addMessage, removeUserFromRoom, getBot } = require('../services/roomService')
const { getBotMessage, setRasaLastMessageSenderSlot, getRasaRESTResponse } = require('../services/rasaService')

const logger = require('../utils/logger')
const events = require('../utils/socketEvents')

module.exports = {
  start: (io) => {
    io.on('connection', (socket) => {
      // Join a conversation
      const { roomId, name } = socket.handshake.query
      logger.info(`Socket.io: ${name} joined ${roomId}.`)
      socket.join(roomId)
      const user = addUserIntoRoom(socket.id, roomId, name)
      console.log('user joined', user)
      io.in(roomId).emit(events.USER_JOIN_CHAT_EVENT, user)

      setInterval(() => {
        const botMessage = getBotMessage()
        const { id, name: botName } = getBot(roomId)

        if (typeof botMessage !== 'undefined') {
          // Bot reply timeout chain
          setTimeout(() => {
            logger.info('Bot start typing', botName)
            io.in(roomId).emit(events.START_TYPING_MESSAGE_EVENT, { senderId: roomId, user: { id, name: botName } })
            setTimeout(() => {
              logger.info('End typing', botName)
              io.in(roomId).emit(events.STOP_TYPING_MESSAGE_EVENT, { senderId: roomId, user: { id, name: botName } })
              console.log('Bot message as: ', { body: botMessage.body, senderId: roomId, user: { id, name: botName } })
              addMessage(roomId, { body: botMessage.body, senderId: roomId, user: { id, name: botName } })
              io.in(roomId).emit(events.NEW_CHAT_MESSAGE_EVENT, { body: botMessage.body, senderId: roomId, user: { id, name: botName } })
            }, 2000)
          }, 500)
        }
      }, 3000)

      // Listen for new messages
      socket.on(events.NEW_CHAT_MESSAGE_EVENT, (data) => {
        console.log('Socket router message', data)
        const message = addMessage(roomId, data)
        io.in(roomId).emit(events.NEW_CHAT_MESSAGE_EVENT, message)
      })

      // Bot reply
      socket.on(events.SEND_MESSAGE_TO_BOT_EVENT, async (data) => {
        await setRasaLastMessageSenderSlot(roomId, data.senderId)
        const answers = await getRasaRESTResponse(roomId, data)
        logger.info('Bot answer', answers)
      })

      // Listen typing events
      socket.on(events.START_TYPING_MESSAGE_EVENT, (data) => {
        logger.info('Start typing data:', data)
        io.in(roomId).emit(events.START_TYPING_MESSAGE_EVENT, data)
      })
      socket.on(events.STOP_TYPING_MESSAGE_EVENT, (data) => {
        logger.info('Stop typing data:', data)
        io.in(roomId).emit(events.STOP_TYPING_MESSAGE_EVENT, data)
      })

      // Leave the room if the user closes the socket
      socket.on('disconnect', () => {
        removeUserFromRoom(roomId, name)
        io.in(roomId).emit(events.USER_LEAVE_CHAT_EVENT, user)
        socket.leave(roomId)
      })
    })
  }
}