describe('Trollbot chat page end to end tests', function () {

  beforeEach(() => {
    cy.visit('http://localhost:3001')
  })

  const loginHelper = () => {
    cy.intercept('POST', '/login').as('login')
    cy.get('#username').type('cypress')
    cy.get('#login').click()
  }

  const logoutHelper = () => {
    cy.contains('Logout').click()
  }

  it('Front page can be visited', function () {
    loginHelper()
    cy.contains('Hello')
  })

  it('Can send a message', function () {
    loginHelper()
    cy.contains('Type message')
    cy.get('#message').type('Test message')
    cy.get('#submit').click()
    cy.contains('Test message')
  })

  after(() => {
    logoutHelper()
  })

})