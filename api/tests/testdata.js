const initialUser = {
  username: 'dan_abramov',
  name: 'Dan Abramov',
  password: 'overreacted'
}

const initialBlogs = [
  {
    title: 'vromdev - js developer',
    author: 'Víctor Romero',
    url: 'http://www.vrom.dev',
    likes: 3
  },
  {
    title: 'Kent C. Dodds blog',
    author: 'Kent C. Dodds',
    url: 'http://www.epicreact.io',
    likes: 2
  },
  {
    title: 'Just Javascript',
    author: 'Dan Abramov',
    url: 'http://www.overreacted.io',
    likes: 5
  }
]

module.exports = {
  initialBlogs,
  initialUser
}
