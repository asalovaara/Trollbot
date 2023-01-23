import axios from 'axios'
import { API_URL } from '../config'

const baseUrl = `${API_URL}/login`

const login = async user => {
  console.log('login body', user)
  const response = await axios.post(baseUrl, user)
  return response.data
}

const logout = async user => {
  const response = await axios.post(baseUrl, user)
  return response.data
}

const getUsers = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// This is for handling login in different components

const handleLogin = async setUser => {
  const loggedUserJSON = window.localStorage.getItem('loggedUser')
  const loggedUser = JSON.parse(loggedUserJSON)

  const pid = (loggedUser && loggedUser.pid)? loggedUser.pid : window.localStorage.getItem('prolific_pid')
  if (loggedUserJSON && pid) {
    console.log('Found user in localstorage')
    const fetchUser = async () => {
      const userObject = await login({
        name: loggedUser.name,
        pid: pid
      })
      // Remove pid from localstorage, added to user object

      // just in case the login info changed
      if(!userObject) {
        console.log('Localstorage login failed')
        setUser(null)
        return false
      }
      window.localStorage.removeItem('prolific_pid')

      setUser({
        id: userObject.id,
        name: userObject.name,
        pid: userObject.pid
      })
    }
    await fetchUser()
    return true
  }
  return false
}

export default { login, getUsers, logout, handleLogin }