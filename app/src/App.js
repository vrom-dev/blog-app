import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState('')

  const [notification, setNotification] = useState('')
  const [succeed, setSucceed] = useState(true)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogsApp')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const userLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem('loggedBlogsApp', JSON.stringify(user))
      blogService.setToken(user.token)
      setSucceed(true)
      setNotification(`Logging as ${user.name}`)
      setTimeout(() => {
        setNotification('')
      }, 3000)
      setUser(user)
    } catch (e) {
      setNotification('Wrong credentials')
      setSucceed(false)
      setTimeout(() => {
        setNotification('')
        setSucceed(true)
      }, 3000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const responseBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(responseBlog))
      setNotification(`a new blog "${responseBlog.title}", by ${responseBlog.author} added to the db`)
      setSucceed(true)
      setTimeout(() => {
        setNotification('')
      }, 3000)
    } catch (e) {
      setNotification(e.message)
      setSucceed(false)
      setTimeout(() => {
        setNotification('')
        setSucceed(true)
      }, 3000)
    }
  }

  const removeBlog = async (blogObject) => {
    const confirm = window.confirm(`Do your really want to delete ${blogObject.title} by ${blogObject.author}?`)
    if (!confirm) return

    try {
      await blogService.remove(blogObject.id)
      const blogIndex = blogs.findIndex(blog => blog.id === blogObject.id)
      const newBlogList = [...blogs]
      newBlogList.splice(blogIndex, 1)

      setBlogs(newBlogList)
      setNotification(`"${blogObject.title}" by ${blogObject.author} deleted from the db`)
      setSucceed(true)
      setTimeout(() => {
        setNotification('')
      }, 3000)
    } catch (e) {
      setNotification(e.message)
      setSucceed(false)
      setTimeout(() => {
        setNotification('')
        setSucceed(true)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogsApp')
    setUser('')
  }

  return (
    <div>
      {
        notification
          ? (succeed
              ? <Notification message={notification} />
              : <Notification message={notification} error />
            )
          : null
      }
      <h2>blogs</h2>
      {
        user
          ? <p>{user.name} is logged in <button onClick={handleLogout}>logout</button></p>
          : <LoginForm
              userLogin={userLogin}
            />
      }
      <h2>create new</h2>

      <BlogForm
        addBlog={addBlog}
      />
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            removeBlog={removeBlog}
          />
        )}
    </div>
  )
}

export default App
