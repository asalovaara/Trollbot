import axios from 'axios'
import { API_URL } from '../config'

/*
 * Log generation router
 */

const baseUrl = `${API_URL}/log`

const logGen = async roomId => {
  try {
    await axios.post(`${baseUrl}/${roomId}`)
  } catch (e) {
    alert('Log generation failed.')
    console.log(e)
  }
}

const deleteConv = async roomId => {
  try {
    await axios.post(`${baseUrl}/${roomId}/delete`)
  } catch (e) {
    alert('Log deletion failed.')
    console.log(e)
  }
}

export default { logGen, deleteConv }