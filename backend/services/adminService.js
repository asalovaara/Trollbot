const logger = require('../utils/logger')

let rooms = [
  {
    name: 'A room',
    botType: 'Normal',
  },
  {
    name: 'Second Room',
    botType: 'Troll'
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