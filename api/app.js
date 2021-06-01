const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const {
  MONGO_DB_URI,
  MONGO_DB_URI_TEST,
  NODE_ENV
} = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const errorHandler = require('./middleware/errorHandler')
const unknownEndpoint = require('./middleware/unknownEndpoint')
const requestLogger = require('./middleware/requestLogger')

const mongoUrl = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

logger.info('Connecting to ', mongoUrl)

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => logger.info('Database connected'))
  .catch((error) => logger.error('Error connecting to the DB', error.message))

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use(express.static('../app/build'))

if (process.env.NODE_ENV === 'test') {
  const resetRouter = require('./controllers/reset')
  app.use('/api/reset', resetRouter)
}

app.use(errorHandler)
app.use(unknownEndpoint)

module.exports = app
