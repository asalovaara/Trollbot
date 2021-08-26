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
  const savedRooms = { ...room, id: rooms.length + 1 }
  rooms.push(savedRooms)
  return savedRooms
}

const getRooms = () => {
  logger.info('getRooms - rooms', rooms)
  return rooms
}

module.exports = { addRoom, getRooms }