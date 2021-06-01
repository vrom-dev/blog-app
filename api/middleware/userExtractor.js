const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (req, res, next) => {
  const { token } = req
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return res.status(401).json({
      error: 'Token missing or invalid'
    })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(401).json({
      error: 'Token missing or invalid'
    })
  }

  req.user = user

  next()
}

module.exports = userExtractor
