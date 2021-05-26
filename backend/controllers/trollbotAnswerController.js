const replies = require('../data/replies.json') // JSON object containing bot's replies by action category




const botAnswer = ( {userMessage} ) => {

    const response = getResponse(userMessage)
    return response
    
}

const getResponse = (userMessage) => {

    const messageType = messageType(userMessage)
    const reply = chooseReply(messageType)

    const messageObject = {
        body: body.message,
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

    messages = [messageObject, replyObject]

    return messages
}

const getGreeting = () => {
    return { body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }
  }
  

const messageType = (userMessage) => {

    userMessage = userMessage.toLowerCase()
    
    if (userMessage === 'hello') {
        return 'greeting'
    } else if (userMessage === "bye") {
        return 'closing'
    } else if (userMessage.includes("?")) {
        return 'question'
    } else {
        return 'other'
    }

}

const chooseReply = ( {messageType} ) => {

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