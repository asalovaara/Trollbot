const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const uri = '/api/login'

test('Users are returned as JSON', async () => {
  await api.get(uri).expect(200).expect('Content-Type', /application\/json/)
})

test('Users are returned correctly', async () => {
  const response = await api.get(uri)
  const contents = response.body.map(u => u.username)
  expect(contents).toContain('testuser')
})

test('User is added ', async () => {
  const body = {
    username: 'added'
  }
  const response = await api.post(uri).send(body)
  expect(response.body.username).toContain('added')
})

test('No duplicates are added ', async () => {
  const body = {
    username: 'added'
  }
  const response = await api.post(uri).send(body)
  expect(response.body.username).toContain('added')

  const querry = await api.get(uri)
  const array = querry.body
  expect(array.length).toBe(2)

})