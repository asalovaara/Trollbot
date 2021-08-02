const { getRasaRESTResponse } = require('./rasaService')
const { getGenreByName } = require('./spotifyService')

// let messages = []
// let replies = []

const rasaAnswer = (data) => {
  return getRasaResponse(data)
}

const getRasaResponse = (data) => {

  const reply = getRasaRESTResponse(data)

  /*   const messageObject = {
    body: message,
    user: 'Human',
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
    messages.push(replyObject)
    replies.push(replyObject)
  } */

  return //reply
}


const genreToRasa = async (artist) => {

  const genre = await getGenreByName(artist)

  return genre

}


module.exports = { rasaAnswer, genreToRasa }
