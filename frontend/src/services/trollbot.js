import axios from 'axios'

const baseUrl = 'http://localhost:3001/trollbot'

const getMessages = () => {
  return axios.get(baseUrl).then(res => res.data)
}

// Adds a message and returns a list of current messages with the answer from the bot
const addMessage = async message => {
  const response = await axios.post(baseUrl, { message: message })
  return response.data
}

const clearMessages = () => {
  return axios.delete(baseUrl).then(res => res.data)
}

export default { getMessages, addMessage, clearMessages }
