const { MongoClient } = require('mongodb')
const createWriter = require('csv-writer').createObjectCsvWriter
const axios = require('axios')

const main = async () => {
  const mongoUrl = 'mongodb://localhost:27017'
  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    await findEvents(client)
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }

}

// query the db
const findEvents = async (client) => {
  const result = await client.db('rasalogs').collection('conversations').find( {} )

  await result.forEach( obj => {
    let arr = obj.events
    arr.forEach(obj => {
      obj.timestamp = formatTimestamp(obj.timestamp)
      if (obj.parse_data !== undefined) {
        const intentName = obj.parse_data.intent.name
        obj.intent = intentName
      }
    })
    logMessage(arr)
  })
}

// finds the conversation id.
const getConversationId = async (client) => {
  const result = await client.db('rasalogs').collection('conversations').find( {} )
  let id
  await result.forEach( obj => {
    id = obj._id + ''
  })
  let idArr = id.split('\"')
  return idArr[0]
}

// write stuff into the csv file
const logMessage = async (message) => {
  await writer.writeRecords( message )
}

// define csv file location + titles
const writer = createWriter({
  //relative address, works when run from services dir
  path: './../../logs/conversation_log.csv',
  header: [
    {id: 'timestamp', title: 'timestamp'},
    {id: 'event', title: 'event'},
    {id: 'name', title: 'name'},
    {id: 'text', title: 'message'},
    {id: 'policy', title: 'policy'},
    {id: 'confidence', title: 'confidence'},
    {id: 'intent', title: 'interpreted intent'}
  ]
})

const formatTimestamp = (epoch) => {
  var utcSeconds = epoch
  var d = new Date(0)
  d.setUTCSeconds(utcSeconds)
  return d.toLocaleString()
}

main().catch(console.error)
