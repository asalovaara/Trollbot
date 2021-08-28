const botRouter = require('express').Router()
// const { rasaAnswer, getMessages, clearMessages, genreToRasa } = require('../services/trollbot')
const { getArtistByName } = require('../database/databaseService')
const { getGenreByName } = require('../services/spotifyService')
const { updateOneArtist } = require('../services/artistService')

botRouter.get('/genre/:artist', async (req, res) => {

  const artist = req.params.artist
  let response = await getArtistByName(artist)
  if (response === undefined) {
    // If musicbrainz does not have the genre, gets it from spotify
    response = await getGenreByName(artist)
    res.json(response)
  } else {
    console.log(response)
    console.log(response.genres[0])
    res.json(response.genres[0])
  }
})

botRouter.get('/:artist', async (req, res) => {
  const artist = req.params.artist
  // Updates the artist in the database. Remove later when artist fields are final!
  await updateOneArtist(artist)
  // Gets artist from database.
  const response = await getArtistByName(artist)
  console.log(response)
  if (response === undefined) {
    res.json(undefined)
  } else {
    res.json(response)
  }
})

module.exports = botRouter
