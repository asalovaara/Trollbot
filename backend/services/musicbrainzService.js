const axios = require('axios')
const logger = require('../utils/logger')

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

      if (firstResult === undefined) {
        return undefined
      }

      const fullName = firstResult.sortname
      let firstName = getFirstName(fullName)
      let lastName = getLastName(fullName)

      const artistObj = {
        'professionalName': firstResult.name,
        'firstname': firstName,
        'lastname': lastName,
        'gender': firstResult.gender,
        'genres': getBestTag(firstResult.tags),
        'area': firstResult.area,
        'begin': firstResult.begin,
        'end': firstResult.end
      }

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

const getFullLegalName = (aliases) => {
  if (aliases === undefined) {
    return 'None'
  }
  for (let i = 0; i < aliases.length; i++) {
    if (aliases[i].type === 'Legal name') {
      return aliases[i].name
    }
  }

  return 'None'
}

const getFirstName = (fullName) => {
  const arr = fullName.split(',')
  if (arr.length == 1) {
    return 'None'
  }
  return arr[arr.length - 1]
}

const getLastName = (fullName) => {
  const arr = fullName.split(',')
  if (arr.length == 1) {
    return 'None'
  }
  return arr[0]
}

module.exports = { getArtist }
