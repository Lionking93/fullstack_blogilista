const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/blogs', async (request, response, next) => {
  const newBlog = request.body

  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (newBlog.likes === undefined)
      newBlog.likes = 0

    const user = await User.findById(decodedToken.id)
    newBlog.user = user.id

    const blogToBeSaved = new Blog(newBlog)

    const result = await blogToBeSaved.save()
    user.blogs = user.blogs.concat(result.id)
    await user.save()
    response.status(201).json(result.toJSON())
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/blogs/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(error) {
    next(error)
  }
})

blogsRouter.put('/blogs/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, request.body, { new: true })

    response.json(updatedBlog.toJSON())
  } catch(error) {
    next(error)
  }
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
}

blogsRouter.use(errorHandler)

module.exports = blogsRouter