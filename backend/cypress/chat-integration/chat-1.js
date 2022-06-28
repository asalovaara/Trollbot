describe('Trollbot app E2E testing', () => {

  beforeEach(() => {
    localStorage.setItem('prolific_pid', 'TestDummyValue1')
    cy.visit('http://localhost:3001')
    loginHelper('Chatter1')
  })

  after(() => {
    logoutHelper()
  })

  const loginHelper = (username) => {
    cy.intercept('POST', '/login').as('login')
    cy.get('#username').type(username)
    cy.get('#login').click()
  }

  const logoutHelper = () => {
    cy.get('#logout').click()
  }

  // Tests

  it('Can visit a room', () => {
    cy.visit('/wait')
    cy.wait(500)
    cy.contains('You are now chatting')
  })

  it('Can send a message', () => {
    cy.visit('/wait')
    cy.wait(500)
    cy.get('#message-field').type('Test message')
    cy.get('#message-submit').click()
    cy.contains('Test message')
  })
})