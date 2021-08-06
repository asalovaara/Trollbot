const { readFile } = require('./yamlReader')
const YAML = require('yaml')

const defaultActions = ['action_listen', 'action_restart', 'action_session_start', 'action_default_fallback', 'action_deactivate_loop', 'action_revert_fall', 'action_two_stage_fallback', 'action_default_ask_affirmation', 'action_default_ask_rephrase', 'action_back', 'action_unlikely_intent']
const ignoredEvents = ['user_featurization', 'users', 'artists', 'last_message_sender']
let lastMessageSenderId


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

const formatSlotSet = (obj) => {
  if (obj.name === 'active_user') {
    obj.story_step = 'active_user: ' + obj.value
  } else if (obj.name === 'last_message_sender') {
    lastMessageSenderId = obj.value
  }
  obj.event = 'slot value was set'
  obj.name = 'slot: ' + obj.name + ' | value: ' + obj.value

  return obj
}

// formats the log appearance of different event types
const formatEvent = (obj) => {
  if (obj.event === 'action') {
    obj = formatAction(obj)
  } else if (obj.event === 'slot') {
    obj = formatSlotSet(obj)
  } else if (obj.event === 'user') {
    obj.event = 'user uttered'
    obj.userID = lastMessageSenderId
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
  const trimmedArr = arr.filter(obj => !(ignoredEvents.includes(obj.event && obj.name)))

  return trimmedArr
}

module.exports = { formatEvent, formatStories, removeIgnoredEvents }