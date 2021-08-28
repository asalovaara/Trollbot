const roomService = require('../services/roomService')

describe('Room Service tests', () => {
  const room = { name: 'Test' }

  beforeAll(() => {
    const foundRoom = roomService.addRoom(room)
    console.log(foundRoom)
    const user = roomService.addUserIntoRoom(room, 'Testuser')
    console.log(user)
    roomService.addMessage(room, 'Testmessage')
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
    const users = roomService.getUsersInRoom(room)
    expect(users.find(u => u.id === 123).name).toBe('Testuser')
    expect(users.find(u => u.id === 4654654)).toBe(undefined)
  })

  it('Finds messages in room', () => {
    const messages = roomService.getMessageInRoom(room)
    const message = messages.find(m => m.body === 'Testmessage')
    expect(message.body).toBe('Testmessage')
  })

  it('Removes user from room', () => {
    const removedUser = roomService.removeUserFromRoom(room, 'Testuser')
    expect(removedUser.name).toBe('Testuser')
  })

})
