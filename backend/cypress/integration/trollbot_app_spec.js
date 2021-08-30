describe('Trollbot app E2E testing', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000')
    loginHelper('cypress')
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

  it('Select room page can be visited', () => {
    cy.contains('Select Room')
  })

  it('Can visit admin page', () => {
    logoutHelper()
    loginHelper('Admin')
    cy.contains('Create Room')
  })

  it('Can create room in admin page', () => {
    logoutHelper()
    loginHelper('Admin')
    cy.contains('Create Room')
    cy.get('#room-field').type('Cypress')
    cy.get('#create-room-button').click()
    cy.get('#room-list').contains('Cypres')
    logoutHelper()
  })

  it('Can visit a room', () => {
    cy.get('#select-room').click()
    cy.get('#select-Cypress').click()
    cy.get('#join').click()
    cy.contains('Cypres')
  })

  it('Can send a message', () => {
    cy.get('#select-room').click()
    cy.get('ul li:first').click()
    cy.get('#join').click()
    cy.get('#message-field').type('Test message')
    cy.get('#message-submit').click()
    cy.contains('Test message')
  })
})