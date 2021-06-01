const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username: username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userObj = {
    username,
    id: user._id
  }

  const token = jwt.sign(userObj, process.env.SECRET)

  res
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name
    })
})

module.exports = loginRouter
