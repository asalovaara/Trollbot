import React, { useState } from 'react'

const MessageBox = ({ messages, setMessages }) => {
  const [message, setMessage] = useState('')

  const addMessage = (event) => {
    console.log('Send message')
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
    console.log('Change message input value')
    setMessage(event.target.value)
  }

  return (
    <div>
      <form onSubmit={addMessage}>
        Message:
        <input value={message} onChange={handleMessageChange} />
        <button type='submit'>Send</button>
      </form>
    </div>
  )
}

export default MessageBox