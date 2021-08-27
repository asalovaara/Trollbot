const musicbrainz = require('../services/musicbrainzService')

test('returns correct professional name for artist', async () => {
  let metallica = await musicbrainz.getArtist('Metallica')
  expect(metallica.professionalName).toEqual('Metallica')
})

test('returns correct first name for artist', async () => {
  let ladygaga = await musicbrainz.getArtist('Lady Gaga')
  expect(ladygaga.firstname).toEqual('Stefani')
})

test('returns correct last name for artist', async () => {
  let edsheeran = await musicbrainz.getArtist('Ed Sheeran')
  expect(edsheeran.lastname).toEqual('Sheeran')
})

test('returns correct genre for artist', async () => {
  let drake = await musicbrainz.getArtist('Drake')
  expect(drake.genres).toEqual('hip hop')
})

test('returns correct gender for female artist', async () => {
  let rihanna = await musicbrainz.getArtist('Rihanna')
  expect(rihanna.gender).toEqual('female')
})

test('returns correct gender for male artist', async () => {
  let eltonjohn = await musicbrainz.getArtist('Elton John')
  expect(eltonjohn.gender).toEqual('male')
})

test('returns correct gender (undefined) for group', async () => {
  let abba = await musicbrainz.getArtist('Abba')
  expect(abba.gender).toEqual(undefined)
})
