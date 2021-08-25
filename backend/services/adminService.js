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
  rooms.push(room)
  return rooms
}

const getRooms = () => {
  logger.info('getRooms - rooms', rooms)
  return rooms
}

module.exports = { addRoom, getRooms }