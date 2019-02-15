const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/users', async (request, response, next) => {
  try {
    const body = request.body

    if (body.password === undefined)
      return response.status(400).json({ error: 'password missing' })

    if (body.password.length < 3)
      return response.status(400).json({ error: 'password has less than 3 chars' })

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
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
    response.json(users.map(u => u.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

usersRouter.use(errorHandler)

module.exports = usersRouter