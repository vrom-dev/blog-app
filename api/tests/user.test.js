const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const api = require('./api')
const User = require('../models/user')

const { initialUser } = require('./testdata')
const { getUsers, getUsernames, usersInDb } = require('./helper')

describe('When there is initially one user in the db...', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const { username, name, password } = initialUser

    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
      username,
      name,
      passwordHash
    })
    await user.save()
  })

  test('the user is returned', async () => {
    const user = await getUsers()
    expect(user).toHaveLength(1)
  })

  test('the user has id property instead of _id', async () => {
    const [user] = await getUsers()

    expect(user.id).toBeDefined()
    expect(user._id).not.toBeDefined()
  })

  test('creation with fresh username succeeds with proper statuscode', async () => {
    const usersAtStart = await usersInDb()

    const user = {
      username: 'vromdev',
      name: 'Vic Romero',
      password: 'supersafe'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const usersAtEnd = await usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })

  test('creation with username already taken fails with proper statuscode and message', async () => {
    const usersAtStart = await usersInDb()

    await api
      .post('/api/users')
      .send(initialUser)
      .expect(400)
      .expect({
        error: `User validation failed: username: Error, expected \`username\` to be unique. Value: \`${initialUser.username}\``
      })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation without username fails with proper statuscode and message', async () => {
    const usersAtStart = await usersInDb()

    const user = {
      name: 'Vic Romero',
      password: '12345'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect({
        error: 'User validation failed: username: Path `username` is required.'
      })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation with username length under minimum allowed fails with proper status code and message', async () => {
    const usersAtStart = await usersInDb()

    const user = {
      username: 'xx',
      name: 'Vic Romero',
      password: '12345'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect({
        error: `User validation failed: username: Path \`username\` (\`${user.username}\`) is shorter than the minimum allowed length (3).`
      })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = getUsernames(usersAtEnd)
    expect(usernames).not.toContain(user.username)
  })

  test('creation without password fails with proper statuscode', async () => {
    const usersAtStart = await usersInDb()

    const user = {
      username: 'vromdev',
      name: 'Vic Romero'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect({ error: 'User validation failed: password is missing.' })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = getUsernames(usersAtEnd)
    expect(usernames).not.toContain(user.username)
  })

  test('creation with password shorter than minimum allowed length fails with proper statuscode and message', async () => {
    const usersAtStart = await usersInDb()

    const user = {
      username: 'vromdev',
      name: 'Vic Romero',
      password: '1'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect({
        error: `User validation failed: password: Path \`password\` (\`${user.password}\`) is shorter than the minimum allowed length (3).`
      })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).not.toContain(user.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
