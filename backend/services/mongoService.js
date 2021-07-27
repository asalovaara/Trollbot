const { MongoClient } = require('mongodb')
const createWriter = require('csv-writer').createObjectCsvWriter

const main = async () => {
  const uri = 'mongodb://localhost:27017'
  const client = new MongoClient(uri)

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
    })
    logMessage(obj.events)
  })
  //   arr = obj['events']
  //   arr.forEach( obj2 => {
  //     if (obj2['parse_data'] !== undefined) {
  //       console.log(obj2['parse_data.intent'])
  //     }
  //   })
  // })
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
    //{id: 'intent', title: 'intent'}
  ]
})

const formatTimestamp = (epoch) => {
  var utcSeconds = epoch
  var d = new Date(0)
  d.setUTCSeconds(utcSeconds)
  return d.toLocaleString()
}

main().catch(console.error)
