var uuid = require('uuid')
const { botAnswer } = require('./services/trollbot')

const messages = []

const addMessage = (room, message) => {
  const msg = { id: uuid.v4(), room, ...message }
  console.log('addMessage', msg)
  //{ body: 'Hello, I am a bot.', user: 'Bot', date: '1.1.2021', id: 0 }
  messages.push(msg)
  return msg
}

const getAnswer = (message) => {
  console.log('message', message.body)
  const botMessage = { message: message.body }
  const answer = botAnswer(botMessage)
  let msg = ''
  answer.then(response => {
    const res = response[response.length - 1]
    msg = {
      id: 'botanswerid' + res.id,
      room: 'Test',
      body: res.body,
      senderId: 'bot',
      user: {
        name: 'Bot',
        picture: 'https://media.wired.com/photos/5cdefb92b86e041493d389df/1:1/w_988,h_988,c_limit/Culture-Grumpy-Cat-487386121.jpg'
      }
    } //response[response.length - 1]
    console.log('answer',msg)
    messages.push(msg)
  })
  // console.log('answer', answer)
  return msg
}

const removeMessage = (id) => {
  const index = messages.findIndex((message) => message.id === id)

  if (index !== -1) return messages.splice(index, 1)[0]
}

const getMessage = (id) => messages.find((message) => message.id === id)

const getMessagesInRoom = (room) =>
  messages.filter((message) => message.room === room)

module.exports = { addMessage, getAnswer, removeMessage, getMessage, getMessagesInRoom }
