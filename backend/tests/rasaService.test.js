const { saveBotMessage, getBotMessage } = require('../services/rasaService')

describe('Rasa Service unit tests', () => {

  beforeAll(() => {
    saveBotMessage({ recipient_id: 'Jest', text: 'Test' })
    saveBotMessage({ recipient_id: 'Jest2', text: 'Test2' })
  })

  it('Finds and removes correct messages', () => {
    const first = getBotMessage('Jest')
    const second = getBotMessage('Jest')
    expect(first.body).toBe('Test')
    expect(second).toBe(undefined)
  })

})