require('dotenv').config({ path: '../.env' })

let PORT = process.env.PORT || 3001
let CLIENT_ID = process.env.CLIENT_ID || 'a117e260af7149c98fbfdbc38b50c898'
let CLIENT_SECRET = process.env.CLIENT_SECRET || '5e7090fc3f7d4ab1af7ca3c061b62e28'
let API_URL = process.env.API_URL || '/api'

module.exports = {
  PORT,
  CLIENT_ID,
  CLIENT_SECRET,
  API_URL
}