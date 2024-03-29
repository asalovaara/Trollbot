
/*
 * this contains the npm logger -command functions.
 */


const info = (...params) => {
  if (process.env.NODE_ENV == 'development') {
    console.log(...params)
  }
}

const error = (...params) => {
  console.error('Error', params)
}

const show = (...params) => {
  console.log(...params)
}

module.exports = {
  info, error, show
}