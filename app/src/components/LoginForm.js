import { useState } from 'react'
import Togglable from '../components/Togglable'
import InputField from './InputField'

export default function LoginForm ({ userLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = (e) => setUsername(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)

  const handleLogin = (e) => {
    e.preventDefault()
    const user = { username, password }
    userLogin(user)
    setUsername('')
    setPassword('')
  }

  return (
    <Togglable
      buttonLabel='login'
    >
      <form onSubmit={handleLogin}>
        <InputField
          id='username'
          type='text'
          value={username}
          handleChange={handleUsernameChange}
        />
        <InputField
          type='password'
          value={password}
          id='password'
          handleChange={handlePasswordChange}
        />
        <button type='submit'>Login</button>
      </form>
    </Togglable>
  )
}
