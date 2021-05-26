const replies = require('../data/replies.json') // JSON object containing bot's replies by action category

let messageList = []

const getAllMessages = () => {
  return messageList
}

const deleteAllMessages = () => {
  messageList = []
}

const botAnswer = (userMessage) => {
  const response = getResponse(userMessage)
  return response
}

const getResponse = (userMessage) => {

  const type = messageType(JSON.stringify(userMessage))
  const reply = chooseReply(type)

  const messageObject = {
    body: userMessage,
    user: 'Human',
    date: new Date().toISOString(),
    id: messageList.length
  }
  const replyObject = {
    body: reply,
    user: 'Bot',
    date: new Date().toISOString(),
    id: messageList.length + 1
  }

  messageList = messageList.concat(messageObject)
  messageList = messageList.concat(replyObject)

  const messages = [messageObject, replyObject]
  return messages
}

const messageType = (userMessage) => {

  userMessage = userMessage.toLowerCase()

  if (userMessage == '"hello"') {
      return 'greeting'
  } else if (userMessage === '"bye"') {
      return 'closing'
  } else if (userMessage.includes("?")) {
      return 'question'
  } else {
      return 'other'
  }

}

const chooseReply = (messageType) => {

  let repliesNumber = Math.floor(Math.random() * 3)

  if (messageType == 'greeting') {
      return replies.opening[repliesNumber]
  } else if (messageType == 'closing') {
      return replies.closing[repliesNumber]
  } else if (messageType == 'question') {
      return replies.question[repliesNumber]
  } else  if (messageType == 'other') {
      return replies.other[repliesNumber]
  }
}

const getGreeting = () => {
  return { body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }
}

exports.botAnswer = botAnswer
exports.getGreeting = getGreeting
exports.getAllMessages = getAllMessages
exports.deleteAllMessages = deleteAllMessages
