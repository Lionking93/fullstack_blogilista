const config = require('./utils/config')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const mongoUrl = config.mongoUrl

mongoose.connect(mongoUrl, { useNewUrlParser: true })

app.use(cors())
app.use(bodyParser.json())

app.use(middleware.tokenExtractor)
app.use('/api', usersRouter)
app.use('/api', blogsRouter)
app.use('/api', loginRouter)

module.exports = app