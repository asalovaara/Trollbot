const { readFile } = require('./yamlReader')
const YAML = require('yaml')
const diff = require('deep-diff').diff

const defaultActions = ['action_listen', 'action_restart', 'action_session_start', 'action_default_fallback', 'action_deactivate_loop', 'action_revert_fall', 'action_two_stage_fallback', 'action_default_ask_affirmation', 'action_default_ask_rephrase', 'action_back', 'action_unlikely_intent']
const backendEvents = ['users', 'last_message_sender']
const ignoredEvents = ['user_featurization']
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
    if (obj.name === 'action_listen') {
      obj.story_step = '. . .'
    }
    obj.event = 'triggered Rasa default action'
    obj.name = 'action: ' + obj.name
  } else if (obj.name.includes('utter')) {
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
  if (obj.name === 'active_user') {
    obj.story_step = 'active_user: ' + obj.value
  } else if (obj.name === 'last_message_sender') {
    lastMessageSenderId = obj.value
  } else if (obj.name === 'users') {
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

/**
 * formats the log appearance of object slot values to display only changes instead of the entire object tree
 * @param {*} oldValue slot object tree before update
 * @param {*} newValue slot object tree after update
 * @returns string indicating what was changed or 'no changes' if nothing was changed
 */

const formatObjectSlotValue = (oldValue, newValue) => {
  const changes = diff(oldValue, newValue)
  if (changes !== undefined) {
    const path = JSON.stringify(changes[0].path).replace(/["\[\]]/g, '').replace(/,/g, '.')
    const value = JSON.stringify(changes[0].rhs)

    return path + ': ' + value
  } else {
    return 'no changes'
  }
}

// formats the log appearance of different event types
const formatEvent = (obj) => {
  obj = formatEventSource(obj)
  if (obj.event === 'action') {
    obj = formatAction(obj)
  } else if (obj.event === 'slot') {
    obj = formatSlotSet(obj)
  } else if (obj.event === 'user') {
    obj.event = 'user uttered'
    obj.userID = lastMessageSenderId
    if (lastMessageSenderId !== undefined) {
      obj.username = users[lastMessageSenderId].name
    }
  } else if (obj.event === 'bot') {
    obj.event = 'bot uttered'
  } else if (obj.event === 'session_started') {
    obj.event = 'started new conversation session'
  }
  obj.timestamp = formatTimestamp(obj.timestamp)
  obj = formatIntent(obj)

  return obj
}

// fetches rasa's stories from stories.yml and starts story matching with given event log
const formatStories = (logArray) => {
  const storyFile = '../../rasa/data/stories.yml'
  const data = readFile(storyFile)
  const stories = data.stories

  return matchLogWithStories(stories, logArray)
}

// matches event log with stories, adds corresponding story tags to the log
const matchLogWithStories = (stories, logArray) => {
  let storyStart = 0

  for (let i = 0; i < logArray.length; i++) {
    let matchingStories = stories

    if (logArray[i].story_step === '. . .') {

      for (let j = storyStart; j < i; j++) {
        let logStep = logArray[j].story_step

        if (logStep !== undefined) {
          matchingStories = matchStep(logStep, matchingStories)
        }
        logArray = addStoryTags(storyStart, j, matchingStories, logArray)
      }
      storyStart = i + 1
    }
  }

  return logArray
}

// filter stories not containing a given story step
const matchStep = (logStep, stories) => {
  const matchedStories = stories.filter(story => YAML.stringify(story).includes(logStep))

  return matchedStories
}

// tags matched events with the name of the matching story
const addStoryTags = (i, end, stories, logArray) => {
  if (stories.length === 1) {
    const tag = stories[0].story
    for (i; i <= end; i++) {
      logArray[i].story = tag
    }
  }

  return logArray
}

// removes events specified in the ignoredEvents array (improves log readability)
const removeIgnoredEvents = (arr) => {
  let trimmedArr = arr.filter(obj => !(ignoredEvents.includes(obj.event)))
  trimmedArr = trimmedArr.filter(obj => !(ignoredEvents.includes(obj.name)))

  return trimmedArr
}

module.exports = { formatEvent, formatStories, removeIgnoredEvents }
