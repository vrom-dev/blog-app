const blogsRouter = require('express').Router()

const userExtractor = require('../middleware/userExtractor')
const tokenExtractor = require('../middleware/tokenExtractor')

const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { name: 0, blogs: 0 })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const blog = await Blog
    .findById(id)
    .populate('user', { name: 0, blogs: 0 })
  if (blog) return res.json(blog)
  else return res.status(404).end()
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const { id } = req.params

  const { _id: userId } = req.user

  const blog = await Blog.findById(id)

  if (blog.user.toString() === userId.toString()) {
    const blogToDelete = await Blog.findByIdAndDelete(id)
    if (blogToDelete) return res.status(204).end()
  }

  return res.status(400).end()
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (req, res) => {
  const {
    title,
    author,
    url,
    likes = 0
  } = req.body

  const { user } = req

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const postedBlog = await blog.save()
  user.blogs = user.blogs.concat(postedBlog._id)
  await user.save()

  res.status(201).json(postedBlog)
})

blogsRouter.put('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const { id } = req.params
  const { likes } = req.body

  if (!likes) return res.status(400).end()

  const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true })

  if (updatedBlog) {
    res.status(200).json(updatedBlog)
  } else {
    res.status(404).end()
  }
})
module.exports = blogsRouter
