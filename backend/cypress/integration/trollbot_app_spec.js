describe('Trollbot app E2E testing', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3001')
    loginHelper('cypress', 'TestDummyValue')
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

  it('Select room page can be visited', () => {
    cy.contains('Select Room')
  })

  it('Can visit admin page', () => {
    logoutHelper()
    loginHelper('Admin', 'admin')
    cy.get('#admin').click()
    cy.contains('Create Room')
  })

  it('Can create room in admin page', () => {
    logoutHelper()
    loginHelper('Admin', 'admin')
    cy.get('#admin').click()
    cy.get('#room-field').type('Cypress')
    cy.get('#create-room-button').click()
    cy.get('#room-list').contains('Cypres')
  })
})