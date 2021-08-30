/* eslint-disable no-unused-vars */
const { getGenre } = require('./wikiService')
const fs = require('fs')
const readline = require('readline')
const logger = require('../utils/logger')
const { API_URL, MONGODB_URI } = require('../utils/config')
const mongoose = require('mongoose')
const { saveArtistToDatabase, updateArtist, deleteAll } = require('../database/databaseService')
const { getArtist } = require('./musicbrainzService')

// run this file to add artists to the database

const main = async () => {
  const filepath = '../data/artists.txt'

  try {

    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('connected to MongoDB')
      })
      .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
      })

    addAllArtistsFromTextFile(filepath)

  } catch (e) {
    console.error(e)
  }

}

const updateOneArtist = async (artist) => {
  const artistObj = await getArtist(artist)
  if (artistObj !== undefined) {
    await updateArtist(artistObj)
  }
}

// Go through all artists (lines) in file.
// Add genre if doesn't exist yet.
// Add artist to genre sub-document.
const addAllArtistsFromTextFile = async (filepath) => {

  let rl = readline.createInterface({
    input: fs.createReadStream(filepath),
    output: process.stdout,
    console: false
  })

  for await (const line of rl) {
    try {
      const artistObj = await getArtist(line)
      if (artistObj !== undefined) {
        await saveArtistToDatabase(artistObj)
      }
      // Added this sleep because I think the queries were executing too fast and they stopped after a few queries. This fixed it
      await sleep(2000)
    } catch (e) {
      console.error(e)
    }

  }
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

main().catch(console.error)

module.exports = {
  updateOneArtist
}
