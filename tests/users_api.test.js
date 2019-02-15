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

afterAll(() => {
  mongoose.connection.close()
})