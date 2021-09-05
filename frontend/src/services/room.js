import axios from 'axios'
import { API_URL } from '../config'

const baseUrl = `${API_URL}/rooms`

const addRoom = async room => {
  const response = await axios.post(baseUrl, room)
  return response.data
}

const getRooms = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getBot = async roomName => {
  const response = await axios.get(`${baseUrl}/${roomName}/bot`)
  return response.data
}
const getUsersInRoom = async roomName => {
  const response = await axios.get(`${baseUrl}/${roomName}/users`)
  return response.data
}

const getRoomMessages = async roomName => {
  const response = await axios.get(`${baseUrl}/${roomName}/messages`)
  return response.data
}

export default { addRoom, getRooms, getBot, getUsersInRoom, getRoomMessages }