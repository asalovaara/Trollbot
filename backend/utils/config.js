require('dotenv').config({ path: '../.env' })

let PORT = process.env.PORT || 3001
let CLIENT_ID = process.env.CLIENT_ID
let CLIENT_SECRET = process.env.CLIENT_SECRET

module.exports = {
  PORT,
  CLIENT_ID,
  CLIENT_SECRET
}