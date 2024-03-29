const { userAllowedIn, addUserIntoRoom, addMessage, removeUserFromRoom, getBot, getUsersInRoom, getRoomName, getRoom, manageComplete, addUserToAllowed } = require('../services/roomService')
const { getBotMessage, setRasaLastMessageSenderSlot, sendMessageToRasa, setRasaUsersSlot, setBotType } = require('../services/rasaService')
const { getUser } = require('../services/userService')

const logger = require('../utils/logger')
const events = require('../utils/socketEvents')
const { TASK_COMPLETE_REDIRECT_TARGET } = require('../utils/config')

/*
 * This function controls the socket connection.
 */

// starts the socket
const start = (io) => {
  
  io.on('connection', async (socket) => {

    const { roomId, name } = socket.handshake.query
    logger.info('Connecting user...')
    // Join a conversation
    // Can this be moved so there is no extra database call? Investigate
    const roomName = await getRoomName(roomId)
    logger.info(`Socket.io: ${name} joined ${roomName}.`)
    socket.join(roomId)

    // Check that room and user exist
    const room = await getRoom(roomId)
    const user = await getUser(name)

    if (!room || !user || (!room.active && !userAllowedIn(room._id, user._id))) { // This might be causing the random disconnection issues
      logger.error('Cannot connect to this room')
      socket.disconnect()
    }
    
    await addUserIntoRoom(roomId, name)

    // Get room data
    const bot = await getBot(roomId)
    const users = await getUsersInRoom(roomId)
    logger.info('bot: ', bot)
    // Set Rasa users and bot type
    if (bot && bot.type !== undefined && room && room.active) setBotType(roomId, bot.type)
    if (bot && users && room && room.active) setRasaUsersSlot(roomId, users)

    // Emit user joined
    io.in(roomId).emit(events.USER_JOIN_CHAT_EVENT, user)

    // This should be called when the user is still waiting. When room is in use, this should no longer be called
    if (room && room.active) await addUserToAllowed(roomId, user._id)

    // Checks bot messages periodically
    setInterval(() => {
      if(!bot || !room || !room.active) return
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
    socket.on(events.NEW_CHAT_MESSAGE_EVENT, async (data) => {
      logger.info('Socket router message', data)
      const message = await addMessage(roomId, data)
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

    // Checks whether the task is complete
    socket.on(events.COMPLETE_TASK_EVENT, async (data) => {
      const compCode = (await manageComplete(data.prolific_id, roomId)) ? TASK_COMPLETE_REDIRECT_TARGET : null
      logger.info(TASK_COMPLETE_REDIRECT_TARGET)
      io.in(roomId).emit(events.COMPLETE_TASK_EVENT, compCode)
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