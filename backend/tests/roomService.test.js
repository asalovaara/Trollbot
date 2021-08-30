const roomService = require('../services/roomService')

describe('Room Service tests', () => {
  const room = { name: 'Jest' }

  beforeAll(() => {
    roomService.addRoom(room)
    const added = roomService.addUserIntoRoom(123, 'Jest', 'Testuser')
    console.log(added)
    roomService.addMessage('Jest', { user: 'Testuser', body: 'Testmessage' })
  })

  it('Finds room', () => {
    const foundRoom = roomService.getRoom('Jest')
    expect(foundRoom.name).toBe('Jest')
  })

  it('Finds user by name in room', () => {
    const user = roomService.getUserInRoom('Jest', 'Testuser')
    console.log(user)
    expect(user.name).toBe('Testuser')
  })

  it('Finds users in room', () => {
    const users = roomService.getUsersInRoom('Jest')
    expect(users.find(u => u.name === 'Testuser').name).toBe('Testuser')
    expect(users.find(u => u.id === 4654654)).toBe(undefined)
  })

  it('Finds messages in room', () => {
    const messages = roomService.getMessagesInRoom('Jest')
    const message = messages.find(m => m.body === 'Testmessage')
    expect(message.body).toBe('Testmessage')
  })

  it('Removes user from room', () => {
    const removedUser = roomService.removeUserFromRoom('Jest', 'Testuser')
    expect(removedUser.name).toBe('Testuser')
    const users = roomService.getUsersInRoom('Jest')
    expect(users.find(u => u.name === 'Testuser')).toBe(undefined)
  })

})
