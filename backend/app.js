const express = require('express')
const cors = require('cors')
const path = require('path')
const trollbotRouter = require('./controllers/trollbotRouter')

const app = express()

app.use(express.json()) // for parsing JSON
app.use(express.urlencoded({ extended: true }))
app.use(cors()) // to enable cross-origin resource sharing
app.use(express.static(path.join(__dirname, 'build')))

app.use('/trollbot', trollbotRouter)

app.get('/*', (request, response) => {
  response.sendFile(path.join(__dirname, './build/index.html'), (error) => {
    if (error) {
      response.status(500).send(error)
    }
  })
})

if (process.env.NODE_ENV === 'test') {
  console.log('Testing mode detected')
}

module.exports = app