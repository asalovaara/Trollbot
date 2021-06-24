var trollbot = require('../controllers/trollbotAnswerController')

afterEach(() => {
  trollbot.clearMessages()
})

test('Opening message returns correct bot response', async () => {
  const response = await trollbot.botAnswer({ message: 'hello' })
  expect(['Hi!', 'Hello!', 'Howdy!']).toContain(response[2].body)
})

test('Opening message returns correct bot response', async () => {
  const response = await trollbot.botAnswer({ message: 'hi' })
  expect(['Hi!', 'Hello!', 'Howdy!']).toContain(response[2].body)
})

test('Closing message returns correct bot response', async () => {
  const response = await trollbot.botAnswer({ message: 'bye' })
  expect(['Goodbye!', 'Cya!', 'So long!']).toContain(response[2].body)
})

test('Closing message returns correct bot response', async () => {
  const response = await trollbot.botAnswer({ message: 'ok goodbye' })
  expect(['Goodbye!', 'Cya!', 'So long!']).toContain(response[2].body)
})

test('Question returns correct bot response', async () => {
  const response = await trollbot.botAnswer({ message: 'hmm?' })
  expect(['What did you ask?', 'Why are you asking me?', 'Any other questions?']).toContain(response[2].body)
})

test('Question returns correct bot response', async () => {
  const response = await trollbot.botAnswer({ message: 'What' })
  expect(['What did you ask?', 'Why are you asking me?', 'Any other questions?']).toContain(response[2].body)
})

test('Question returns correct bot response', async () => {
  const response = await trollbot.botAnswer({ message: 'Where' })
  expect(['What did you ask?', 'Why are you asking me?', 'Any other questions?']).toContain(response[2].body)
})

test('Band genre query returns correct bot response', async () => {
  const response = await trollbot.botAnswer({message: 'The Hush Sound'})
  expect('The genre(s) are: baroque pop, chicago indie, piano rock').toContain(response[2].body)
})

test('Other message returns correct bot response', async () => {
  const response = await trollbot.botAnswer({message: 'hh'})
  expect('The genre(s) are: ').toContain(response[2].body)
})

test('Messages contain previous messages', async () => {
  await trollbot.botAnswer({ message: 'hello' })
  await trollbot.botAnswer({ message: 'bye' })
  await trollbot.botAnswer({ message: '?' })
  await trollbot.botAnswer({ message: 'The Hush Sound' })
  const messages = trollbot.getMessages()
  expect(messages.length).toBe(9) // initial bot message, three user messages and three bot responses
})
