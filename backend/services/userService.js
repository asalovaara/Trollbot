const logger = require('../utils/logger')

let users = [{ username: 'testuser', id: 1 }]

const login = (username) => {
  console.log('login - username', username)
  const user = users.find(u => u.username == username)
  if (user == undefined) {
    const newUser = {
      username: username,
      id: users.length + 1
    }
    console.log('newUser', newUser)
    users = users.concat(newUser)
    return newUser
  }
  return user
}

const removeUser = (id) => {
  logger.info('Remove user with ID:', id)
  users = users.filter(u => u.id === id)
  return users
}

const getUsers = () => {
  console.log('userService - users', users)
  return users
}

module.exports = { login, getUsers, removeUser }