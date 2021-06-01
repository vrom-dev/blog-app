const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', { author: 0, user: 0 })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const {
    username,
    name,
    password,
    notes
  } = req.body

  if (password === undefined) {
    return res.status(400).json({ error: 'User validation failed: password is missing.' })
  }

  if (password.length < 4) {
    return res.status(400).json({ error: `User validation failed: password: Path \`password\` (\`${password}\`) is shorter than the minimum allowed length (3).` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
    notes
  })

  const postedUser = await user.save()
  res.status(201).json(postedUser)
})

module.exports = usersRouter
