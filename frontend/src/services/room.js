import axios from 'axios'
import { API_URL } from '../config'

const baseUrl = `${API_URL}/rooms`

const addRoom = async room => {
  const response = await axios.post(baseUrl, room)
  return response.data
}

const addLink = async roomId => {
  const response = await axios.post(`${baseUrl}/${roomId}/link`)
  return response.data
}

const getLinks = async roomId => {
  const response = await axios.get(`${baseUrl}/${roomId}/link`)
  return response.data
}

const getRooms = async () => {
  const response = await axios.get(baseUrl)
  console.log(response.data)
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

const isRoomActive = async roomId => {
  const response = await axios.get(`${baseUrl}/${roomId}/active`)
  return response.data
}

const getActiveRoom = async () => {
  const response = await axios.get(`${baseUrl}/activeRoom`)
  return response.data
}

const activateRoom = async roomId => {
  const response = await axios.get(`${baseUrl}/${roomId}/activate`)
  return response.data
}

const getRoomSize = async () => {
  const response = await axios.get(`${baseUrl}/roomSize`)
  return response.data
}

const setRoomSize = async size => {
  console.log('Sending setRoomSize...')
  const response = await axios.post(`${baseUrl}/roomSize`, { size: size })
  return response.data
}

export default { addRoom, getRooms, getBot, getUsersInRoom, getRoomMessages, addLink, getLinks, isRoomActive, getActiveRoom, activateRoom, getRoomSize, setRoomSize }