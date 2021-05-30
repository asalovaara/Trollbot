var trollbot = require('../controllers/trollbotAnswerController')

afterEach(() => {
    trollbot.clearMessages();
})

test('Opening message returns correct bot response', async () => {
    const response = trollbot.botAnswer({message: "hello"})
    expect(["Hi!", "Hello!", "Howdy!"]).toContain(response[2].body)
})

test('Closing message returns correct bot response', async () => {
    const response = trollbot.botAnswer({message: "bye"})
    expect(["Goodbye!", "Cya!", "So long!"]).toContain(response[2].body)
})

test('Question returns correct bot response', async () => {
    const response = trollbot.botAnswer({message: "hmm?"})
    expect(["What did you ask?", "Why are you asking me?", "Any other questions?"]).toContain(response[2].body)
})

test('Other message returns correct bot response', async () => {
    const response = trollbot.botAnswer({message: "test"})
    expect(["Can you repeat that with different words?", "I'm not sure I understand. Could you elaborate?", "I'm sorry, I don't follow. Can you be more specific?"]).toContain(response[2].body)
})

test('Messages contain previous messages', async () => {
    trollbot.botAnswer({message: "hello"})
    trollbot.botAnswer({message: "bye"})
    trollbot.botAnswer({message: "?"})
    const messages = trollbot.getMessages()
    console.log(messages)
    expect(messages.length).toBe(7) // initial bot message, three user messages and three bot responses
})
