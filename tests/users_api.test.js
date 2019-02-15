const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('with one user in db', async () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username:'testi', password:'salasana' })
    await user.save()
  })

  const newUser = {
    username: 'uusi',
    name: 'Uusi juuseri',
    password: 'salainen'
  }

  test('new user with different username can be added', async () => {
    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('this user can be retrieved', async () => {
    const users = await helper.usersInDb()

    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(users.length)
    expect(response.body[0].username).toBe(users[0].username)
  })
})

describe('cannot add user', async() => {
  let newUser = {}

  beforeEach(async () => {
    newUser = {
      username: 'testi',
      name: 'Testi testaaja',
      password: 'salasana'
    }

    await User.deleteMany({})
  })

  test('with same username cannot be added', async () => {
    const user = new User({ username:'testi', password:'salasana' })
    await user.save()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('`username` to be unique')
  })

  test('with less than 3 chars in username', async () => {
    newUser.username = 'te'

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('minimum allowed length (3).')
  })

  test('without username', async () => {
    delete newUser.username

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('`username` is required')
  })

  test('without password', async () => {
    delete newUser.password

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body).toEqual({ error: 'password missing' })
  })

  test('with password that has less than 3 chars', async () => {
    newUser.password = 'sa'

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body).toEqual({ error: 'password has less than 3 chars' })
  })
})

afterAll(() => {
  mongoose.connection.close()
})