const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')

const readFile = (file) => {

  const filePath = path.resolve(__dirname, file)

  try {
    let fileContents = fs.readFileSync(filePath, 'utf8')
    let data = yaml.load(fileContents)

    return data
  } catch (e) {
    console.log(e)
  }
}

module.exports = { readFile }

