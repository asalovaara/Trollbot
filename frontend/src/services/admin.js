import axios from 'axios'
import { API_URL } from '../config'

const baseUrl = `${API_URL}/admin`

const addRoom = async (room) => {
  const response = await axios.post(baseUrl, room)
  return response
}

const getRooms = async () => {
  const response = await axios.get(baseUrl).then(res => res.data)
  return response
}

export default { addRoom, getRooms }