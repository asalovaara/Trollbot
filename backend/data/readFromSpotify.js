const axios = require('axios')
const querystring = require('querystring');
const {client_id, client_secret} = require('./spotifyClientData')

const redirectUri = 'http://localhost:3001/';

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

let accessUrl = 'https://accounts.spotify.com/api/token'

const payload = client_id + ":" + client_secret
const encodedPayload = Buffer.from(payload).toString('base64')

const accessHeaders = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Authorization':'Basic ' + encodedPayload
}

//client_credentials type only allows us to access non-user-specific data (cannot access a user's playlists etc),
//we can only access global data such as albums and artists
const accessBody = {
  grant_type: 'client_credentials'
}

//function for getting the access token
const getAccessToken = () => {
  return axios
    .post(accessUrl, data=querystring.stringify(accessBody), {
      headers: accessHeaders
    })
    .then((response) => {
      return response.data.access_token
    })
    .catch((error) => {
      console.log(error)
      throw(error)
    })
}

//different urls for testing

//spotify api tutorial example url
let track_url = 'https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V'

//url for getting an album
let album_id = '2cKZfaz7GiGtZEeQNj1RyR'
let album_url = 'https://api.spotify.com/v1/albums/' + album_id

//url for getting an artist, includes genres etc
let artist_id_Ariana_Grande = '66CXWjxzNUsdJxJ2JdwvnR'
let artist_id_The_Weeknd = '1Xyo4u8uXC1ZmMpatF05PJ'
let artist_url = 	'https://api.spotify.com/v1/artists/' + artist_id_Ariana_Grande

//url for getting an artist's top tracks, requires market as a parameter
let market = 'FI'
let top_tracks_url = 'https://api.spotify.com/v1/artists/' + artist_id_Ariana_Grande + '/top-tracks?market=' + market

//here we use the access token to get data from the api
const getArtistInfo = () => {
  return getAccessToken()
  .then(token => {
    return axios.get(artist_url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  })
  .then((response) => {
    return parseInfo(response)
  })
  .catch((error) => {
    console.log(error)
    throw error
  })
}

//how to get this to be the bot answer..???
const printInfo = async () => {
  await getArtistInfo().then(data => {
    return data
  })
}

const parseInfo = (data) => {
  let text = ''
  text += parseName(data) + '\n'
  text += parseGenre(data) + '\n'
  text += parseFollowers(data)
  return text
}

const parseName = (data) => {
  let text = 'The artist\'s name is '
  text += data.data.name
  return text
}

const parseGenre = (data) => {
  let genres = data.data.genres
  let i
  let text = 'The genre(s) are: '
  for (i = 0; i < genres.length; i++) {
    if (genres.length > 1 && i == genres.length - 1) {
      text += genres[i]
    } else {
      text += genres[i] + ', ';
    }
  }
  return text
}

const parseFollowers = (data) => {
  let text = 'They have '
  text += data.data.followers.total + ' followers!'
  return text
}

module.exports = printInfo
