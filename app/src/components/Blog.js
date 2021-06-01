import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, removeBlog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const toggleDetails = () => setShowDetails(!showDetails)

  const handleLikes = async (id) => {
    await blogService.addLike({ likes: likes + 1, id })
    setLikes(likes + 1)
  }

  return (
    <div className='blog'>
      <p>
        <strong>{blog.title}</strong>, by <em>{blog.author}</em>
      </p>
      <button onClick={toggleDetails} className='showMore'>{showDetails ? 'hide' : 'view'}</button>
      {
        showDetails
          ? (
            <>
              <p>{blog.url}</p>
              <p>likes: <span data-likes>{likes}</span> <button onClick={() => handleLikes(blog.id)}>like</button></p>
              <p>{blog.user.username}</p>
              <div>
                <button onClick={() => removeBlog(blog)}>remove</button>
              </div>
            </>
            )
          : ''
      }
    </div>
  )
}

Blog.propTypes = {
  removeBlog: PropTypes.func.isRequired,
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number.isRequired
  })
}

export default Blog
