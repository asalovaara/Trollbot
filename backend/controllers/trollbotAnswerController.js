const replies = require('../data/replies.json') // JSON object containing bot's replies by action category


let messages = [{ body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }]

const botAnswer = ( {message} ) => {
    const response = getResponse(message)
    return response

}

const getResponse = (userMessage) => {
    console.log('Entered trollbotAnswerController:getResponse().')
    try {
        const messageType = getMessageType(userMessage)

        const reply = chooseReply(messageType)
        console.log(`User message: ${userMessage}`)
        console.log(`Bot reply: ${reply}`)

        const messageObject = {
            body: userMessage,
            user: 'Human',
            date: new Date().toISOString(),
            id: messages.length + 1
        }
        const replyObject = {
            body: reply,
            user: 'Bot',
            date: new Date().toISOString(),
            id: messages.length + 2
        }

        messages = messages.concat([messageObject, replyObject])

        return messages
    } catch (e) {
        console.error(e)
    }
}

const getGreeting = () => {
    return { body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }
}

const getMessages = () => {
    return messages
}

const clearMessages = () => {
    messages = [{ body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }]
}

const getMessageType = (userMessage) => {
    console.log('Entered trollbotAnswerController:getMessageType()')
    try {
        userMessage = userMessage.toLowerCase()

        if (userMessage === 'hello') {
            return 'opening'
        } else if (userMessage === "bye") {
            return 'closing'
        } else if (userMessage.includes("?")) {
            return 'question'
        } else {
            return 'other'
        }
    } catch (e) {
        console.error(e)
    }

}

const chooseReply = ( messageType ) => {
    console.log('Entered trollbotAnswerController:chooseReply()')

    let repliesNumber = Math.floor(Math.random() * 3)

    if (messageType == 'opening') {
      // todo
      return replies.opening[repliesNumber]
    }
    if (messageType == 'closing') {
      // todo
      return replies.closing[repliesNumber]
    }
    if (messageType == 'question') {
      // todo
      return replies.question[repliesNumber]
    }
    if (messageType == 'other') {
      // todo
      return replies.other[repliesNumber]
    }
  }



exports.botAnswer = botAnswer
exports.getGreeting = getGreeting
exports.getMessages = getMessages
exports.clearMessages = clearMessages
