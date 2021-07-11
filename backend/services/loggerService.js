const createWriter = require('csv-writer').createObjectCsvWriter;
const logger = require('../utils/logger')

const writer = createWriter({
  path: './../logs/conversation_log.csv',
  header: [
    {id: 'body', title: 'Message'},
    {id: 'user', title: 'Nickname'},
    {id: 'date', title: 'Timestamp'},
    {id: 'id', title: 'id'},
  ]
})

const exampleData = [
  {
    timestamp: '11-07-2021-10:16',
    nickname: 'Tessa',
    message: 'I love Lady Gaga',
    intention: 'likes_artist'
  }, {
    timestamp: '11-07-2021-10:17',
    nickname: 'Alex',
    message: 'Pop sucks',
    intention: 'artist_dismissal'
  }
]

const logMessage = async (message) => {
  return writer.writeRecords( [ message ])
}

module.exports = { logMessage }
