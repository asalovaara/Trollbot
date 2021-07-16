const http = require('http')
const app = require('./app')
const socketIo = require('socket.io')
const cors = require('cors')
const { addUser, removeUser } = require('./users')
const { addMessage, getAnswer } = require('./messages')
const { inspect } = require('util')
const { PORT } = require('./utils/config')
const logger = require('./utils/logger')
const events = require('./utils/socketEvents')

const server = http.createServer(app)
const io = socketIo(server)

app.use(cors())

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`)

  // Join a conversation
  const { roomId, name, picture } = socket.handshake.query
  socket.join(roomId)

  const user = addUser(socket.id, roomId, name, picture)
  io.in(roomId).emit(events.USER_JOIN_CHAT_EVENT, user)

  // Listen for new messages
  socket.on(events.NEW_CHAT_MESSAGE_EVENT, (data) => {
    const message = addMessage(roomId, data)
    console.log('user message from backend', message)
    // const answer = getAnswer(message)
    io.in(roomId).emit(events.NEW_CHAT_MESSAGE_EVENT, message)
    // io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, answer)
  })

  // Bot reply
  socket.on(events.BOT_ANSWER_EVENT, async (data) => {
    const answer = await getAnswer(data)
    console.log(inspect(answer))
    io.in(roomId).emit(events.BOT_ANSWER_EVENT, answer)
  })

  // Listen typing events
  socket.on(events.START_TYPING_MESSAGE_EVENT, (data) => {
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


// const config = require('./utils/config')
// const logger = require('./utils/logger')
// const app = require('./app')
// const http = require('http')

// const server = http.createServer(app)

// server.listen(config.PORT, () => {
//   logger.info(`Server running on port ${config.PORT}`)
// })