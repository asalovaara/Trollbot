const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const uri = '/api/login'

test('User is added ', async () => {
  const body = {
    name: 'added'
  }
  const response = await api.post(uri).send(body)
  expect(response.body.name).toContain('added')
})