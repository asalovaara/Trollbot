const logger = require('../utils/logger')

let rooms = [
  {
    name: 'TestA',
    botType: 'Normal',
    id: 1
  },
  {
    name: 'TestB',
    botType: 'Troll',
    id: 2
  },
]

const addRoom = (room) => {
  logger.info('adminService - addRoom - room', room)
  const savedRoom = { ...room, id: rooms.length + 1 }
  rooms.push(savedRoom)
  return savedRoom
}

const getRooms = () => {
  logger.info('getRooms - rooms', rooms)
  return rooms
}

module.exports = { addRoom, getRooms }