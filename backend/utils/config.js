require('dotenv').config({ path: '../.env' })

/*
 * This is a config file. It reads environment variables and replaces any unused variable with default ones.
 */

let PORT = process.env.PORT || 3001
let CLIENT_ID = process.env.CLIENT_ID
let CLIENT_SECRET = process.env.CLIENT_SECRET
let API_URL = process.env.API_URL || '/api'
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
let RASA_NETWORK = process.env.RASA_NETWORK || 'http://localhost'
let TRACKER_STORE_URL = process.env.TRACKER_STORE_URL
let TASK_COMPLETE_REDIRECT_TARGET = process.env.TASK_COMPLETE_REDIRECT_TARGET || '/'
let ROOM_DESIRED_USERCOUNT = process.env.ROOM_DESIRED_USERCOUNT || 2

// Make sure to match bot type position with the corresponding port position
const BOT_TYPES = [  'Normal', 'Troll',   ]
const BOT_PORTS = [   5005,     5006,     ]



module.exports = {
  PORT,
  CLIENT_ID,
  CLIENT_SECRET,
  API_URL,
  MONGODB_URI,
  RASA_NETWORK,
  TRACKER_STORE_URL,
  TASK_COMPLETE_REDIRECT_TARGET,
  BOT_TYPES,
  BOT_PORTS,
  ROOM_DESIRED_USERCOUNT
}