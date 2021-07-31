const { getRasaRESTResponse } = require('./rasaService')
const { getGenreByName } = require('./spotifyService')

let messages = []
let replies = []

const rasaAnswer = (data) => {
  return getRasaResponse(data)
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
      senderId: data.senderId,
      user: { id: 'bot', user: 'Bot' },
      date: new Date().toISOString(),
      id: messages.length + (i + 1)
    }
    messages = [...messages, replyObject]
    replies = [...replies, replyObject]
  }

  return replies

}


const genreToRasa = async (artist) => {

  const genre = await getGenreByName(artist)

  return genre

}


module.exports = { rasaAnswer, genreToRasa }
