const logger = require('../utils/logger')
let users = [{ username: 'testuser', id: 1 }]

const login = (username) => {
  const foundUser = users.find(user => user.username == username)
  if (!foundUser) {
    const newUser = {
      username: username,
      id: users.length + 1
    }
    logger.info(newUser)
    users = users.concat(newUser)
    return newUser
  }
  return foundUser
}

const removeUser = (id) => {
  logger.info('Remove user with ID:', id)
  users = users.filter(u => u.id === id)
  return users
}

const getUsers = () => {
  return users
}

module.exports = { login, getUsers, removeUser }