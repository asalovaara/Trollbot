const roomService = require('../services/roomService')

describe('Room Service tests', () => {
  const room = { name: 'Test' }

  beforeAll(() => {
    roomService.addRoom(room)
    roomService.addUserIntoRoom('Test', 'Testuser')
    roomService.addMessage('Test', { user: 'Testuser', body: 'Testmessage' })
  })

  it('Finds room', () => {
    const foundRoom = roomService.getRoom('Test')
    expect(foundRoom.name).toBe('Test')
  })

  it('Finds user by name in room', () => {
    const user = roomService.getUserInRoom('Test', 'Testuser')
    expect(user.name).toBe('Testuser')
  })

  it('Finds users in room', () => {
    const users = roomService.getUsersInRoom('Test')
    expect(users.find(u => u.name === 'Testuser').name).toBe('Testuser')
    expect(users.find(u => u.id === 4654654)).toBe(undefined)
  })

  it('Finds messages in room', () => {
    const messages = roomService.getMessagesInRoom('Test')
    const message = messages.find(m => m.body === 'Testmessage')
    expect(message.body).toBe('Testmessage')
  })

  it('Removes user from room', () => {
    const removedUser = roomService.removeUserFromRoom('Test', 'Testuser')
    expect(removedUser.name).toBe('Testuser')
    const users = roomService.getUsersInRoom('Test')
    expect(users.find(u => u.name === 'Testuser')).toBe(undefined)
  })

})
