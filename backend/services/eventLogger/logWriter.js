const { MongoClient } = require('mongodb')
const createWriter = require('csv-writer').createObjectCsvWriter
const { formatEvent, formatStories, removeIgnoredEvents } = require('./logFormatter')
const path = require('path')
const logger = require('../../utils/logger')

const main = async () => {
  const mongoUrl = 'mongodb://localhost:27017'
  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    await findEvents(client)
    logger.show('Successfully created log')
  } catch (e) {
    logger.error(e)
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
    logger.error(e)
  }

}

// define csv file location + titles
// const roomName = '' + getBotRoom()
const logPath = path.resolve(__dirname, '../../../logs/log_room.csv').replace(/room/g, 'Test')
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
    { id: 'story', title: 'story'},
    { id: 'rule', title: 'rule'}
  ]
})

main().catch(console.error)
