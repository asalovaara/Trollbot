const roomService = require('../services/roomService')

test('Finds room', () => {
  const room = roomService.getRoom('Test')
  expect(room.name).toBe('Test')
})

test('Finds user by name in room', () => {
  const user = roomService.getUserInRoom('Test', 'Testuser')
  expect(user.name).toBe('Testuser')
})

test('Finds users in room', () => {
  const users = roomService.getUsersInRoom('Test')
  expect(users.find(u => u.id === 123).name).toBe('Testuser')
  expect(users.find(u => u.id === 4654654)).toBe(undefined)
})

test('Finds messages in room', () => {
  const messages = roomService.getMessageInRoom('Test')
  const message = messages.find(m => m.id === 123)
  const noMessage = messages.find(m => m.id === 566)
  expect(message.body).toBe('Testmessage')
  expect(noMessage).toBe(undefined)
})

test('Removes user from room', () => {
  const removedUser = roomService.removeUserFromRoom('Test', 321)
  const newArray = roomService.getUsersInRoom('Test')
  expect(removedUser.name).toBe('Removeme')
  expect(newArray.some(u => u.id === 123)).toBe(true)
  expect(newArray.some(u => u.id === 321)).toBe(false)
})