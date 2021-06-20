//functions for parsing data into a nice format

const parseInfo = (data) => {
  let text = ''
  text += parseName(data) + '.\n'
  text += parseGenre(data) + '.\n'
  text += parseFollowers(data)
  return text
}

const parseName = (data) => {
  let text = 'The artist\'s name is '
  text += data.name
  return text
}

const parseGenre = (data) => {
  let genres = data.genres
  let i
  let text = 'The genre(s) are: '
  for (i = 0; i < genres.length; i++) {
    if (genres.length > 1 && i == genres.length - 1) {
      text += genres[i]
    } else {
      text += genres[i] + ', '
    }
  }
  return text
}

const parseFollowers = (data) => {
  let text = 'The artist has '
  text += data.followers.total + ' followers!'
  return text
}

exports.parseInfo = parseInfo
exports.parseName = parseName
exports.parseGenre = parseGenre
exports.parseFollowers = parseFollowers
