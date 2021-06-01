import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let component
  let mockHandler

  beforeEach(() => {
    mockHandler = jest.fn()
    component = render(
      <BlogForm
        addBlog={mockHandler}
      />
    )
  })

  test('event handler is called when adding a new blog', () => {
    const inputTitle = component.container.querySelector('#title')
    const inputAuthor = component.container.querySelector('#author')
    const inputUrl = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(inputTitle, {
      target: { value: 'vromdevBlog' }
    })
    fireEvent.change(inputAuthor, {
      target: { value: 'vromdev' }
    })
    fireEvent.change(inputUrl, {
      target: { value: 'http://www.vrom.dev' }
    })
    fireEvent.submit(form)
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('vromdevBlog')
    expect(mockHandler.mock.calls[0][0].author).toBe('vromdev')
    expect(mockHandler.mock.calls[0][0].url).toBe('http://www.vrom.dev')
  })
})
