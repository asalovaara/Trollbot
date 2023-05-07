describe('Trollbot app E2E testing', () => {

  beforeEach(() => {
    localStorage.setItem('prolific_pid', 'TestDummyValue2')
    cy.visit('http://localhost:3001')
    loginHelper('Chatter2', 'Test')
  })

  after(() => {
    logoutHelper()
  })

  const loginHelper = (username, pid) => {
    cy.intercept('POST', '/login').as('login')
    cy.get('#username').type(username)
    cy.get('#prolific_pid').type(pid)
    cy.get('#login').click()
  }

  const logoutHelper = () => {
    cy.get('#logout').click()
  }

  // Tests

  it('Can visit a room', () => {
    cy.visit('/wait')
    cy.wait(100)
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