const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

test('Messages are returned as JSON', async () => {
  await api.get('/trollbot').expect(200).expect('Content-Type', /application\/json/)
})

test('Message is added ', async () => {
  const body = {
    message: 'Test'
  }
  await api
    .post('/trollbot')
    .send(body)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/trollbot')
  const contents = response.body.map(r => r.body)
  expect(contents).toContain('Test')
  expect(contents).toContain('You said "Test".')
})