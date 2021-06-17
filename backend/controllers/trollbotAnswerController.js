const replies = require('../data/replies.json') // JSON object containing bot's replies by action category
const getArtistInfo = require('../data/readFromSpotify')

let messages = [{ body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }]

const botAnswer = ( {message} ) => {
    const response = getResponse(message)
    return response
}

const getResponse = async ( userMessage ) => {
    console.log('Entered trollbotAnswerController:getResponse().')
    try {
        const messageType = getMessageType(userMessage)

        const reply = await chooseReply(messageType)

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
  console.log(messages)
    return messages
}

const clearMessages = () => {
    messages = [{ body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }]
}

const getMessageType = ( userMessage ) => {
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

const chooseReply = async ( messageType ) => {
    console.log('Entered trollbotAnswerController:chooseReply()')

    let repliesNumber = Math.floor(Math.random() * 3)

    if (messageType == 'opening') {
      return replies.opening[repliesNumber]
    }
    if (messageType == 'closing') {
      return replies.closing[repliesNumber]
    }
    if (messageType == 'question') {
      return replies.question[repliesNumber]
    }
    if (messageType == 'other') {
      const answer = await getArtistInfo()
      if (typeof answer === "string" || answer instanceof String) {
          return answer
      } else {
          return "ERROR"
      }
    }
  }



exports.botAnswer = botAnswer
exports.getGreeting = getGreeting
exports.getMessages = getMessages
exports.clearMessages = clearMessages
