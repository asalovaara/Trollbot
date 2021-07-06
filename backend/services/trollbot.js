const replies = require('../data/replies.json') // JSON object containing bot's replies by action category
const getIntent = require('./intentService')
const logger = require('../utils/logger')
const wiki = require('./wikiService')

let messages = [{ body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }]
const { getRasaRESTResponse } = require('./rasaService')
const getGenre = require('./wikiService')

const rasaAnswer = ({ message }) => {
  return getRasaResponse(message)
}

const botAnswer = ({ message }) => {
  return getResponse(message)
}

const getRasaResponse = async (message) => {

  const reply = await getRasaRESTResponse(message)

  const messageObject = {
    body: message,
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

}

const getResponse = async (userMessage) => {
  logger.info('Entered trollbotAnswerController:getResponse().')
  try {
    const messageType = getMessageType(userMessage)

    const reply = await chooseReply(userMessage, messageType)
    logger.info(`User message: ${userMessage}`)
    logger.info(`Bot reply: ${reply}`)

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
  try {
    const intent = getIntent(userMessage)

    if (intent === 'opening') {
      return 'opening'
    } else if (intent === 'closing') {
      return 'closing'
    } else if (intent == 'question') {
      return 'question'
    } else {
      return 'other'
    }
  } catch (e) {
    console.error(e)
  }

}

const chooseReply = async (userMessage, messageType) => {
  logger.info('Entered trollbotAnswerController:chooseReply()')

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
    return await wiki(userMessage)
  }
}

const genreToRasa = async (artist) => {

  const genre = await getGenre(artist)
  return genre
}


module.exports = { botAnswer, rasaAnswer, getGreeting, getMessages, getResponse, clearMessages, genreToRasa }