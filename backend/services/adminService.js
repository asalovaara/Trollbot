
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
  rooms.push(room)
}

const getRooms = () => {
  rooms
}

module.exports = { addRoom, getRooms }