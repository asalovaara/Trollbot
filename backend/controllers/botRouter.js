const botRouter = require('express').Router()
// const { rasaAnswer, getMessages, clearMessages, genreToRasa } = require('../services/trollbot')
const { getArtistByName } = require('../database/databaseService')

// botRouter.get('/', (req, res) => {
//   res.json(getMessages())
// })

// botRouter.post('/', async (req, res) => {
//   // const response = await botAnswer(req.body)
//   const response = await rasaAnswer(req.body)
//   console.log('trollbotRouter-post bot response', response)
//   res.json(response)
// })

// botRouter.delete('/', (req, res) => {
//   clearMessages()
//   res.json(getMessages())
// })

botRouter.get('/genre/:artist', async (req, res) => {

  const artist = req.params.artist
  const response = await getArtistByName(artist)
  if (response === undefined) {
    res.json(undefined)
  } else {
    console.log(response)
    console.log(response.genres[0])
    res.json(response.genres[0])
  }
})

botRouter.get('/:artist', async (req, res) => {
  const artist = req.params.artist
  const response = await getArtistByName(artist)
  if (response === undefined) {
    res.json(undefined)
  } else {
    res.json(response)
  }
})

module.exports = botRouter
