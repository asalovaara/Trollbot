const botRouter = require('express').Router()
// const { rasaAnswer, getMessages, clearMessages, genreToRasa } = require('../services/trollbot')
const { getArtistByName } = require('../database/databaseService')

botRouter.get('/genre/:artist', async (req, res) => {

  const artist = req.params.artist
  let response = await getArtistByName(artist)
  if (response === undefined) {
    res.json(undefined)
  } else {
    res.json(response.genres[0])
  }
})

module.exports = botRouter
