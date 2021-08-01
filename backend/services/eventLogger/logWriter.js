const { MongoClient, CURSOR_FLAGS } = require('mongodb')
const createWriter = require('csv-writer').createObjectCsvWriter
const {formatEvent, removeIgnoredEvents} = require('./logFormatter')
const path = require('path')

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
  const result = await client.db('rasalogs').collection('conversations').find({})

  await result.forEach(obj => {

    let arr = obj.events
    arr.forEach(obj => {
      
      obj = formatEvent(obj)

    })

    const trimmedArr = removeIgnoredEvents(arr)
    logMessage(trimmedArr)
  })
}

// finds the conversation id.
// const getConversationId = async (client) => {
//   const result = await client.db('rasalogs').collection('conversations').find( {} )
//   let id
//   await result.forEach( obj => {
//     id = obj._id + ''
//   })
//   let idArr = id.split('\"')
//   return idArr[0]
// }

// write stuff into the csv file
const logMessage = async (message) => {

  try {
    await writer.writeRecords(message)
  } catch (e) {
    console.error(e)
  }

}

// define csv file location + titles
const logPath = path.resolve(__dirname, "../../../logs/conversation_log.csv")
const writer = createWriter({
  path: logPath,
  header: [
    { id: 'timestamp', title: 'timestamp' },
    { id: 'event', title: 'event' },
    { id: 'name', title: 'name' },
    { id: 'text', title: 'message' },
    { id: 'policy', title: 'policy' },
    { id: 'confidence', title: 'confidence' },
    { id: 'intent', title: 'interpreted intent' }
  ]
})

main().catch(console.error)
