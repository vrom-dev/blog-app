const logger = require('../utils/logger')

const errorHandler = (error, req, res, next) => {
  logger.error(error.message) // error.name

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Id format is not valid' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }

  next(error)
}

module.exports = errorHandler
