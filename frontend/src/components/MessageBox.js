import React, { useState } from 'react'
import trollbotService from '../services/trollbot'

const MessageBox = ({ setMessages }) => {
  const [message, setMessage] = useState('')

  const addMessage = (event) => {
    event.preventDefault()
    if (message !== '') {
      trollbotService.addMessage(message).then(res => setMessages(res))
    }
    setMessage('')
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const clearMessages = (event) => {
    event.preventDefault()
    setMessages([])
  }

  return (
    <div>
      <form onSubmit={addMessage}>
        <div>
          Message: <input value={message} onChange={handleMessageChange} />
          <button type='submit'>Send</button>
          <button onClick={clearMessages}>Clear</button>
        </div>
      </form>
    </div>
  )
}

export default MessageBox