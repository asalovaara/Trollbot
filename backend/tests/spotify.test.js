const spotify = require('../services/spotifyService')

test('Spotify service finds artist id', async () => {
  const response = await spotify.getArtistID('Ariana Grande')
  expect(response).toEqual('66CXWjxzNUsdJxJ2JdwvnR')
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

test('Spotify returns correct generic genre', async() => {
  const ariana_name = 'Ariana Grande'
  const response = await spotify.getGenreByName(ariana_name)
  expect(response).toEqual('pop')
})

test('Spotify returns correct niche genre', async() => {
  const abba_name = 'Abba'
  const response = await spotify.getGenreByName(abba_name)
  expect(response).toEqual('europop')
})
