const axios = require('axios')
const logger = require('../utils/logger')

const headers = {
  'User-Agent': 'Trollbot/1.0 (https://github.com/sumuh/Trollbot)'
}

const url = 'http://musicbrainz.org/ws/2/artist/?query=artist:'

const getArtist = async artistName => {
  return axios
    .get(url + artistName,
      {
        headers: headers
      }
    )
    .then((response) => {
      const firstResult = response.data.artists[0]

      if (firstResult === undefined) {
        return undefined
      }

      const fullName = firstResult['sort-name']
      let firstName = getFirstName(fullName)
      let lastName = getLastName(fullName)

      return {
        'professionalName': firstResult.name,
        'firstname': firstName,
        'lastname': lastName,
        'gender': firstResult.gender,
        'genres': getBestTag(firstResult.tags),
        'area': firstResult.area.name,
        'begin': firstResult['life-span'].begin,
        'end': firstResult['life-span'].end
      }
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

const getFirstName = (fullName) => {
  const arr = fullName.split(',')
  if (arr.length == 1) {
    return undefined
  }
  return arr[1]
}

const getLastName = (fullName) => {
  const arr = fullName.split(',')
  if (arr.length == 1) {
    return undefined
  }
  return arr[0]
}

module.exports = { getArtist }
