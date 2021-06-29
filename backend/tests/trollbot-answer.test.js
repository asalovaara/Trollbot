const trollbot = require('../controllers/trollbotAnswerController')
const { getResponse } = require('../controllers/trollbotAnswerController')

afterEach(() => {
  trollbot.clearMessages()
})

test('Opening message returns correct bot response', async () => {
  const response = await getResponse('hello')
  expect(['Hi!', 'Hey!', 'Hello!', 'Howdy!']).toContain(response[2].body)
})

test('Closing message returns correct bot response', async () => {
  const response = await getResponse('bye')
  expect(['Goodbye!', 'Cya!', 'So long!']).toContain(response[2].body)
})

test('Question returns correct bot response', async () => {
  const response = await getResponse('hmm?')
  expect(['What did you ask?', 'Why are you asking me?', 'Any other questions?']).toContain(response[2].body)
})

test('Other message returns correct bot response', async () => {
  const response = await getResponse('hshjsksh')
  expect('Could not find information on this band.').toContain(response[2].body)
})

test('Messages contain previous messages', async () => {
  await trollbot.botAnswer({ message: 'hello' })
  await trollbot.botAnswer({ message: 'bye' })
  await trollbot.botAnswer({ message: 'hmm?' })
  await trollbot.botAnswer({ message: 'The Hush Sound' })
  const messages = trollbot.getMessages()
  expect(messages.length).toBe(9) // initial bot message, three user messages and three bot responses
})
