const app = require('../app')
const { createServer } = require('http')
const { Server } = require('socket.io')
const Client = require('socket.io-client')

let io, serverSocket, clientSocket

beforeAll((done) => {
  const httpServer = createServer(app)
  io = new Server(httpServer)
  httpServer.listen(() => {
    const port = httpServer.address().port
    clientSocket = new Client(`http://localhost:${port}`)
    io.on('connect', (socket) => {
      serverSocket = socket
    })
    clientSocket.on('connect', done)
  })
})

afterAll(() => {
  io.close()
  clientSocket.close()
})

test('Can connect to socket', (done) => {
  clientSocket.on('hello', (arg) => {
    expect(arg).toBe('world')
    done()
  })

  serverSocket.emit('hello', 'world')
})