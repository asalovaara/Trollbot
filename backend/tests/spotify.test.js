const spotify = require('../services/spotifyService')

describe('Spotify Service unit tests', () => {

  it('Finds artist id', async () => {
    const response = await spotify.getArtistID('Ariana Grande')
    expect(response).toEqual('66CXWjxzNUsdJxJ2JdwvnR')
  })

  it('Finds artist info', async () => {
    const ariana_id = '66CXWjxzNUsdJxJ2JdwvnR'
    const response = await spotify.getArtistInfo(ariana_id)
    expect(response.name).toContain('Ariana Grande')
  })

  it('Finds finds  albums', async () => {
    const ariana_id = '66CXWjxzNUsdJxJ2JdwvnR'
    const response = await spotify.getArtistAlbums(ariana_id)
    const albums = response.items.map(a => a.name)
    expect(new Set(albums)).toContain('Dangerous Woman')
  })

  it('Finds generic genre', async () => {
    const ariana_name = 'Ariana Grande'
    const response = await spotify.getGenreByName(ariana_name)
    expect(response).toEqual('pop')
  })

  it('Finds niche genre', async () => {
    const abba_name = 'Abba'
    const response = await spotify.getGenreByName(abba_name)
    expect(response).toEqual('europop')
  })
  
})