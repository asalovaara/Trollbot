require('dotenv').config({ path: '../.env' })

let PORT = process.env.PORT || 3001
let CLIENT_ID = process.env.CLIENT_ID
let CLIENT_SECRET = process.env.CLIENT_SECRET
let API_URL = process.env.API_URL || '/api'
let MONGODB_URI = process.env.MONGODB_URI
let APP_MONGODB_URI = process.env.APP_MONGODB_URI || MONGODB_URI
let RASA_NETWORK = process.env.RASA_NETWORK || 'http://localhost'
let TRACKER_STORE_URL = process.env.TRACKER_STORE_URL
let TASK_COMPLETE_REDIRECT_TARGET = process.env.TASK_COMPLETE_REDIRECT_TARGET || '/'

module.exports = {
  PORT,
  CLIENT_ID,
  CLIENT_SECRET,
  API_URL,
  MONGODB_URI,
  RASA_NETWORK,
  TRACKER_STORE_URL,
  TASK_COMPLETE_REDIRECT_TARGET
}