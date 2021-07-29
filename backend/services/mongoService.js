const { MongoClient } = require('mongodb')
const createWriter = require('csv-writer').createObjectCsvWriter

const defaultActions = ['action_listen', 'action_restart', 'action_session_start', 'action_default_fallback', 'action_deactivate_loop', 'action_revert_fall', 'action_two_stage_fallback', 'action_default_ask_affirmation', 'action_default_ask_rephrase', 'action_back', 'action_unlikely_intent']

const ignoredEvents = ['user_featurization']

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

      console.log(obj)

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

const formatIntent = (obj) => {

  if (obj.parse_data !== undefined) {
    const intentName = obj.parse_data.intent.name
    obj.intent = intentName
  }

  return obj
}

const formatEvent = (obj) => {

  obj.timestamp = formatTimestamp(obj.timestamp)
  
  if (obj.event === 'action') {
    if (defaultActions.includes(obj.name)) {
      obj.event = 'triggered Rasa default action'
      obj.name = 'action: ' + obj.name

    } else if (obj.name.includes('utter')) {
      obj.event = 'triggered bot response'
      obj.name = 'response: ' + obj.name
    } else {
      obj.event = 'triggered custom action'
      obj.name = 'action: ' + obj.name
    }
  } else if (obj.event === 'slot') {
    obj.event = 'slot value was set'
    obj.name = 'slot: ' + obj.name + ' | value: ' + obj.value
  } else if (obj.event === 'user') {
    obj.event = 'user uttered'
  } else if (obj.event === 'bot') {
    obj.event = 'bot uttered'
  } else if (obj.event === 'session_started') {
    obj.event = 'started new conversation session'
  }

  obj = formatIntent(obj)

  return obj
}

const removeIgnoredEvents = (arr) => {

  const trimmedArr = arr.filter(obj => !(ignoredEvents.includes(obj.event)))

  return trimmedArr

}

main().catch(console.error)
