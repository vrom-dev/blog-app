const mongoose = require('mongoose')
const api = require('./api')
const bcrypt = require('bcrypt')
const { initialUser, initialBlogs } = require('./testdata')
const { blogsInDb } = require('./helper')
const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeAll(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const { username, name, password } = initialUser
  const passwordHash = await bcrypt.hash(password, 10)
  const userObj = new User({
    username,
    name,
    passwordHash
  })
  await userObj.save()

  for (const blog of initialBlogs) {
    blog.user = userObj._id
    const blogObj = new Blog(blog)
    await blogObj.save()
  }

  await api
    .post('/api/login')
    .send({ username, password })
    .then((res) => {
      return (token = res.body.token)
    })
})

describe('When there are initially some blogs in the db...', () => {
  test('all blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blogs have id property instead of _id', async () => {
    const blogs = await blogsInDb()

    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    })
  })

  test('a specific blog is within returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    const blogTitles = blogs.map(blog => blog.title)
    const randomIndex = Math.floor(Math.random() * initialBlogs.length)

    expect(blogTitles).toContain(initialBlogs[randomIndex].title)
  })
})

describe('When requesting one specific blog...', () => {
  test('it is return when using a valid id', async () => {
    const blogsAtStart = await blogsInDb()
    const randomIndex = Math.floor(Math.random() * blogsAtStart.length)
    const blogToRequest = blogsAtStart[randomIndex]

    const response = await api
      .get(`/api/blogs/${blogToRequest.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.id).toEqual(blogToRequest.id.toString())
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonExistingId = mongoose.Types.ObjectId()

    await api
      .get(`/api/get/blogs/${validNonExistingId}`)
      .expect(404)
  })
})

describe('When adding a new blog...', () => {
  test('authorized user can add blogs', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: 'React Blog',
      author: 'Dan Abramov',
      url: 'https://reactjs.org/',
      likes: 50
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    const blogTitles = blogsAtEnd.map(blog => blog.title)
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    expect(blogTitles).toContain('React Blog')
  })

  test('a blog is added with "like" property set to 0 when missing', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: 'React Blog',
      author: 'Dan Abramov',
      url: 'https://reactjs.org/'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  })

  test('a blog with no "title" or "url" is not added', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      author: 'Dan Abramov',
      likes: 28
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-type', /application\/json/)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('unauthorized users cannot add blogs', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: 'React Blog',
      author: 'Dan Abramov',
      url: 'https://reactjs.org/',
      likes: 50
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer 1234')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('When deleting blogs...', () => {
  test('if blog id is valid it is deleted with 204 statuscode', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  })

  test('fails if user is not authorized', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer 1234')
      .expect(401)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('When updating blogs...', () => {
  test('if blog id is valid it is updated with 200 statuscode', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: 88 })
      .expect(200)

    const blogsAtEnd = await blogsInDb()
    const updatedBlog = blogsAtEnd[0]
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(updatedBlog.likes).toBe(88)
  })

  test('if blog does not exist fails with statuscode 404', async () => {
    const validNonExistingId = mongoose.Types.ObjectId()

    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: 88 })
      .expect(404)
  })
  test('if id is invalid fails with statuscode 400', async () => {
    const invalidId = '5e8cae887f883f27e06f54a66'

    await api.put(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: 88 })
      .expect(400)
  })

  test('if token is invalid fails with statuscode 401', async () => {
    const invalidId = '5e8cae887f883f27e06f54a66'

    await api.put(`/api/blogs/${invalidId}`)
      .set('Authorization', 'Bearer 1234')
      .send({ likes: 88 })
      .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
