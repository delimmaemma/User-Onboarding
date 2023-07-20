describe('Nav to Name Input', () => {
    it('Navigate to first name input and type first name', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#firstName').should('be.visible')
        cy.get('#firstName').type('John')
    })
    it('Navigate to last name input and type last name', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#lastName').should('be.visible')
        cy.get('#lastName').type('Doe')
    })
})

describe('Check Name Input', () => {
    it('Check if first name contains "John"', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#firstName').type('John')
        cy.get('#firstName').should('have.value', 'John')
    })
    it('Check if last name contains "Doe"', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#lastName').type('Doe')
        cy.get('#lastName').should('have.value', 'Doe')
    })
})

describe('Nav to Email Input', () => {
    it('Navigate to email input', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#email').should('be.visible')
    })
    it('Type email address', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#email').type('john@doe.com')  
    })
})

describe('Nav to Password Input', () => {
    it('Navigate to password input', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#password').should('be.visible')
    })
    it('Type password', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#password').type('!1Password')
    })
})

describe('Nav to Telephone Input', () => {
    it('Navigate to telephone input', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#tel').should('be.visible')
    })
    it('Type telephone number', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#tel').type('5555555555')
    })
})

describe('Nav to TOS Checkbox', () => {
    it('Navigate to TOS checkbox', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#tos').should('be.visible')
    })
    it('Click TOS checkbox', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#tos').click({force: true})
    })
})

describe('Nav to Submit Button', () => {
    it('Navigate to submit button', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#submit').should('be.visible')
    })
    it('Click submit button', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#firstName').type('John')
        cy.get('#lastName').type('Doe')
        cy.get('#email').type('john@doe.com')
        cy.get('#password').type('!1Password')
        cy.get('#tel').type('5555555555')
        cy.get('#submit').click()
    })
})

describe('Check for form validation if required area is left empty', () => {
    it('Attempt to click submit without any required data', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#submit').should('be.disabled')
    })
    it('Attempt to click submit without first name', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#lastName').type('Doe')
        cy.get('#email').type('john@doe.com')
        cy.get('#password').type('!1Password')
        cy.get('#tel').type('5555555555')
        cy.get('#submit').should('be.disabled')
    })
    it('Attempt to click submit without last name', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#firstName').type('John')
        cy.get('#email').type('john@doe.com')
        cy.get('#password').type('!1Password')
        cy.get('#tel').type('5555555555')
        cy.get('#submit').should('be.disabled')
    })
    it('Attempt to click submit without email', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#firstName').type('John')
        cy.get('#lastName').type('Doe')
        cy.get('#password').type('!1Password')
        cy.get('#tel').type('5555555555')
        cy.get('#submit').should('be.disabled')
    })
    it('Attempt to click submit without password', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#firstName').type('John')
        cy.get('#lastName').type('Doe')
        cy.get('#email').type('john@doe.com')
        cy.get('#tel').type('5555555555')
        cy.get('#submit').should('be.disabled')
    })
    it('Attempt to click submit without phone', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#firstName').type('John')
        cy.get('#lastName').type('Doe')
        cy.get('#email').type('john@doe.com')
        cy.get('#password').type('!1Password')
        cy.get('#submit').should('be.disabled')
    })
    it('Attempt to click submit with invalid phone', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#firstName').type('John')
        cy.get('#lastName').type('Doe')
        cy.get('#email').type('john@doe.com')
        cy.get('#password').type('!1Password')
        cy.get('#tel').type('555555555')
        cy.get('#submit').should('be.disabled')
    })
})