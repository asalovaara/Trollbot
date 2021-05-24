const express = require('express')
const cors = require('cors')
const trollbotRouter = require('./controllers/trollbot')

const app = express()

app.use(express.json()) // for parsing JSON
app.use(express.urlencoded({ extended: true }))
app.use(cors()) // to enable cross-origin resource sharing

app.use('/trollbot', trollbotRouter)

module.exports = app