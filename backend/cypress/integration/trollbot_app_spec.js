describe('Trollbot app E2E testing', () => {

  beforeEach(() => {
    localStorage.setItem('prolific_pid', 'TestDummyValue')
    cy.visit('http://localhost:3001')
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
    cy.get('#admin').click()
    cy.contains('Create Room')
  })

  it('Can create room in admin page', () => {
    logoutHelper()
    loginHelper('Admin')
    cy.get('#admin').click()
    cy.get('#room-field').type('Cypress')
    cy.get('#create-room-button').click()
    cy.get('#room-list').contains('Cypres')
  })
})