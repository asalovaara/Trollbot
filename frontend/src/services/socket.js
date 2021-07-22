import axios from 'axios'
import { API_URL } from '../config'


const getUser = async () => {
  const response = await axios.get('https://api.randomuser.me/')
  return response.data.results[0]
}

const getRoomMessages = async (roomId) => {
  const response = await axios.get(`${API_URL}/rooms/${roomId}/messages`)
  return response.data.messages
}

const getRoomUsers = async (roomId) => {
  const response = await axios.get(`${API_URL}/rooms/${roomId}/users`)
  return response.data.users
}


export default { getUser, getRoomMessages, getRoomUsers }
