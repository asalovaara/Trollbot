var trollbot = require('../controllers/trollbotAnswerController')

afterEach(() => {
  trollbot.clearMessages()
})

test('Opening message returns correct bot response', async () => {
    const response = await trollbot.botAnswer({message: "hello"})
    expect(["Hi!", "Hello!", "Howdy!"]).toContain(response[2].body)
})

test('Closing message returns correct bot response', async () => {
    const response = await trollbot.botAnswer({message: "bye"})
    expect(["Goodbye!", "Cya!", "So long!"]).toContain(response[2].body)
})

test('Question returns correct bot response', async () => {
    const response = await trollbot.botAnswer({message: "hmm?"})
    expect(["What did you ask?", "Why are you asking me?", "Any other questions?"]).toContain(response[2].body)
})

test('Other message returns correct bot response', async () => {
    const response = await trollbot.botAnswer({message: "The Hush Sound"})
    expect("alternative rock").toContain(response[2].body)
})

test('Messages contain previous messages', async () => {
    await trollbot.botAnswer({message: "hello"})
    await trollbot.botAnswer({message: "bye"})
    await trollbot.botAnswer({message: "?"})
    const messages = trollbot.getMessages()
    console.log(messages)
    expect(messages.length).toBe(7) // initial bot message, three user messages and three bot responses
})
