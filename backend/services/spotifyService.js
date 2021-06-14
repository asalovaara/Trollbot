const SpotifyWebApi = require('spotify-web-api-node')

const spotify = new SpotifyWebApi({
  clientId: '41d679f3ac444f01ae541308d303e2ae',
  clientSecret: 'f1cf768b249c4dbe8161bdbe4aecff25',
  redirectUri: 'http://localhost:8888'
})

spotify.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
  function (data) {
    console.log('Artist albums', data.body)
  },
  function (err) {
    console.error(err)
  }
)

module.exports = spotify