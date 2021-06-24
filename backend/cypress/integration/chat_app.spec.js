describe('Trollbot chat page end to end tests', function () {

  it('Front page can be visited', function () {
    cy.visit('http://localhost:3001')
    cy.contains('Hello')
  })

  it('Can send a message', function () {
    cy.contains('Type message')
    cy.get('#message').type('Elvis')
    cy.get('#submit').click()
    cy.contains('Elvis')
  })
})