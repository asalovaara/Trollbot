import axios from 'axios'
import { API_URL } from '../config'

const baseUrl = `${API_URL}/rooms`

const addRoom = async (room) => {
  const response = await axios.post(baseUrl, room)
  return response
}

const getRooms = async () => {
  const response = await axios.get(baseUrl).then(res => res.data)
  return response
}
const getUsersInRoom = async (roomName) => {
  const response = await axios.get(`${baseUrl}/${roomName}/users`).then(res => res.data)
  return response
}

const getRoomMessages = async (roomName) => {
  const response = await axios.get(`${baseUrl}/${roomName}/messages`).then(res => res.data)
  return response
}

export default { addRoom, getRooms, getUsersInRoom, getRoomMessages }