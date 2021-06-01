const api = require('./api')
const User = require('../models/user')
const Blog = require('../models/blog')

const getUsers = async () => {
  const response = await api
    .get('/api/users')
    .expect(200)

  return response.body
}

const usersInDb = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

const blogsInDb = async () => {
  const blogsDB = await Blog.find({})
  return blogsDB.map(user => user.toJSON())
}

const getUsernames = (usersArray) => {
  return usersArray.map(user => user.username)
}

const totalLikes = (blogsList) => {
  return blogsList.reduce((accumulator, blog) => accumulator + blog.likes, 0)
}

const favoriteBlog = (blogsList) => {
  const sortedBlogsByLikes = blogsList.sort((a, b) => b.likes - a.likes)
  return sortedBlogsByLikes[0]
}

const mostLikes = (blogsList) => {
  const sortedBlogsByLikes = blogsList.sort((a, b) => b.likes - a.likes)
  const mostLikedBlog = sortedBlogsByLikes[0]
  return {
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }
}

module.exports = {
  getUsers,
  getUsernames,
  usersInDb,
  blogsInDb,
  totalLikes,
  favoriteBlog,
  mostLikes
}
