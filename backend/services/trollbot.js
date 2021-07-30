const getIntent = require('./intentService')
const logger = require('../utils/logger')
const { getRasaRESTResponse } = require('./rasaService')
const { getGenreByName } = require('./spotifyService')

let messages = []
let replies = []

const rasaAnswer = (data) => {
  return getRasaResponse(data)
}

const botAnswer = (data) => {
  return getResponse(data.body)
}

const getRasaResponse = async (data) => {

  const reply = await getRasaRESTResponse(data)

  const messageObject = {
    body: data.body,
    socetId: data.socetId,
    user: data.user,
    date: new Date().toISOString(),
    id: messages.length + 1
  }

  messages = [...messages, messageObject]

  for (let i = 0; i < reply.length; i++) {
    const replyObject = {
      body: reply[i].text,
      socketId: data.socketId,
      user: { id: 'bot', user: 'Bot' },
      date: new Date().toISOString(),
      id: messages.length + (i + 1)
    }
    messages = [...messages, replyObject]
    replies = [...replies, replyObject]
  }

  return replies

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
    return replies.opening[repliesNumber]
  }
  if (messageType == 'closing') {
    return replies.closing[repliesNumber]
  }
  if (messageType == 'question') {
    return replies.question[repliesNumber]
  }
  if (messageType == 'other') {
    return await genreToRasa(userMessage)
  }
}

const genreToRasa = async (artist) => {

  //get genre from wikipedia
  //const genre = await getGenre(artist)

  //get genre from spotify
  const genre = await getGenreByName(artist)

  return genre

}


module.exports = { botAnswer, rasaAnswer, getGreeting, getMessages, getResponse, clearMessages, genreToRasa }
