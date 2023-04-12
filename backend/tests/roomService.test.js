jest.mock('../database/databaseService')

const roomService = require('../services/roomService')
const {getRooms, getRoomByLink, getRoomWithMessageUsers, getUserByName} = require('../database/databaseService')

describe('Room service unit tests', () => {
  const users = [{ username: 'Testuser', name: 'Testuser'}]
  const messages = [{body: 'Testmessage'}]
  const rooms = [{ name: 'Jest', roomLink: 'JestLink', users: [...users], messages: [...messages]}]
  
  beforeEach(() => {
    jest.mock('../database/databaseService')
  })

  it('can fetch list of rooms', async () => {
    getRooms.mockReturnValue(Promise.resolve(rooms))

    const foundRooms = await roomService.getRooms()
    expect(foundRooms).not.toBeUndefined()
    expect(foundRooms[0].name).toBe('Jest')
  })

  it('Finds room', async () => {
    getRoomByLink.mockReturnValue(Promise.resolve(rooms[0]))

    const foundRoom = await roomService.getRoom('JestLink')
    expect(foundRoom.name).toBe('Jest')
  })

  it('Finds user by name in room', async () => {
    getRoomByLink.mockReturnValue(Promise.resolve(rooms[0]))

    const user = await roomService.getUserInRoom('JestLink', 'Testuser')
    expect(user.name).toBe('Testuser')
  })

  it('Finds users in room', async () => {
    getRoomByLink.mockReturnValue(Promise.resolve(rooms[0]))

    const users = await roomService.getUsersInRoom('JestLink')
    expect(users.find(u => u.name === 'Testuser').name).toBe('Testuser')
    expect(users.find(u => u.id === 4654654)).toBe(undefined)
  })

  it('Finds messages in room', async () => {
    getRoomWithMessageUsers.mockReturnValue(Promise.resolve(rooms[0]))

    const messages = await roomService.getMessagesInRoom('JestLink')
    const message = messages.find(m => m.body === 'Testmessage')
    expect(message.body).toBe('Testmessage')
  })

  it('Removes user from room', async () => {

    getRoomByLink.mockReturnValue(Promise.resolve(rooms[0]))
    getUserByName.mockReturnValue(Promise.resolve(users[0]))

    const removedUser = await roomService.getUserInRoom('JestLink', 'Testuser')
    expect(removedUser.name).toBe('Testuser')

    await roomService.removeUserFromRoom('JestLink', 'Testuser')

    const roomsWithoutUsers = [...rooms]
    roomsWithoutUsers[0].users = []
    getRoomByLink.mockReturnValue(Promise.resolve(roomsWithoutUsers[0]))

    const remainingUsers = await roomService.getUsersInRoom('JestLink')
    expect(remainingUsers.find(u => u.name === 'Testuser')).toBe(undefined)
  })
  
})
