import { useState, useRef } from 'react'
import Togglable from './Togglable'
import InputField from './InputField'

export default function BlogForm ({ addBlog }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const togglableRef = useRef()

  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleAuthorChange = (e) => setAuthor(e.target.value)
  const handleUrlChange = (e) => setUrl(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()
    const newBlog = {
      title,
      author,
      url
    }
    addBlog(newBlog)
    togglableRef.current.toggleVisibility()
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <Togglable
      buttonLabel='add blog'
      ref={togglableRef}
    >
      <form onSubmit={handleSubmit}>
        <InputField
          id='title'
          type='text'
          value={title}
          handleChange={handleTitleChange}
        />
        <InputField
          id='author'
          type='text'
          value={author}
          handleChange={handleAuthorChange}
        />
        <InputField
          id='url'
          type='text'
          value={url}
          handleChange={handleUrlChange}
        />
        <button type='submit'>Create new blog</button>
      </form>
    </Togglable>
  )
}
