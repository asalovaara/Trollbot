const roomService = require('../services/roomService')

describe('Room service unit tests', () => {
  const room = { name: 'Jest', roomLink: 'JestLink' }

  beforeAll(() => {
    roomService.addRoom(room)
    roomService.addUserIntoRoom('JestLink', 'Testuser')
    roomService.addMessage('JestLink', { user: 'Testuser', body: 'Testmessage' })
  })

  it('Finds room', () => {
    const foundRoom = roomService.getRoom('JestLink')
    expect(foundRoom.name).toBe('Jest')
  })

  it('Finds user by name in room', () => {
    const user = roomService.getUserInRoom('JestLink', 'Testuser')
    expect(user.name).toBe('Testuser')
  })

  it('Finds users in room', () => {
    const users = roomService.getUsersInRoom('JestLink')
    expect(users.find(u => u.name === 'Testuser').name).toBe('Testuser')
    expect(users.find(u => u.id === 4654654)).toBe(undefined)
  })

  it('Finds messages in room', () => {
    const messages = roomService.getMessagesInRoom('JestLink')
    const message = messages.find(m => m.body === 'Testmessage')
    expect(message.body).toBe('Testmessage')
  })

  it('Removes user from room', () => {
    const removedUser = roomService.removeUserFromRoom('JestLink', 'Testuser')
    expect(removedUser.name).toBe('Testuser')
    const users = roomService.getUsersInRoom('JestLink')
    expect(users.find(u => u.name === 'Testuser')).toBe(undefined)
  })

  it('Removes room ', () => {
    roomService.deleteRoom('JestLink')
    const foundRoom = roomService.getRoom('JestLink')
    expect(foundRoom).toBe(undefined)
  })
  
})
