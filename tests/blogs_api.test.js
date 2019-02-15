const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

beforeAll(async () => {
  await Blog.deleteMany({})

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('correct amount of blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const contents = response.body
  expect(contents.length).toBe(6)
})

test('blogs are identified by field id', async () => {
  const response = await api.get('/api/blogs')

  for (let blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

describe('adding blog', async () => {
  test('is possible', async () => {
    const newBlog = {
      title: 'Node on jännää',
      author: 'Jokusen Jaska',
      url: 'http://nettisivu.test',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body

    expect(blogs.length).toBe(7)

    expect(blogs[blogs.length - 1].title).toContain('Node on jännää')
  })

  test('without likes set will have likes value 0', async () => {
    const newBlog = {
      title: 'Tästä blogista ei tykkää kukaan',
      author: 'Blogiheebo',
      url: 'http://blog.blogblog.blog'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const lastBlog = response.body[response.body.length - 1]

    expect(lastBlog.likes).toBe(0)
  })

  test('without title results in 400 Bad request', async () => {
    const newBlog = {
      author: 'Blogiheebo',
      url: 'http://blog.blog',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('without url results in 400 Bad request', async () => {
    const newBlog = {
      title: 'blogi ilman urlia',
      author: 'Blogiheebo',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('deleting blog', async () => {
  test('can be done', async () => {
    const response = await api.get('/api/blogs')
    const blogToBeDeleted = response.body[0]

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .expect(204)

    const responseAfterDelete = await api.get('/api/blogs')
    const blogsAfterDelete = responseAfterDelete.body

    expect(blogsAfterDelete.length).toEqual(response.body.length - 1)

    expect(blogsAfterDelete[0].title).not.toBe('React patterns')
  })
})

describe('updating blog', async () => {
  test('by setting new value for likes succeeds', async() => {
    const response = await api.get('/api/blogs')
    const blogToBeUpdated = response.body[0]

    const blogWithUpdate = { ...blogToBeUpdated, likes: 1 }

    const updateResponse = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(blogWithUpdate)
      .expect(200)

    expect(updateResponse.body.likes).toBe(1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})