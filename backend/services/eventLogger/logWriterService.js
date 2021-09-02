const { MongoClient } = require('mongodb')
const createWriter = require('csv-writer').createObjectCsvWriter
const { formatEvent, formatStories, removeIgnoredEvents } = require('./logFormatter')
const path = require('path')
const fs = require('fs')
const logger = require('../../utils/logger')
const moment = require('moment')

const botTypeDataFolders =
{
  Normal: 'data_nice',
  Troll: 'data_troll'
}

/**
 * Runs the log writer with given options
 * @param {source: 'LOCAL' or 'ATLAS', room: 'all' or 'roomName', delete: true or false, list: true or false, dataFolder: folderName} options 
 */

const runLogger = async (options) => {

  logger.show('Running Trollbot log writer with following options:')
  logger.show(options)

  let mongoUrl

  if (options.source === 'ATLAS') {
    mongoUrl = 'mongodb+srv://trollbot:1234567890@trollbot.hsb0q.mongodb.net/Trollbot?retryWrites=true&w=majority'
  } else {
    mongoUrl = 'mongodb://localhost:27017'
  }

  const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

  try {
    await client.connect()
    if (options.list) {
      await listItems(client, options.source)
    }
    else if (options.delete) {
      await deleteItems(client, options.room, options.source)
    } else {
      await findEvents(client, options.room, options.source, options.dataFolder)
    }
  } catch (e) {
    logger.error(e)
  } finally {
    await client.close()
  }
}

// query the db
const findEvents = async (client, room, source, folder) => {

  let result
  let searchMsg

  if (room === 'all') {
    result = await client.db('Trollbot').collection('conversations').find({})
    searchMsg = '\nSearching for ' + source + ' tracker store conversation log(s).'
  } else {
    result = await client.db('Trollbot').collection('conversations').find({ sender_id: room })
    searchMsg = '\nSearching for ' + source + ' tracker store conversation log for room ' + room + '.'
  }

  logger.show(searchMsg)
  let i = 0

  await result.forEach(room => {

    let arr = room.events
    const trimmedArr = removeIgnoredEvents(arr)

    arr.forEach(event => {
      if (event.name === 'bot_type' && folder === null) {
        folder = botTypeDataFolders[event.value]
      }
      formatEvent(event)
    })

    const logWithStories = formatStories(trimmedArr, folder)
    logMessage(logWithStories, room.sender_id)
    logger.show(room.sender_id + ' found')
    i++
  })

  if (i === 0) {
    logger.show('No log(s) found.')
  } else {
    logger.show(i + ' csv file(s) succesfully created.')
  }
}

const listItems = async (client, source) => {
  const result = await client.db('Trollbot').collection('conversations').find({})

  let i = 0
  logger.show('\nListing ' + source + ' tracker store conversation logs:')

  await result.forEach(room => {
    logger.show(room.sender_id)
    i++
  })

  if (i === 0) {
    logger.show('No tracker store conversation logs found.')
  } else {
    logger.show(i + ' tracker store conversation log(s) found.')
  }
}

const deleteItems = async (client, room, source) => {
  let result

  if (room === 'all') {
    result = await client.db('Trollbot').collection('conversations').deleteMany({})
    logger.show('All ' + source + ' tracker store logs succesfully deleted.')
  } else {
    result = await client.db('Trollbot').collection('conversations').findOneAndDelete({ sender_id: room })
    if (result.value === null) {
      logger.show('No ' + source + ' tracker store conversation log found for room ' + room + '.')
    } else {
      logger.show(source + ' tracker store conversation log for room ' + room + ' succesfully deleted.')
    }
  }
}

// write stuff into the csv file
const logMessage = async (message, roomName) => {

  const logFolder = path.resolve(__dirname, '../../../logs')
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
  }

  const dateTime = moment().local().format('HHmmssDDMMYYYY')
  const logPath = path.resolve(__dirname, '../../../logs/log_room.csv').replace(/room/g, roomName + '_' + dateTime)
  const writer = createWriter({
    path: logPath,
    header: [
      { id: 'timestamp', title: 'timestamp' },
      { id: 'event', title: 'event' },
      { id: 'name', title: 'name' },
      { id: 'source', title: 'event source' },
      { id: 'userID', title: 'userID' },
      { id: 'username', title: 'username' },
      { id: 'text', title: 'message' },
      { id: 'policy', title: 'policy' },
      { id: 'confidence', title: 'confidence' },
      { id: 'intent', title: 'interpreted intent' },
      { id: 'story_step', title: 'story step' },
      { id: 'story', title: 'story' },
      { id: 'rule', title: 'rule' }
    ]
  })

  try {
    await writer.writeRecords(message)
  } catch (e) {
    logger.error(e)
  }
}

module.exports = { runLogger }
