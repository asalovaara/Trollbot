require('../app')
const mongoose = require('mongoose')
const db = require('../database/databaseService')


test('users are returned', async () => {
  const users = await db.getUsers()
  expect(new Set(users)).toContain('Test')
})

afterAll(() => {
  mongoose.connection.close()
})