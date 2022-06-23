const crypto = require('crypto')

const generate = (length) => {
  const letters = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890"
  var ret = ""

  for ( var i = 0; i < length; i++) {
    ret += letters.charAt(crypto.randomInt(42))
  }
  return ret
}

module.exports = { generate }
