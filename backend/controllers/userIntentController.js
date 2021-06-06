// swap this when needed. must export a getIntent function.
const intentModule = require('../userIntentModules/userIntentFromJson')
// ^ swap this

const getIntent = (message) => {
  return intentModule(message)
}

module.exports = getIntent