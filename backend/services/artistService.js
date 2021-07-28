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
    //await findArtistsByGenre(client, 'hip hop music')
    await findAll(client)

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
      const genre = await getGenre(artistName)
      await addGenre(client, genre)
      await addArtist(client, genre, artistName)
      console.log('Added ' + artistName + ' with genre ' + genre + '. Taking a break...')
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
  const result = await client.db('rasalogs').collection('artists').find( {} )
  console.log('---------- database contents -----------')
  await result.forEach( obj => {
    console.log(obj)
  })
}

// Find artists filtered by genre
const findArtistsByGenre = async (client, genre) => {
  const result = await client.db('rasalogs').collection('artists').find( {
    genre: genre
  } )
  console.log('---------- artists of genre ' + genre + ' -----------')
  await result.forEach( obj => {
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

main().catch(console.error)
