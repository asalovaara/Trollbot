var trollbot = require('../controllers/trollbotAnswerController')

afterEach(() => {
    trollbot.clearMessages();
})

test('Opening message returns correct bot response', async () => {
    const response = trollbot.botAnswer({message: "hello"})
    expect(["Hi!", "Hello!", "Howdy!"]).toContain(response[2].body)
})

test('Messages contain previous messages', async () => {
    trollbot.botAnswer({message: "hello"})
    trollbot.botAnswer({message: "bye"})
    trollbot.botAnswer({message: "?"})
    const messages = trollbot.getMessages()
    console.log(messages)
    expect(messages.length).toBe(7) // initial bot message, three user messages and three bot responses
})