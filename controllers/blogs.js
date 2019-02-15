const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/blogs', async (request, response, next) => {
  const newBlog = request.body

  if (newBlog.likes === undefined)
    newBlog.likes = 0

  const blogToBeSaved = new Blog(newBlog)

  try {
    const result = await blogToBeSaved.save()
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
  }

  next(error)
}

blogsRouter.use(errorHandler)

module.exports = blogsRouter