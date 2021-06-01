import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  // const removeBlog = component.getByText('remove')
  // fireEvent.click(removeBlog)
  // expect(mockHandler).toHaveBeenCalled()

  let component
  let mockHandler
  const blog = {
    title: 'blog1234',
    author: 'vic romero comino',
    url: 'http://vromdev.com',
    likes: 25,
    user: {
      username: 'vromdev'
    }
  }

  beforeEach(() => {
    mockHandler = jest.fn()
    component = render(
      <Blog
        blog={blog}
        removeBlog={mockHandler}
      />
    )
  })

  test('a blog initially renders title and author but not url and likes', () => {
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
    expect(component.container).not.toHaveTextContent(blog.url)
    expect(component.container).not.toHaveTextContent(blog.likes)
    component.getByText('view')
  })

  test('a blog renders url and likes when clicking view button', () => {
    const showButton = component.getByText('view')
    fireEvent.click(showButton)
    expect(component.container).toHaveTextContent(blog.url)
    expect(component.container).toHaveTextContent(blog.likes)
  })
})
