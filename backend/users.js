// const users = []
const users = [{
  id: 'bot',
  name: 'Bot',
  picture: 'https://media.wired.com/photos/5cdefb92b86e041493d389df/1:1/w_988,h_988,c_limit/Culture-Grumpy-Cat-487386121.jpg',
  room: 'Test'
}]

const addUser = (id, room, name, picture) => {
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  )

  if (!name || !room) return { error: 'Username and room are required.' }
  if (existingUser) return { error: 'Username is taken.' }

  const user = { id, name, picture, room }
  // console.log('users', users)
  // console.log('user', user)

  users.push(user)

  return { id, name: user.name, picture: user.picture }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) return users.splice(index, 1)[0]
}

const getUser = (id) => users.find((user) => user.id === id)

const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = { addUser, removeUser, getUser, getUsersInRoom }
