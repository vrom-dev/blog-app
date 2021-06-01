describe('Blog app', () => {
  const users = [
    {
      name: 'Dan Abramov',
      username: 'danabramov',
      password: '1234'
    },
    {
      name: 'Vic Romero',
      username: 'vromdev',
      password: '1234'
    }
  ]
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/reset')
    users.forEach(user => cy.request('POST', 'http://localhost:3003/api/users', user))

    cy.login(users[0])
  })

  describe('Login', () => {
    it('a valid user can log in', () => {
      cy.contains('logout').click()
      cy.contains('login').click()
      cy.get('#username').type('danabramov')
      cy.get('#password').type('1234')
      cy.contains('Login').click()
      cy.contains('Logging as Dan Abramov')
      cy.contains('Dan Abramov is logged in')
    })

    it('login fails with wrong credentials', () => {
      cy.contains('logout').click()
      cy.contains('login').click()
      cy.get('#username').type('danabramov')
      cy.get('#password').type('abcde')
      cy.contains('Login').click()
      cy.contains('Wrong credentials')
      cy.should('not.contain', 'Dan Abramov is logged in')
    })
  })
  describe('when logged in', () => {
    it('a new blog can be added', () => {
      cy.contains('add blog').click()
      cy.get('#title').type('Just Javascript')
      cy.get('#author').type('Dan Abramov')
      cy.get('#url').type('http://www.justjavascript.com')
      cy.contains('Create new blog').click()

      cy.contains('a new blog "Just Javascript", by Dan Abramov added to the db')
      cy.contains('Just Javascript, by Dan Abramov')
    })

    it('likes can be increased', () => {
      const blog = {
        title: 'Overreacted',
        url: 'http://www.overreacted.io',
        author: 'Dan Abramov'
      }
      cy.createBlog(blog)
      cy.contains('view').click()
      cy.get('span').should('contain', '0')
      cy.contains('like').click()
      cy.get('span').should('contain', '1')
    })

    it('a blog can be deleted by its author', () => {
      const blog = {
        title: 'Overreacted',
        url: 'http://www.overreacted.io',
        author: 'Dan Abramov'
      }
      cy.createBlog(blog)
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', blog.title)
    })

    it('a blog cannot be deleted by other users', () => {
      const blog = {
        title: 'Overreacted',
        url: 'http://www.overreacted.io',
        author: 'Dan Abramov'
      }
      cy.createBlog(blog)
      cy.contains('logout').click()
      cy.login(users[1])
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('Request failed with status code 400')
      cy.get('html').should('contain', blog.title)
    })

    it('blogs are ordered by number of likes', () => {
      const blogs = [
        {
          title: 'Overreacted',
          url: 'http://www.overreacted.io',
          author: 'Dan Abramov',
          likes: 50
        },
        {
          title: 'Just Javascript',
          url: 'http://www.justjavascript.com',
          author: 'Dan Abramov',
          likes: 20
        },
        {
          title: 'Epic React',
          url: 'http://www.epicreact.com',
          author: 'Kent C Dodds',
          likes: 100
        }
      ]

      blogs.forEach(blog => {
        cy.createBlog(blog)
      })

      cy
        .get('.showMore')
        .click({ multiple: true })

      cy
        .get('[data-likes')
        .then(likes => {
          expect(likes[0]).to.contain(100)
          expect(likes[1]).to.contain(50)
          expect(likes[2]).to.contain(20)
        })
    })
  })
})
