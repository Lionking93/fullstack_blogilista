const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/blogs', async (request, response) => {
  const newBlog = request.body

  if (newBlog.likes === undefined)
    newBlog.likes = 0

  const blogToBeSaved = new Blog(newBlog)

  const result = await blogToBeSaved.save()

  response.status(201).json(result)
})

module.exports = blogsRouter