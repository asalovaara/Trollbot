const intents = require('../data/userIntents.json')

const getIntent = (message) => {
  console.log('intent msg', message)
  const msg = message.toLowerCase()
  let intent = 'other'
  intents.intents.forEach(i => {
    i.startsWith.forEach(line => {
      if (msg.startsWith(line.toLowerCase())) {
        intent = i.name
        return intent
      }
    })
    i.includes.forEach(line => {
      if (msg.includes(line.toLowerCase())) {
        intent = i.name
        return intent
      }
    })
  })
  return intent
}

module.exports = getIntent
