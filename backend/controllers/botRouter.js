const botRouter = require('express').Router()
const { getGenreByName } = require('../services/spotifyService')

botRouter.get('/genre/:artist', async (req, res) => {

  const artist = req.params.artist
  const response = await getGenreByName(artist)
  res.json(response)
})

module.exports = botRouter
