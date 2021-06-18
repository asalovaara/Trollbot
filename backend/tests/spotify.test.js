const spotify = require('../services/spotifyService')

test('Spotify service finds artist id', async () => {
  const response = await spotify.getArtistID('Ariana Grande')
  expect(new Set(response.map(a => a.id))).toContain('66CXWjxzNUsdJxJ2JdwvnR')
})

test('Spotify service finds artist info', async () => {
  const ariana_id = '66CXWjxzNUsdJxJ2JdwvnR'
  const response = await spotify.getArtistInfo(ariana_id)
  expect(response.name).toContain('Ariana Grande')
})

test('Spotify service finds correct albums', async () => {
  const ariana_id = '66CXWjxzNUsdJxJ2JdwvnR'
  const response = await spotify.getArtistAlbums(ariana_id)
  const albums = response.items.map(a => a.name)
  expect(new Set(albums)).toContain('Dangerous Woman')
})
