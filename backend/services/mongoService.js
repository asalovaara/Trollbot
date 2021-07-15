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
  //const projection = [ { $project: { 'events.event': 1} } ]
  //const result = await client.db('rasalogs').collection('conversations').aggregate(projection)
  const result = await client.db('rasalogs').collection('conversations').find( {} )

  let arr
  await result.forEach(function(obj){
    arr = obj['events']
    logMessage(arr)
  })
}

// write stuff into the csv file
const logMessage = async (message) => {
  return writer.writeRecords( message )
}

// define csv file location + titles
const writer = createWriter({
  path: './../logs/conversation_log.csv',
  header: [
    {id: 'timestamp', title: 'timestamp'},
    {id: 'event', title: 'event'},
    {id: 'name', title: 'name'},
    {id: 'text', title: 'message'},
    {id: 'policy', title: 'policy'},
    {id: 'confidence', title: 'confidence'}
    // {id: 'action_text', title: 'action_text'},
    // {id: 'hide_rule_turn', title: 'hide_rule_turn'},
  ]
})

main().catch(console.error)
