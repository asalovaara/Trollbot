const { readFile } = require('./yamlReader')
const { matchLogWithStories } = require('./storyMatcher')
const diff = require('deep-diff').diff

// Rasa default actions (see https://rasa.com/docs/rasa/default-actions/)
const defaultActions = ['action_listen', 'action_restart', 'action_session_start', 'action_default_fallback', 'action_deactivate_loop', 'action_revert_fall', 'action_two_stage_fallback', 'action_default_ask_affirmation', 'action_default_ask_rephrase', 'action_back', 'action_unlikely_intent']
// Events appended to the conversation tracker by Trollbot backend
const backendEvents = ['users', 'last_message_sender']
// Events hidden from the log
const ignoredEvents = ['user_featurization']
// Slots whose values affect story paths
const storyAlteringSlots = ['task_activated', 'same_artist_liked', 'decision_phase']

let lastMessageSenderId
let users = {}
let artists = {}

// formats log event timestamp to human-readable local time
const formatTimestamp = (epoch) => {
  var utcSeconds = epoch
  var d = new Date(0)
  d.setUTCSeconds(utcSeconds)

  return d.toLocaleString()
}

// extracts intent from parse_data object and sets it as a top level event variable
const formatIntent = (obj) => {
  if (obj.parse_data !== undefined) {
    const intentName = obj.parse_data.intent.name
    obj.intent = intentName
    obj.story_step = 'intent: ' + intentName
  }

  return obj
}

//sets event source tag based on whether the event was appended to the tracker by Rasa Core or Trollbot Backend
const formatEventSource = (obj) => {
  if (backendEvents.includes(obj.name)) {
    obj.source = 'Trollbot Backend'
  } else {
    obj.source = 'Rasa Server'
  }

  return obj
}

// formats the log appearance of different action events
const formatAction = (obj) => {
  if (defaultActions.includes(obj.name)) {
    obj.event = 'triggered Rasa default action'
    obj.name = 'action: ' + obj.name
  } else if (obj.name.substring(0, 5) === 'utter') {
    obj.story_step = 'action: ' + obj.name
    obj.event = 'triggered bot response'
    obj.name = 'response: ' + obj.name
  } else {
    obj.event = 'triggered custom action'
    obj.name = 'action: ' + obj.name
    obj.story_step = obj.name
  }

  return obj
}

/**
 * formats the log appearance of slot events
 * @param {*} obj tracker event object
 * @returns
 */

const formatSlotSet = (obj) => {
  obj.event = 'slot value was set'

  if (storyAlteringSlots.includes(obj.name)) {
    obj.story_step = obj.name + ': ' + obj.value
  }
  
  if (obj.name === 'last_message_sender') {
    lastMessageSenderId = obj.value
  } else if (obj.name === 'users') {
    // console.log(obj.value)
    formatUserJoiningOrLeaving(obj)
    const temp = obj.value
    obj.value = formatObjectSlotValue(users, obj.value)
    users = temp
  } else if (obj.name === 'artists') {
    const temp = obj.value
    obj.value = formatObjectSlotValue(artists, obj.value)
    artists = temp
  } 

  obj.name = 'slot: ' + obj.name + ' | ' + obj.value

  return obj
}

// formats the log appearance of user events
const formatUserEvent = (obj) => {
  obj.event = 'user uttered'
  obj.userID = lastMessageSenderId
  if (lastMessageSenderId !== undefined) {
    obj.username = users[lastMessageSenderId].name
  }
  return obj
}

/**
 * formats the log appearance of object slot values to display only changes instead of the entire object tree
 * @param {*} oldValue slot object tree before update
 * @param {*} newValue slot object tree after update
 * @returns string indicating what was changed or 'no changes' if nothing was changed
 */

const formatObjectSlotValue = (oldValue, newValue) => {
  const changes = diff(oldValue, newValue)
  // console.log(changes)
  if (changes !== undefined) {
    const path = JSON.stringify(changes[0].path).replace(/["[\]]/g, '').replace(/,/g, '.')
    const value = JSON.stringify(changes[0].rhs)

    return path + ': ' + value
  } else {
    return 'no changes'
  }
}

// formats (Rasa generated) intents triggered by timers
const formatExternalIntentEvent = (obj) => {
  obj.event = 'timer triggered external intent'
  obj.text = '' 

  return obj
}



// formats the log appearance of different event types
const formatEvent = (obj) => {
  obj = formatEventSource(obj)
  if (obj.event === 'action') {
    obj = formatAction(obj)
  } else if (obj.event === 'slot') {
    obj = formatSlotSet(obj)
  } else if (obj.event === 'user') {
    if (obj.text.substring(0, 8) === 'EXTERNAL') {
      obj = formatExternalIntentEvent(obj)
    } else {
      obj = formatUserEvent(obj)
    }
  } else if (obj.event === 'bot') {
    obj.event = 'bot uttered'
  } else if (obj.event === 'session_started') {
    obj.event = 'started new conversation session'
  } else if (obj.event === 'reminder') {
    obj.event = 'activated timer'
    obj.name = 'timer: ' + obj.name
  }
  obj.timestamp = formatTimestamp(obj.timestamp)
  obj = formatIntent(obj)

  return obj
}

// fetches rasa's stories from stories.yml and starts story matching with given event log
const formatStories = (logArray, dataFolder) => {
  const storyFile = '../../rasa/' + dataFolder + '/stories.yml'
  const ruleFile = '../../rasa/' + dataFolder + '/rules.yml'
  const stories = readFile(storyFile).stories
  const rules = readFile(ruleFile).rules

  return matchLogWithStories(stories, rules, logArray)
}

const formatUserJoiningOrLeaving = (obj) => {
  if (Object.keys(obj.value).length > Object.keys(users).length) {
    obj.event = 'user joined'
  } else if (Object.keys(obj.value).length < Object.keys(users).length) {
    obj.event = 'user left'
  }

  return obj
}

// removes events specified in the ignoredEvents array (improves log readability)
const removeIgnoredEvents = (arr) => {
  let trimmedArr = arr.filter(obj => !(ignoredEvents.includes(obj.event)))
  trimmedArr = trimmedArr.filter(obj => !(ignoredEvents.includes(obj.name)))

  return trimmedArr
}

module.exports = { formatEvent, formatStories, removeIgnoredEvents }
