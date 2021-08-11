const { MongoClient } = require('mongodb')
const createWriter = require('csv-writer').createObjectCsvWriter
const { formatEvent, formatStories, removeIgnoredEvents } = require('./logFormatter')
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
    const trimmedArr = removeIgnoredEvents(arr)
    
    arr.forEach(obj => {

      // console.log(obj)
      formatEvent(obj)

    })

    const logWithStories = formatStories(trimmedArr)
    logMessage(logWithStories)
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
const logPath = path.resolve(__dirname, '../../../logs/conversation_log.csv')
const writer = createWriter({
  path: logPath,
  header: [
    { id: 'timestamp', title: 'timestamp' },
    { id: 'event', title: 'event' },
    { id: 'name', title: 'name' },
    { id: 'source', title: 'event source'},
    { id: 'userID', title: 'userID'},
    { id: 'username', title: 'username'},
    { id: 'text', title: 'message' },
    { id: 'policy', title: 'policy' },
    { id: 'confidence', title: 'confidence' },
    { id: 'intent', title: 'interpreted intent' },
    { id: 'story_step', title: 'story step'},
    { id: 'story', title: 'story'}
  ]
})

main().catch(console.error)
