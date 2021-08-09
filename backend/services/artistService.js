/* eslint-disable no-unused-vars */
const { getGenre } = require('./wikiService')
const fs = require('fs')
const readline = require('readline')
const logger = require('../utils/logger')
const { API_URL, MONGODB_URI } = require('../utils/config')
const mongoose = require('mongoose')
const { saveArtistToDatabase } = require('../database/databaseService')
const { getArtist } = require('./musicbrainzService')

// run this file to add artists to the database

const main = async () => {
  const filepath = '../data/artists.txt'
  // added this url here because getting it from config/env didnt work for some reason
  const atlas_uri = "mongodb+srv://trollbot:1234567890@trollbot.hsb0q.mongodb.net/Trollbot?retryWrites=true&w=majority"

  try {

    mongoose.connect(atlas_uri, { useNewUrlParser: true, useUnifiedTopology: true })
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
      await saveArtistToDatabase(artistObj)
      // Added this sleep because I think the queries were executing too fast and they stopped after a few queries. This fixed it
      await sleep(500)
    } catch (e) {
      console.error(e)
    }

  }
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

main().catch(console.error)
