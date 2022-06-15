const { addUserIntoRoom, addMessage, removeUserFromRoom, getBot, getUsersInRoom, getRoomName, getRoom } = require('../services/roomService')
const { getBotMessage, setRasaLastMessageSenderSlot, sendMessageToRasa, setRasaUsersSlot, setBotType } = require('../services/rasaService')

const logger = require('../utils/logger')
const events = require('../utils/socketEvents')

const start = (io) => {
  
  io.on('connection', (socket) => {

    const { roomId, name } = socket.handshake.query
    logger.error('Connecting user...')
    // Check that room exists

    if (getRoom(roomId) === undefined) {
      logger.error('No such room')
      socket.disconnect()
    }
    // Join a conversation
    const roomName = getRoomName(roomId)
    logger.info(`Socket.io: ${name} joined ${roomName}.`)
    socket.join(roomId)

    // Get room data
    const bot = getBot(roomId)
    const user = addUserIntoRoom(socket.id, roomId, name)
    const users = getUsersInRoom(roomId)

    // Set Rasa users and bot type
    if (bot !== undefined && bot.type !== undefined) setBotType(roomId, bot.type)
    if (bot !== undefined && users !== undefined) setRasaUsersSlot(roomId, users)

    // Emit user joined
    io.in(roomId).emit(events.USER_JOIN_CHAT_EVENT, user)

    setInterval(() => {
      if(bot === undefined) return
      const botMessage = getBotMessage(roomId)
      if (typeof botMessage !== 'undefined') {

        // Bot reply timeout chain
        const { body } = botMessage
        const { id, name: botname } = bot

        setTimeout(() => {
          io.in(botMessage.room).emit(events.START_TYPING_MESSAGE_EVENT, { senderId: botMessage.room, user: { id, name: botname } })
          setTimeout(() => {
            io.in(botMessage.room).emit(events.STOP_TYPING_MESSAGE_EVENT, { senderId: botMessage.room, user: { id, name: botname } })
            addMessage(botMessage.room, { body, senderId: botMessage.room, user: { id, name: botname } })
            io.in(botMessage.room).emit(events.NEW_CHAT_MESSAGE_EVENT, { body, senderId: botMessage.room, user: { id, name: botname } })
          }, 2000)
        }, 500)
      }
    }, 3000)

    // Listen for new messages
    socket.on(events.NEW_CHAT_MESSAGE_EVENT, (data) => {
      logger.info('Socket router message', data)
      const message = addMessage(roomId, data)
      io.in(roomId).emit(events.NEW_CHAT_MESSAGE_EVENT, message)
    })

    // Bot reply
    socket.on(events.SEND_MESSAGE_TO_BOT_EVENT, async (data) => {
      await setRasaLastMessageSenderSlot(roomId, data.senderId)
      const response = await sendMessageToRasa(roomId, data)
      logger.info('Message sent status: ', response)
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

module.exports = {
  start
}