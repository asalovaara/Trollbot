const { runLogger } = require('./services/eventLogger/logWriterService')

const main = async () => {
  const options = handleParameters()
  runLogger(options)
}

const handleParameters = () => {

  let options = {
    source: 'LOCAL',
    room: 'all',
    delete: false,
    list: false
  }

  const paramArray = process.argv.slice(2)
  for (let i = 0; i < paramArray.length; i++) {
    if (paramArray[i] === '--atlas') {
      options.source = 'ATLAS'
    } else if (paramArray[i] === '--delete') {
      options.delete = true
    } else if (paramArray[i] === '--room') {
      let roomName = constructRoomName(i + 1, paramArray)
      if (roomName != '') {
        options.room = roomName
      }
    } else if (paramArray[i] === '--list') {
      options.list = true
    }
  }

  if (options.list === true) {
    options.room = false
    options.delete = false
  }

  return options
}

const constructRoomName = (nameStart, paramArray) => {
  let j
  for (j = nameStart; j < paramArray.length; j++) {
    if (paramArray[j].substring(0, 2) === '--') {
      break
    }
  }
  return paramArray.slice(nameStart, j).join(' ')
}

main().catch(console.error)