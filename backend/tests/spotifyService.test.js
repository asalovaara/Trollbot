const spotify = require('../services/spotifyService')

test('Spotify gets Elvis ablums', async () => {
  spotify.getArtistAlbums(
    '43ZHCT0cAZBISjO8DG9PnE',
    { limit: 10, offset: 20 },
    function (err, data) {
      if (err) {
        console.error('Something went wrong!')
      } else {
        console.log(data.body)
      }
    }
  )
})