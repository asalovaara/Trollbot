/* eslint-disable no-unused-vars */
const { MongoClient } = require('mongodb')
const { getGenre } = require('./wikiService')
const fs = require('fs')
const readline = require('readline')

const main = async () => {
  const mongoUrl = 'mongodb://localhost:27017'
  const client = new MongoClient(mongoUrl)
  const filepath = '../data/artists.txt'

  try {
    await client.connect()

    //await deleteAll(client)
    //await addAllArtistsBasedOnGenre(client, filepath)
    await findArtistsByGenre(client, 'rock')
    //await findAll(client)

  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }

}

// Go through all artists (lines) in file.
// Add genre if doesn't exist yet.
// Add artist to genre sub-document.
const addAllArtistsBasedOnGenre = async (client, filepath) => {

  let rl = readline.createInterface({
    input: fs.createReadStream(filepath),
    output: process.stdout,
    console: false
  })

  for await (const line of rl) {
    try {
      const artistName = line
      let genre = await getGenre(artistName)
      genre = genreFilter(genre)

      await addGenre(client, genre)
      await addArtist(client, genre, artistName)
      console.log('Added ' + artistName + ' with genre ' + genre)
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

// Add an artist to the collection if doesn't exist yet.
// (Atm duplicates are added though so run deleteAll before adding.)
const addArtist = async (client, genre, artistName) => {
  await client.db('rasalogs').collection('artists').updateOne(
    { genre: genre },
    { $push: { name: artistName } },
    { upsert: true }
  )
}

// Add a genre to the collection if doesn't exist yet
const addGenre = async (client, genre) => {
  await client.db('rasalogs').collection('artists').updateOne(
    { genre: genre },
    { $set: { genre: genre } },
    { upsert: true }
  )
}

// Find all genres and their sub-document artists
const findAll = async (client) => {
  const result = await client.db('rasalogs').collection('artists').find({})
  console.log('---------- database contents -----------')
  await result.forEach(obj => {
    console.log(obj)
  })
}

// Find artists filtered by genre
const findArtistsByGenre = async (client, genre) => {
  const result = await client.db('rasalogs').collection('artists').find({
    genre: genre
  })
  console.log('---------- artists of genre ' + genre + ' -----------')
  await result.forEach(obj => {
    console.log(obj)
  })
}

// Delete artist from the collection
const deleteArtist = async (client, artistName) => {
  await client.db('rasalogs').collection('artists').deleteOne({ name: artistName })
}

// Delete everything from the collection
const deleteAll = async (client) => {
  await client.db('rasalogs').collection('artists').deleteMany({})
}

const genreFilter = (genre) => {
  const path = '../data/genres.txt'
  const list = fs.readFileSync(path).toString('utf-8')
  const splitted = list.split(';')

  let splittedGenre = genre.split(' ')
  if (splittedGenre[1] == undefined) {
    return genre
  }

  // If original genre is e.g. 'alt rock', we check if 'rock' matches a valid genre from the genres text file
  // (obviously it does, so 'rock' is returned)
  for (let i = 0; i < splitted.length; i++) {
    if (splitted[i] === splittedGenre[1]) {
      return splitted[i]
    } else if (splitted[i] === splittedGenre[0]) {
      return splitted[i]
    }
  }
  return genre
}

main().catch(console.error)
