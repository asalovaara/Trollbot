import React, { useState } from 'react'

const MessageBox = ({ messages, setMessages }) => {
  const [message, setMessage] = useState('')

  const addMessage = (event) => {
    event.preventDefault()
    if (message !== '') {
      const messageObject = {
        body: message,
        user: 'Human',
        date: new Date().toISOString(),
        id: messages.length + 1
      }
      setMessages(messages.concat(messageObject))
    }
    setMessage('')
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const clearMessages = (event) => {
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