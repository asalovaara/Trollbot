/* eslint-disable no-unused-vars */
const { MONGODB_URI } = require('../utils/config')
const mongoose = require('mongoose')
const path = require('path')
const { addAllArtistsFromTextFile } = require('./services/artistService')

// run this file to add artists to the database

const main = async () => {
  const filepath = path.resolve(__dirname, '../data/artists.txt')

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

main().catch(console.error)

