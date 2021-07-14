import axios from 'axios'
import { API_URL } from '../config'

const baseUrl = `${API_URL}/login`

const login = async (user) => {
  console.log('login body', user)
  const response = await axios.post(baseUrl, user)
  return response.data
}

const logout = async (user) => {
  const response = await axios.post(baseUrl, user)
  return response.data
}

const getUsers = () => {
  return axios.get(baseUrl).then(res => res.data)
}

export default { login, getUsers, logout }