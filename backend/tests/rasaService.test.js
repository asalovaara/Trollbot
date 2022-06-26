const { saveBotMessage, getBotMessage } = require('../services/rasaService')
const roomService = require('../services/roomService')

describe('Rasa Service unit tests', () => {

  beforeAll(() => {
    roomService.addRoom({name:"Jest", roomLink:"JestLink"})
    roomService.addRoom({name:"Jest2", roomLink:"JestLink2"})
    saveBotMessage({ recipient_id: 'Jest', text: 'Test' })
    saveBotMessage({ recipient_id: 'Jest2', text: 'Test2' })
  })

  it('Finds and removes correct messages', () => {
    const first = getBotMessage('JestLink')
    const second = getBotMessage('JestLink')
    expect(first.body).toBe('Test')
    expect(second).toBe(undefined)
  })

})