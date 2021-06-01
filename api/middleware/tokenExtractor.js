const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenExtractor = (req, res, next) => {
  req.token = getTokenFrom(req)
  if (req.token === null) return res.status(401).json({ error: 'token missing or invalid' })
  next()
}

module.exports = tokenExtractor
