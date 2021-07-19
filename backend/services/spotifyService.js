const axios = require('axios')
const logger = require('../utils/logger')
const querystring = require('querystring')
const { CLIENT_ID, CLIENT_SECRET } = require('../utils/config')
var fs = require('fs')

/*
This module requires .env file in the root folder that contains Client ID and Client secret from the spotify app dashboard.
See {@link https://developer.spotify.com/dashboard/applications}.
*/

const client_id = CLIENT_ID
const client_secret = CLIENT_SECRET

process.on('unhandledRejection', error => {
  logger.info('unhandledRejection', error.message)
})

const accessUrl = 'https://accounts.spotify.com/api/token'
const payload = `${client_id}:${client_secret}`
const encodedPayload = Buffer.from(payload).toString('base64')

const accessHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': 'Basic ' + encodedPayload
}

const accessBody = {
  grant_type: 'client_credentials'
}

const getAccessToken = () => {
  const data = querystring.stringify(accessBody)
  return axios
    .post(accessUrl, data,
      {
        headers: accessHeaders
      }
    )
    .then((response) => {
      return response.data.access_token
    })
    .catch((error) => {
      logger.error('Token error:', error)
      throw (error)
    })
}

const getArtistID = (artist) => {
  return getAccessToken()
    .then(token => {
      return axios.get(`https://api.spotify.com/v1/search?q=${artist}&type=artist`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
    .then((response) => {
      return response.data.artists.items[0].id
    })
    .catch((error) => {
      logger.error(error)
      throw error
    })

}

const getArtistInfo = (artist_id) => {
  return getAccessToken()
    .then(token => {
      return axios.get(`https://api.spotify.com/v1/artists/${artist_id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      logger.error(error)
      throw error
    })
}

const getGenreByName = async (artist_name) => {
  return getArtistID(artist_name)
    .then(id => {
      return filterGenericGenre(id)
    })
    .catch((error) => {
      logger.error(error)
      throw error
    })
}

const getGenreById = (artist_id) => {
  return getAccessToken()
    .then(token => {
      return axios.get(`https://api.spotify.com/v1/artists/${artist_id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
    .then((response) => {
      return response.data.genres[0]
    })
    .catch((error) => {
      logger.error(error)
      throw error
    })
}

const getAllGenresById = (artist_id) => {
  return getAccessToken()
    .then(token => {
      return axios.get(`https://api.spotify.com/v1/artists/${artist_id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
    .then((response) => {
      return response.data.genres
    })
    .catch((error) => {
      logger.error(error)
      throw error
    })
}

//Function for checking if spotify's list of genres for the artist contains
//a generic genre, for example pop or rock. If it does, that genre is
//returned. If not, the first genre from the list is returned
const filterGenericGenre = (artist_id) => {
  return getAllGenresById(artist_id)
    .then(all => {

      const list = fs.readFileSync('./data/genres.txt').toString('utf-8')
      const splitted = list.split(';')

      let returnVal = all[0]

      for (let i = 0; i < splitted.length; i++) {
        for (let j = 0; j < all.length; j++) {
          if (splitted[i] === all[j]) {
            returnVal = splitted[i]
            break
          }
        }
      }

      return returnVal
    })
    .catch((error) => {
      logger.error(error)
      throw error
    })
}

const getArtistAlbums = (artist_id) => {
  return getAccessToken()
    .then(token => {
      return axios.get(`https://api.spotify.com/v1/artists/${artist_id}/albums`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      logger.error(error)
      throw error
    })
}

module.exports = { getArtistID, getGenreByName, getGenreById, getArtistInfo, getArtistAlbums }
