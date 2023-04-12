jest.mock('../database/databaseService')

const { saveBotMessage, getBotMessage } = require('../services/rasaService')
const roomService = require('../services/roomService')
const {getRoomByLink} = require('../database/databaseService')

describe('Rasa Service unit tests', () => {
  const rooms = [{ name: 'Jest', roomLink: 'JestLink' },  {name:'Jest2', roomLink:'JestLink2' }]
  
  beforeAll(() => {
    saveBotMessage({ recipient_id: 'Jest', text: 'Test' })
    saveBotMessage({ recipient_id: 'Jest2', text: 'Test2' })
  })

  it('Finds and removes correct messages', async () => {
    getRoomByLink.mockReturnValue(Promise.resolve(rooms[0]))
    const first = await getBotMessage('JestLink')
    const second = await getBotMessage('JestLink')
    expect(first.body).toBe('Test')
    expect(second).toBe(undefined)
  })

})