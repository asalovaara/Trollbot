const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const uri = '/api/trollbot'

test('Messages are returned as JSON', async () => {
  await api.get(uri).expect(200).expect('Content-Type', /application\/json/)
})

test('Message is added ', async () => {
  const body = {
    message: 'Test'
  }
  await api
    .post(uri)
    .send(body)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get(uri)
  const contents = response.body.map(r => r.body)
  expect(contents).toContain('Test')
})