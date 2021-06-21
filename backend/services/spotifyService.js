const axios = require('axios')
const querystring = require('querystring')
const { CLIENT_ID, CLIENT_SECRET } = require('../utils/config')

/* 
This module requires .env file in the root folder that contains Client ID and Client secret from the spotify app dashboard.
See {@link https://developer.spotify.com/dashboard/applications}.
*/

const client_id = CLIENT_ID
const client_secret = CLIENT_SECRET

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message)
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
      console.log('Token error:', error)
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
      return response.data.artists.items
    })
    .catch((error) => {
      console.log(error)
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
      console.log(error)
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
      console.log(error)
      throw error
    })
}

module.exports = { getArtistID, getArtistInfo, getArtistAlbums }
