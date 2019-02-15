const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/users', async (request, response, next) => {
  try {
    const body = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash: passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch(exception) {
    next(exception)
  }
})

usersRouter.get('/users', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users.map(u => u.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter