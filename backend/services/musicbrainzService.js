const axios = require('axios')
const logger = require('../utils/logger')
const Artist = require('../models/artist')
const { API_URL, MONGODB_URI } = require('../utils/config')
const mongoose = require('mongoose')

const headers = {
  'User-Agent': 'Trollbot/1.0 (https://github.com/sumuh/Trollbot)'
}

const url = 'http://musicbrainz.org/ws/2/artist/?query=artist:'

const getArtist = async (artistName) => {
  return axios
    .get(url+artistName,
      {
        headers: headers
      }
    )
    .then((response) => {
      const firstResult = response.data.artists[0]
      const artistObj = {
        'professionalName': firstResult.name,
        //'gender': firstResult.gender,
        'genres': getBestTag(firstResult.tags)
      }

      //console.log(artistObj)

      return artistObj
    })
    .catch((error) => {
      logger.error('Error:', error)
      throw (error)
    })
}

// Takes array of tags (=genres) as parameter. Returns the tag with
// most 'counts' aka the most accurate tag
const getBestTag = (tags) => {
  let best = tags[0]
  let largestCount = tags[0].count
  for (let i = 1; i < tags.length; i++) {
    if (tags[i].count > largestCount) {
      best = tags[i]
      largestCount = tags[i].count
    }
  }
  return best.name
}

module.exports = { getArtist }
