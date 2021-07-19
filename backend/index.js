const http = require('http')
const app = require('./app')
const socketIo = require('socket.io')
const logger = require('./utils/logger')
const socketRouter = require('./controllers/socketRouter')
const { PORT } = require('./utils/config')

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE']
  }
})
socketRouter.start(io)

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})