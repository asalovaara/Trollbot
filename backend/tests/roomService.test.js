jest.mock('../database/databaseService')

const roomService = require('../services/roomService')
const {saveUserToDatabase, saveRoomToDatabase, addValueToArray, getRooms, getRoomByLink, getRoomWithMessageUsers, getUserByName, addMessage} = require('../database/databaseService')

describe('Room service unit tests', () => {
  const users = [{ username: 'Testuser', name: 'Testuser'}]
  const messages = [{body: 'Testmessage'}]
  const rooms = [{ name: 'Jest', roomLink: 'JestLink', users: [...users], messages: [...messages]}]
  
  beforeEach(() => {
    jest.mock('../database/databaseService')
    getRoomByLink.mockReturnValue(Promise.resolve(rooms[0]))
  })

  it('can fetch list of rooms', async () => {
    getRooms.mockReturnValue(Promise.resolve(rooms))

    const foundRooms = await roomService.getRooms()
    expect(foundRooms).not.toBeUndefined()
    expect(foundRooms[0].name).toBe('Jest')
  })

  it('Finds room', async () => {
    const foundRoom = await roomService.getRoom('JestLink')
    expect(foundRoom.name).toBe('Jest')
  })

  it('Finds user by name in room', async () => {
    const user = await roomService.getUserInRoom('JestLink', 'Testuser')
    expect(user.name).toBe('Testuser')
  })

  it('Finds users in room', async () => {
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

  it('Does not add messages with no user', async () => {
    const message = await roomService.addMessage('roomId', { body: 'message' })
    expect(message).toBeUndefined()
  })

  it('Does not add messages an user with no id', async () => {
    const message = await roomService.addMessage('roomId', { user: {name: 'Testname', username: 'Testname'}, body: 'message' })
    expect(message).toBeUndefined()
  })

  it('Adds messages with a user with id', async () => {
    addMessage.mockReturnValue(Promise.resolve())

    const message = await roomService.addMessage('roomId', { user: {id: 'Test', name: 'Testname', username: 'Testname'},  body: 'message' })
    expect(message).not.toBeUndefined()
    expect(message.room).toBe('roomId')
  })

  it('Can autocreate a room', async () => {
    saveUserToDatabase.mockReturnValue(Promise.resolve())
    getUserByName.mockReturnValue(Promise.resolve())
    saveRoomToDatabase.mockReturnValue(Promise.resolve())
    addValueToArray.mockReturnValue(Promise.resolve())

    const room = await roomService.autoCreateRoom()
    expect(room).not.toBeUndefined()
    expect(room.roomLink).not.toBeUndefined()
    expect(room.active).toBe(false)
    expect(room.in_use).toBe(true)
    expect(room.completed_users).not.toBeUndefined()
    expect(room.name).not.toBeUndefined()
    expect(room.botType).not.toBeUndefined()
  })
  
  it('Can add a room', async () => {
    saveUserToDatabase.mockReturnValue(Promise.resolve())
    getUserByName.mockReturnValue(Promise.resolve())
    saveRoomToDatabase.mockReturnValue(Promise.resolve())
    addValueToArray.mockReturnValue(Promise.resolve())

    const testRoom = { name:  'TestRoom', botType: 'Normal' }

    const room = await roomService.addRoom(testRoom)

    expect(room).not.toBeUndefined()
    expect(room.roomLink).not.toBeUndefined()
    expect(room.active).toBe(false)
    expect(room.in_use).toBe(true)
    expect(room.completed_users).not.toBeUndefined()
    expect(room.name).toBe('TestRoom')
    expect(room.botType).toBe('Normal')
  })
})
