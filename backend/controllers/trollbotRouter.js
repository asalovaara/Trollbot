const trollbotRouter = require('express').Router()
const { rasaAnswer, getMessages, clearMessages, genreToRasa } = require('../services/trollbot')

trollbotRouter.get('/', (req, res) => {
  res.json(getMessages())
})

trollbotRouter.post('/', async (req, res) => {
  // const response = await botAnswer(req.body)
  const response = await rasaAnswer(req.body)
  res.json(response)
})

trollbotRouter.delete('/', (req, res) => {
  clearMessages()
  res.json(getMessages())
})

trollbotRouter.get('/genre/:artist', async (req, res) => {

  const artist = req.params.artist
  const response = await genreToRasa(artist)
  res.json(response)
})

module.exports = trollbotRouter
