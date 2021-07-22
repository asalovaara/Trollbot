require('dotenv').config({ path: '../.env' })

let PORT = process.env.PORT || 3001
let CLIENT_ID = process.env.CLIENT_ID
let CLIENT_SECRET = process.env.CLIENT_SECRET
let API_URL = process.env.API_URL || '/api'

module.exports = {
  PORT,
  CLIENT_ID,
  CLIENT_SECRET,
  API_URL
}