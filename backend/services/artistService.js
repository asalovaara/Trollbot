const { MongoClient } = require('mongodb')

const main = async () => {
  const mongoUrl = 'mongodb://localhost:27017'
  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()

    await addArtist(client, 'Ariana Grande', 'pop', 'she')
    await addArtist(client, 'Abba', 'pop', 'they')
    await addArtist(client, 'Muse', 'rock', 'they')
    await addArtist(client, 'Lil Nas X', 'rap', 'he')

    await findArtists(client)
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }

}

// add an artist to the db if doesn't exist yet
const addArtist = async (client, artistName, artistGenre, artistPronoun) => {
  await client.db('rasalogs').collection('artists').updateOne(
   { name: artistName, genre: artistGenre, pronoun: artistPronoun },
   { $set: { name: artistName, genre: artistGenre, pronoun: artistPronoun } },
   { upsert: true }
 )
}

// delete artist from the db
const deleteArtist = async (client, artistName) => {
  await client.db('rasalogs').collection('artists').deleteOne({ name: artistName })
}

// query the db
const findArtists = async (client) => {
  const result = await client.db('rasalogs').collection('artists').find( {} )

  await result.forEach( obj => {
    console.log(obj)
  })
}

main().catch(console.error)
