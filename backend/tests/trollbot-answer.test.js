var trollbot = require('../controllers/trollbotAnswerController')

afterEach(() => {
  trollbot.clearMessages()
})

test('Opening message returns correct bot response', async () => {
  const response = await trollbot.botAnswer({message: 'hello'})
  expect(['Hi!', 'Hey!', 'Hello!', 'Howdy!']).toContain(response[2].body)
})

test('Opening message returns correct bot response', async () => {
  const response = await trollbot.botAnswer({message: 'hi'})
  expect(['Hi!', 'Hey!', 'Hello!', 'Howdy!']).toContain(response[2].body)
})

test('Closing message returns correct bot response', async () => {
  const response = await trollbot.botAnswer({message: 'bye'})
  expect(['Bye!', 'Cya!', 'So long!']).toContain(response[2].body)
})

test('Closing message returns correct bot response', async () => {
  const response = await trollbot.botAnswer({message: 'goodbye'})
  expect(['Bye!', 'Cya!', 'So long!']).toContain(response[2].body)
})

test('Question returns correct bot response', async () => {
  const response = await trollbot.botAnswer({message: 'hmm?'})
  expect(['What did you ask?', 'Why are you asking me?', 'Any other questions?']).toContain(response[2].body)
})

test('Question returns correct bot response', async () => {
  const response = await trollbot.botAnswer({message: 'What'})
  expect(['What did you ask?', 'Why are you asking me?', 'Any other questions?']).toContain(response[2].body)
})

test('Question returns correct bot response', async () => {
  const response = await trollbot.botAnswer({message: 'Where'})
  expect(['What did you ask?', 'Why are you asking me?', 'Any other questions?']).toContain(response[2].body)
})

test('User likes artist path returns correct response', async () => {
  let response = await trollbot.botAnswer({message: 'I like Rihanna'})
  expect(["Ew, Rihanna, really? I guess there's no accounting for taste.", "Rihanna? Not doing it for me.", "Rihanna? I'd rather listen to nails on a chalkboard."]).toContain(response[2].body)
})

test('Other message returns correct bot response', async () => {
  const response = await trollbot.botAnswer({message: 'hshjsksh'})
  expect('Could not find information on this band.').toContain(response[2].body)
})

test('Messages contain previous messages', async () => {
  await trollbot.botAnswer({message: 'hello'})
  await trollbot.botAnswer({message: 'bye'})
  await trollbot.botAnswer({message: '?'})
  await trollbot.botAnswer({message: 'The Hush Sound'})
  const messages = trollbot.getMessages()
  console.log(messages)
  expect(messages.length).toBe(9) // initial bot message, three user messages and three bot responses
})
